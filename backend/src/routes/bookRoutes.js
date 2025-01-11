import express from "express";
import {
  addBook,
  borrowBook,
  fetchAllBooks,
  fetchSingleBook,
  updateBook,
  deleteBook,
  fetchUserBookCount,
} from "../controllers/bookController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticateToken, addBook);
router.post("/borrow", authenticateToken, borrowBook);
router.get("/", authenticateToken, fetchAllBooks);
router.get("/:id", authenticateToken, fetchSingleBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);
router.get("/user-book-count", authenticateToken, fetchUserBookCount);
export default router;
