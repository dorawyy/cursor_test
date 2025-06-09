import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import Swipe from '../models/Swipe';
import Group from '../models/Group';
import { Client } from '@googlemaps/google-maps-services-js';

const router = express.Router();
const googleMapsClient = new Client({});

// Get next restaurant for swiping
router.get('/next', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { groupId, lat, lng, radius = 5000 } = req.query;

        // Get restaurants from Google Places API
        const response = await googleMapsClient.placesNearby({
            params: {
                location: { lat: Number(lat), lng: Number(lng) },
                radius: Number(radius),
                type: 'restaurant',
                key: process.env.GOOGLE_MAPS_API_KEY || ''
            }
        });

        // Filter out already swiped restaurants
        const swipedRestaurants = await Swipe.find({
            group: groupId,
            user: req.user?.userId
        }).select('restaurant.placeId');

        const swipedPlaceIds = swipedRestaurants.map(swipe => swipe.restaurant.placeId);
        const availableRestaurants = response.data.results
            .filter(place => place.place_id)
            .filter(place => !swipedPlaceIds.includes(place.place_id!)
        );

        if (availableRestaurants.length === 0) {
            return res.status(404).json({ message: 'No more restaurants to show' });
        }

        // Get details for the first available restaurant
        const place = availableRestaurants[0];
        const details = await googleMapsClient.placeDetails({
            params: {
                place_id: place.place_id!,
                fields: ['name', 'formatted_address', 'rating', 'photos', 'opening_hours'],
                key: process.env.GOOGLE_MAPS_API_KEY || ''
            }
        });

        res.json({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            location: place.geometry?.location,
            photoUrl: place.photos?.[0]?.photo_reference,
            openingHours: details.data.result.opening_hours
        });
    } catch (error) {
        console.error('Get next restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Record a swipe
router.post('/:restaurantId/swipe', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { groupId, action } = req.body;
        const { restaurantId } = req.params;

        // Create swipe record
        const swipe = new Swipe({
            user: req.user?.userId,
            group: groupId,
            restaurant: {
                placeId: restaurantId,
                name: req.body.name,
                address: req.body.address,
                rating: req.body.rating,
                photoUrl: req.body.photoUrl
            },
            action
        });

        await swipe.save();

        // Check if all group members have swiped
        const group = await Group.findById(groupId);
        
        if(!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const memberCount = group?.members.length || 0;
        const swipeCount = await Swipe.countDocuments({ group: groupId });

        if (memberCount === swipeCount) {
            // Calculate match
            const matches = await Swipe.aggregate([
                { $match: { group: groupId, action: 'like' } },
                { $group: { _id: '$restaurant.placeId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);

            if (matches.length > 0) {
                const matchedRestaurant = await Swipe.findOne({
                    group: groupId,
                    'restaurant.placeId': matches[0]._id
                });

                group.matchedRestaurant = matchedRestaurant?.restaurant;
                group.status = 'completed';
                await group.save();
            }
        }

        res.json(swipe);
    } catch (error) {
        console.error('Swipe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 