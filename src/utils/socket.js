const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.hash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

const intializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "*",
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, targetUserId }) => {
            // To increase the security, we generally have to use crypto library to generate roomId
            // const roomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        });
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
            // Save the message to the database
            try {
                const roomId = getSecretRoomId(userId, targetUserId);

                // Check if userId and targetUserId are friends
                const friends = await ConnectionRequestModel.find({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
                    ]
                });

                if(!friends){
                    return;
                }

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({ senderId: userId, text });
                socket.to(roomId).emit("messageReceived", { firstName, lastName, text });
            } catch (err) {
                console.log(err);
            }

        });
        socket.on("disconnect", () => { });
    })
}

module.exports = intializeSocket;