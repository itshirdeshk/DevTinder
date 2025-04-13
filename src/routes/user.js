const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const router = express.Router();

router.get('/requests/recieved ', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId", ["firstName", "lastName"]);

        return res.status(200).json({
            message: 'Connection requests fetched successfully',
            data: connectionRequests
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

router.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
            status: 'accepted'
        }).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", "firstName lastName");

        const data = connections.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        return res.json({ data });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

app.get('/feed', async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit;
        const skip = (page - 1) * limit;

        // Find all the connection requests (sent + recieved)
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");

        // Now, we want that the above users should not be shown in the feed.
        // So, we will create a set of users to hide from the feed.
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        // Now, we will find all the users except the above users.
        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select("firstName lastName photoUrl about skills").skip(skip).limit(limit);

        return res.json({ data: users })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

module.exports = router;