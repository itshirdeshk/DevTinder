const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const onlineUsers = new Map();

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
        let currentUserId, currentTargetUserId;
        socket.on("joinChat", ({ userId, targetUserId }) => {
            currentUserId = userId;
            currentTargetUserId = targetUserId;
            // To increase the security, we generally have to use crypto library to generate roomId
            // const roomId = [userId, targetUserId].sort().join("_");
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);

            onlineUsers.set(userId, socket.id);
            const isTargetOnline = onlineUsers.has(targetUserId);

            socket.emit("isTargetOnline", { isOnline: isTargetOnline });
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

                if (!friends) {
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
        socket.on("disconnect", () => {
            onlineUsers.delete(currentUserId);
            const roomId = getSecretRoomId(userId, targetUserId);

            socket.to(roomId).emit("targetDisconnected");
        });
    })
}

module.exports = intializeSocket;