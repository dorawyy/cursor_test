"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Swipe_1 = __importDefault(require("../models/Swipe"));
const Group_1 = __importDefault(require("../models/Group"));
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const router = express_1.default.Router();
const googleMapsClient = new google_maps_services_js_1.Client({});
// Get next restaurant for swiping
router.get('/next', auth_1.authenticateToken, async (req, res) => {
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
        const swipedRestaurants = await Swipe_1.default.find({
            group: groupId,
            user: req.user?.userId
        }).select('restaurant.placeId');
        const swipedPlaceIds = swipedRestaurants.map(swipe => swipe.restaurant.placeId);
        const availableRestaurants = response.data.results
            .filter(place => place.place_id)
            .filter(place => !swipedPlaceIds.includes(place.place_id));
        if (availableRestaurants.length === 0) {
            return res.status(404).json({ message: 'No more restaurants to show' });
        }
        // Get details for the first available restaurant
        const place = availableRestaurants[0];
        const details = await googleMapsClient.placeDetails({
            params: {
                place_id: place.place_id,
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
    }
    catch (error) {
        console.error('Get next restaurant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Record a swipe
router.post('/:restaurantId/swipe', auth_1.authenticateToken, async (req, res) => {
    try {
        const { groupId, action } = req.body;
        const { restaurantId } = req.params;
        // Create swipe record
        const swipe = new Swipe_1.default({
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
        const group = await Group_1.default.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const memberCount = group?.members.length || 0;
        const swipeCount = await Swipe_1.default.countDocuments({ group: groupId });
        if (memberCount === swipeCount) {
            // Calculate match
            const matches = await Swipe_1.default.aggregate([
                { $match: { group: groupId, action: 'like' } },
                { $group: { _id: '$restaurant.placeId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);
            if (matches.length > 0) {
                const matchedRestaurant = await Swipe_1.default.findOne({
                    group: groupId,
                    'restaurant.placeId': matches[0]._id
                });
                group.matchedRestaurant = matchedRestaurant?.restaurant;
                group.status = 'completed';
                await group.save();
            }
        }
        res.json(swipe);
    }
    catch (error) {
        console.error('Swipe error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
