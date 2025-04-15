const express = require('express');
const { Chat } = require('../models/chat');
const router = express.Router();

router.get('/:targetUserId/:page', userAuth, async (req, res) => {
    const { targetUserId, page } = req.params;
    const userId = req.user._id;
    let chat = await Chat
        .findOne({
            participants: { $all: [userId, targetUserId] }
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * 25)
        .limit(25)
        .populate({
            path: 'messages.senderId',
            select: 'firstName lastName',
        });

    if (!chat) {
        chat = new Chat({
            participants: { $all: [userId, targetUserId] },
            messages: [],
        });
    }

    res.json(chat);
});

module.exports = router;