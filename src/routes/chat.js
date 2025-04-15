const express = require('express');
const { Chat } = require('../models/chat');
const router = express.Router();

router.get('/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] }
    }).populate({
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