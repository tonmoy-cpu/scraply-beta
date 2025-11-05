import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import verifyToken, { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const userRoute = express.Router();

// Admin-only routes
userRoute.post("/", verifyToken, verifyAdmin, createUser);
userRoute.get("/", verifyToken, verifyAdmin, getAllUsers);

// User routes
userRoute.get("/:id", verifyToken, verifyUser, getUserById);
userRoute.put("/:id", verifyToken, verifyUser, updateUser);
userRoute.delete("/:id", verifyToken, verifyUser, deleteUser);

export default userRoute;
