import express from "express";
import { getRecentMessages, getChatHistory, addMessage, deleteMessage } from "../repositories/chatRepository.js";

const router = express.Router();

// Get recent messages
router.get("/messages", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const messages = await getRecentMessages(limit);
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get chat history with pagination
router.get("/history", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const messages = await getChatHistory(page, limit);
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/send-message", async (req, res) => {
    try {
        const { userId, content } = req.body;
        const message = await addMessage(userId, content);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete-message/:messageId", async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await deleteMessage(messageId);
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 