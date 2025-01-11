import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../pages/UserDashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      toast.error("Failed to fetch books. Please try again.");
    }
  };

  const borrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/books/borrow",
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response) toast.success("Book borrowed successfully!");
      fetchBooks();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to borrow the book. Try again."
      );
    }
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 style={{ color: "white" }}>Welcome, {user?.name || "User"}</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        <h2>Available Books</h2>
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
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{new Date(book.publishedAt).toLocaleDateString()}</td>
                  <td>{book.availableCopies}</td>
                  <td>
                    {book.availableCopies > 0 ? (
                      <button
                        className="btn-borrow"
                        onClick={() => borrowBook(book.id)}
                      >
                        Borrow
                      </button>
                    ) : (
                      <span className="no-copies">Not Available</span>
                    )}
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
    </div>
  );
};

export default Dashboard;
