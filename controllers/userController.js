import express from "express";
import { createUser, getUserByUsername, getUserById, updateUser, deleteUser, getAllUsers, getUserByEmail, loginUser, deleteAllUsers } from "../repositories/userRepository.js";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.delete("/delete-all", deleteAllUsers);
router.get("/email/:email", getUserByEmail);
router.get("/username/:username", getUserByUsername);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;