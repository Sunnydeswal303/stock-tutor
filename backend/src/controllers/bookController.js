import prisma from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addBook = async (req, res) => {
  try {
    const { title, author, publishedAt, totalCopies } = req.body;
    if (!title || !author || !publishedAt || !totalCopies) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publishedAt: new Date(publishedAt),
        totalCopies,
        availableCopies: totalCopies,
      },
    });

    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ error: "No copies available" });
    }

    await prisma.book.update({
      where: { id: bookId },
      data: { availableCopies: { decrement: 1 } },
    });

    const borrowRecord = await prisma.borrowRecord.create({
      data: { userId, bookId },
    });

    res
      .status(201)
      .json({ message: "Book borrowed successfully", borrowRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: Number(id) } });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishedAt, totalCopies } = req.body;

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        totalCopies,
        availableCopies: totalCopies,
      },
    });
    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetchUserBookCount = async (req, res) => {
  try {
    const borrowRecords = await prisma.borrowRecord.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
    });

    const userBookCounts = await Promise.all(
      borrowRecords.map(async (record) => {
        const user = await prisma.user.findUnique({
          where: {
            id: record.userId,
          },
        });

        return {
          userId: user.id,
          username: user.username,
          fullname: user.fullname,
          borrowedBooksCount: record._count.id,
        };
      })
    );

    res.status(200).json(userBookCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
