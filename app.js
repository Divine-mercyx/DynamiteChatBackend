import express from "express";
import userRoutes from "./controllers/userController.js";
import chatRoutes from "./controllers/chatController.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { addMessage } from "./repositories/chatRepository.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
connectDB();

const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with your frontend URL
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining the chat
    socket.on("join", (userId) => {
        socket.join("group-chat");
        console.log(`User ${userId} joined the group chat`);
    });

    // Handle new messages
    socket.on("sendMessage", async ({ userId, content }) => {
        try {
            const message = await addMessage(userId, content);
            io.to("group-chat").emit("newMessage", message);
        } catch (error) {
            socket.emit("error", { message: error.message });
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
