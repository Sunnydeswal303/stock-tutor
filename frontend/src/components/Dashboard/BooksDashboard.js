import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../pages/BooksDashboard.css";

const BooksDashboard = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publishedAt: "",
    totalCopies: null,
  });
  const [bookToDelete, setBookToDelete] = useState(null);

  const navigate = useNavigate();
  const resetNewBookFields = () => {
    setNewBook({
      title: "",
      author: "",
      publishedAt: "",
      totalCopies: null,
    });
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      toast.error("Failed to fetch books. Please try again.");
    }
  };

  const updateBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/books/${selectedBook.id}`,
        selectedBook,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Book updated successfully!");
      setIsEditModalOpen(false);
      fetchBooks();
    } catch (error) {
      toast.error("Failed to update the book. Try again.");
    }
  };

  const addBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/books/add", newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book added successfully!");
      setIsAddModalOpen(false);
      resetNewBookFields();
      fetchBooks();
    } catch (error) {
      toast.error("Failed to add the book. Try again.");
    }
  };

  const deleteBook = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/books/${bookToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Book deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchBooks();
    } catch (error) {
      toast.error("Failed to delete the book. Try again.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      navigate("/");
      return;
    }
    setUser(loggedInUser);
    fetchBooks();
  }, [navigate]);

  return (
    <div className="books-dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name || "User"}</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <main className="dashboard-main">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Available Books</h2>
          <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
            Add Book
          </button>
        </div>
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Available Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{new Date(book.publishedAt).toLocaleDateString()}</td>
                  <td>{book.totalCopies}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSelectedBook(book);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => {
                        setBookToDelete(book.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No books available to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Book</h3>
            <input
              type="text"
              placeholder="Title"
              value={selectedBook.title}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={selectedBook.author}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, author: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Published Date"
              value={selectedBook.publishedAt}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  publishedAt: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Available Copies"
              value={selectedBook.totalCopies}
              onChange={(e) =>
                setSelectedBook({
                  ...selectedBook,
                  totalCopies: parseInt(e.target.value),
                })
              }
            />
            <button onClick={updateBook}>Save Changes</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Book</h3>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Published Date"
              value={newBook.publishedAt}
              onChange={(e) =>
                setNewBook({ ...newBook, publishedAt: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Available Copies"
              value={newBook.totalCopies}
              onChange={(e) =>
                setNewBook({
                  ...newBook,
                  totalCopies: parseInt(e.target.value),
                })
              }
            />{" "}
            <button onClick={addBook}>Add Book</button>{" "}
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>{" "}
          </div>{" "}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this book?</h3>
            <button onClick={deleteBook} className="btn-confirm">
              Yes
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-cancel"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksDashboard;
