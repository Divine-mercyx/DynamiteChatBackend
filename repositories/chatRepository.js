import Chat from "../models/chat.js";
import User from "../models/user.js";

export const getOrCreateGroupChat = async () => {
    let chat = await Chat.findOne({ isGroupChat: true });
    if (!chat) {
        chat = await Chat.create({
            isGroupChat: true,
            name: "Main Group Chat"
        });
    }
    return chat;
};


export const addMessage = async (userId, content) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const chat = await getOrCreateGroupChat();
        
        const message = {
            sender: userId,
            content,
            timestamp: new Date()
        };

        chat.messages.push(message);
        await chat.save();

        const populatedChat = await Chat.findById(chat._id)
            .populate('messages.sender', 'username');

        return populatedChat.messages[populatedChat.messages.length - 1];
    } catch (error) {
        throw new Error(`Failed to add message: ${error.message}`);
    }
};

export const getRecentMessages = async (limit = 50) => {
    try {
        const chat = await getOrCreateGroupChat();
        return await chat.getRecentMessages(limit);
    } catch (error) {
        throw new Error(`Failed to get messages: ${error.message}`);
    }
};

export const getChatHistory = async (page = 1, limit = 20) => {
    try {
        const chat = await getOrCreateGroupChat();
        const skip = (page - 1) * limit;
        
        const messages = await Chat.aggregate([
            { $match: { _id: chat._id } },
            { $unwind: "$messages" },
            { $sort: { "messages.timestamp": -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "messages.sender",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $project: {
                    _id: "$messages._id",
                    content: "$messages.content",
                    timestamp: "$messages.timestamp",
                    sender: { $arrayElemAt: ["$sender", 0] }
                }
            }
        ]);

        return messages;
    } catch (error) {
        throw new Error(`Failed to get chat history: ${error.message}`);
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const message = await Chat.findByIdAndDelete(messageId);
        return message;
    } catch (error) {
        throw new Error(`Failed to delete message: ${error.message}`);
    }
};