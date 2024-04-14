import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLogin from './AdminLogin'; // Ensure this is correctly imported

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Assuming your API provides total pages info
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    validateToken();
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn, currentPage]);

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // If you do not have a backend endpoint for token validation, you might need to create one
        // or use a different method to check if the user is authenticated
        const response = await axios.get('/api/validateToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoggedIn(response.data.isValid); // Assuming the response has an isValid property
      } catch (error) {
        console.error('Error validating token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/blogposts?page=${currentPage}&limit=9`); // Assuming your endpoint supports pagination
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages); // Set total pages for pagination controls
    } catch (error) {
      console.error('There was an error fetching the blog posts:', error);
    }
  };

  const deletePost = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`/api/blogposts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Simply update the state to reflect the user is logged out
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="container-fluid py-6 px-5">
      <h2 className="text-center mb-5">Admin Dashboard</h2>
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post._id} className="col-lg-4 col-md-6">
            <div className="card h-100 d-flex flex-column">
              <img src={post.image} className="card-img-top" alt={post.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.title}</h5>
                <p dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + "..." }}></p>
                <div className="mt-auto d-grid gap-2">
                  <Link to={`/AdminEditPage/${post._id}`} className="btn btn-primary">Edit Post</Link>
                  <button onClick={() => deletePost(post._id)} className="btn btn-danger">Delete Post</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => {setCurrentPage(currentPage - 1); window.scrollTo(0, 0);}}>Previous</button>
            </li>
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${number + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => {setCurrentPage(number + 1); window.scrollTo(0, 0);}}>{number + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => {setCurrentPage(currentPage + 1); window.scrollTo(0, 0);}}>Next</button>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="btn btn-warning">Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
