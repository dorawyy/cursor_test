import express from 'express';
import Group from '../models/Group';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create a new group
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const { name, preferences } = req.body;   
        const group = new Group({
            name,
            creator: req.user?.userId,
            members: [req.user?.userId],
            preferences
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's groups
router.get('/my-groups', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const groups = await Group.find({
            members: req.user?.userId
        }).populate('members', 'name email');
        res.json(groups);
    } catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Join a group
router.post('/:groupId/join', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!req.user?.userId || group.members.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        group.members.push(req.user?.userId);
        await group.save();

        res.json(group);
    } catch (error) {
        console.error('Join group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Leave a group
router.post('/:groupId/leave', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!req.user || group.creator.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Creator cannot leave the group' });
        }

        group.members = group.members.filter(
            member => member.toString() !== req.user!.userId
        );
        await group.save();

        res.json(group);
    } catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get group details
router.get('/:groupId', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const group = await Group.findById(req.params.groupId)
            .populate('members', 'name email')
            .populate('creator', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.json(group);
    } catch (error) {
        console.error('Get group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 