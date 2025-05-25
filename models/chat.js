import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    messages: [messageSchema],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroupChat: {
        type: Boolean,
        default: true
    },
    name: {
        type: String,
        default: "Group Chat"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add method to get recent messages
chatSchema.methods.getRecentMessages = async function(limit = 50) {
    const messages = await Chat.findById(this._id)
        .populate('messages.sender', 'username')
        .select('messages')
        .lean();
    
    return messages.messages
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;