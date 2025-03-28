const express = require('express');
const router = express.Router();

const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

router.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatusType = ['ignored', 'interested'];

        if (!allowedStatusType.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the connection request already exists
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save();
        return res.json({
            message: "Connection request sent successfully",
            data
        })
    } catch (error) {
        res.status(400).send("ERROR: ", error.message);
    }
})