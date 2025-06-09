"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Group_1 = __importDefault(require("../models/Group"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Create a new group
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, preferences } = req.body;
        const group = new Group_1.default({
            name,
            creator: req.user?.userId,
            members: [req.user?.userId],
            preferences
        });
        await group.save();
        res.status(201).json(group);
    }
    catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get user's groups
router.get('/my-groups', auth_1.authenticateToken, async (req, res) => {
    try {
        const groups = await Group_1.default.find({
            members: req.user?.userId
        }).populate('members', 'name email');
        res.json(groups);
    }
    catch (error) {
        console.error('Get groups error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Join a group
router.post('/:groupId/join', auth_1.authenticateToken, async (req, res) => {
    try {
        const group = await Group_1.default.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!req.user?.userId || group.members.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }
        group.members.push(req.user?.userId);
        await group.save();
        res.json(group);
    }
    catch (error) {
        console.error('Join group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Leave a group
router.post('/:groupId/leave', auth_1.authenticateToken, async (req, res) => {
    try {
        const group = await Group_1.default.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!req.user || group.creator.toString() === req.user.userId) {
            return res.status(400).json({ message: 'Creator cannot leave the group' });
        }
        group.members = group.members.filter(member => member.toString() !== req.user.userId);
        await group.save();
        res.json(group);
    }
    catch (error) {
        console.error('Leave group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get group details
router.get('/:groupId', auth_1.authenticateToken, async (req, res) => {
    try {
        const group = await Group_1.default.findById(req.params.groupId)
            .populate('members', 'name email')
            .populate('creator', 'name email');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
    }
    catch (error) {
        console.error('Get group error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
