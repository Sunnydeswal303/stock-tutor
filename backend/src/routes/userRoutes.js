import express from "express";
import {
  registerUser,
  loginUser,
  fetchAllUsers,
  fetchSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, fetchAllUsers);
router.get("/:id", authenticateToken, fetchSingleUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
