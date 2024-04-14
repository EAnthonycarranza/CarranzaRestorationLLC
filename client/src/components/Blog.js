import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // Adjust based on your preference
  const [totalPages, setTotalPages] = useState(1); // Adjust based on response

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/blogposts?page=${currentPage}&limit=${postsPerPage}`);
        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages); // Adjust according to your response structure
      } catch (error) {
        console.error('There was an error fetching the blog posts:', error);
        setPosts([]); // Set to empty array on error
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePreviousPage = (event) => {
    event.preventDefault();
    setCurrentPage(Math.max(1, currentPage - 1));
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handleNextPage = (event) => {
    event.preventDefault();
    setCurrentPage(Math.min(totalPages, currentPage + 1));
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handlePageClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
        <h1 className="display-5 text-uppercase mb-4">Latest Articles From Our Blog</h1>
      </div>
      <div className="row g-4">
{Array.isArray(posts) && posts.map((post) => (
  <div key={post._id} className="col-lg-4 col-md-6 d-flex" style={{ marginBottom: '1rem' }}>
    <div className="bg-light w-100 d-flex flex-column" style={{ height: '100%' }}>
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img className="img-fluid" src={post.image} alt={post.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      </div>
      <div className="p-4 d-flex flex-column justify-content-between" style={{ flex: '1' }}>
        <div style={{ minHeight: '100px' }}> {/* Set a minimum height for the text container */}
          <h4 className="mt-2 text-uppercase">{post.title}</h4>
          <div className="d-flex align-items-center">
            <img src={post.avatar} alt="Avatar" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
            <p className="text-muted mb-0 me-3">By {post.author}</p>
            <span className="ms-auto">
              <i className="far fa-calendar-alt text-primary me-2"></i>
              <span className="text-muted">{moment(post.date).format('MMM DD, YYYY')}</span>
            </span>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: 'auto' }}>
          <Link to={`/blog/${post._id}`} className="btn btn-primary" style={{ marginTop: '20px' }}>Read More</Link>
        </div>
      </div>
    </div>
  </div>
))}

      </div>

      {/* Pagination */}
      <div className="row">
        <div className="col-12">
          <nav aria-label="Page navigation">
          <ul className="pagination pagination-lg justify-content-center m-0 pagination-container">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a href="#" className="page-link rounded-0" onClick={handlePreviousPage} aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a href="#" className="page-link" onClick={(event) => handlePageClick(event, index + 1)}>{index + 1}</a>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a href="#" className="page-link rounded-0" onClick={handleNextPage} aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Blog;
