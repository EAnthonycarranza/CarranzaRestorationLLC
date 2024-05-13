import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import userProfileFallback from '../img/userprofile.jpg';
import TextField, {Textarea} from '@material/react-text-field';
import '@material/textfield/dist/mdc.textfield.css';

const Detail = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null); // New state for delete confirmation
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [error, setError] = useState('');
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentError, setCommentError] = useState('');
  const commentRefs = useRef(comments.reduce((acc, comment, index) => {
    acc[comment._id] = React.createRef();
    return acc;
  }, {}));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('googleUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          setIsTokenExpired(true); // Set token expired flag
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error('Token decoding error:', error);
        setIsTokenExpired(true); // Handle corrupt token
      }
    }
  }, []);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get('/api/blogposts');
        if (response.data.posts && Array.isArray(response.data.posts)) {
          // Work with response.data.posts here
          const filteredPosts = response.data.posts
            .filter((post) => post._id !== id) // Exclude current post
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by most recent
          setRecentPosts(filteredPosts.slice(0, 5)); // Take the 5 most recent posts
        } else {
          console.error('Expected posts array but got:', response.data.posts);
          setRecentPosts([]);
        }
      } catch (error) {
        console.error('There was an error fetching the blog posts:', error);
        setRecentPosts([]);
      }
    };

    fetchRecentPosts();
  }, [id]); // Ensure id is in the dependency array if it's defined outside the useEffect

  const handleSearch = () => {
    console.log('Search for:', searchKeyword);
    // Implement search logic here or navigate to search results
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    const fetchPostAndComments = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          axios.get(`/api/blogposts/${id}`),
          axios.get(`/api/blogposts/${id}/comments`)
        ]);
        setPost(postResponse.data);
        const updatedComments = Array.isArray(commentsResponse.data) ? commentsResponse.data.map(comment => ({
          ...comment,
          userId: comment.googleId  // Assuming 'googleId' is the property returned by the server
        })) : [];        
        setComments(updatedComments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    checkLoginStatus(); // Check login status when component mounts
    fetchPostAndComments();
  }, [id]);

  const handleLoginToComment = () => {
    navigate('/login');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || isTokenExpired) {
      navigate('/login');
      return;
    }
  
    // Trim the comment text and check if it's empty
    if (!commentText.trim()) {
      setCommentError('Comment must not be empty.');
      return; // Prevent submission if validation fails
    } else {
      setCommentError(''); // Clear error message if the text passes validation
    }
  
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('Please log in again.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post(`/api/blogposts/${id}/comments`, { comment: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments([...comments, response.data]);
      setCommentText(''); // Clear the text field after successful submission
    } catch (error) {
      if (error.response && error.response.data.error === 'Token verification failed or User not found') {
        setIsTokenExpired(true); // Set expired flag on specific backend error
        setError('Session expired. Please log in again.');
      } else {
        setError('Error posting comment. Please try again later.');
      }
    }
  };
  

  const startEditing = (comment) => {
    if (!user || isTokenExpired) {
      navigate('/login');
      return;
    }
    setEditingCommentId(comment._id);
    setEditingText(comment.comment);
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
  
    if (!Array.isArray(comments)) {
      console.error('Invalid comments data');
      return;
    }
  
    const commentToEdit = comments.find(comment => comment._id === editingCommentId);
  
    if (!commentToEdit) {
      console.error('Comment not found');
      return;
    }
  
    if (user && commentToEdit.googleId === user.googleId) {
      try {
        const response = await axios.put(
          `/api/comments/${editingCommentId}`,
          { comment: editingText, lastEdited: new Date() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedComments = comments.map(comment => {
          if (comment._id === editingCommentId) {
            return { ...comment, comment: editingText, lastEdited: new Date() };
          }
          return comment;
        });
        setComments(updatedComments);
        cancelEdit();
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    } else {
      alert('You can only edit your own comments.');
    }
  };  

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteConfirmation = (commentId) => {
    if (!user || isTokenExpired) {
      navigate('/login');
      return;
    }
    setDeleteConfirmationId(commentId);
  };
  

  const handleCancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  const handleDeleteComment = async (commentId) => {

    const token = localStorage.getItem('jwtToken');
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Function to toggle the expanded state of comments and scroll to them
  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }), () => scrollToComment(commentId)); // Scroll after state update
  };

  const scrollToComment = (id) => {
    const commentElement = commentRefs.current[id]?.current;
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

return (
  <div className="container-fluid py-6 px-5">
    <div className="row g-5">
      <div className="col-lg-8">
        {post && (
          <>
            <div className="mb-5">
              <img src={post.image} alt="Preview" className="image-preview mb-3 text-center" style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px', 
                marginTop: '20px'
              }}>
                <div>
                  <img src={post.avatar} alt="Avatar" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
                  <span className="fw-bold">{post.author}</span>
                </div>
                <span><i className="far fa-calendar-alt text-primary me-2"></i> {moment(post.date).format('MMM DD, YYYY')}</span>
              </div>
              <h1 className="text-uppercase mb-4" style={{ marginBottom: '20px' }}>{post.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="blog-content"></div>
            </div>
    
            <div className="mb-5">
              <h3 className="text-uppercase mb-4">{comments.length} Comments</h3>
              {Array.isArray(comments) && comments.map((comment, index) => (
                <div key={index} className="card mb-4 position-relative">
                  <div className="position-absolute top-0 end-0 p-2">
                    {user && user.googleId === comment.googleId && (
                      deleteConfirmationId === comment._id ? (
                        <>
                          <button className="btn btn-danger" onClick={() => handleDeleteComment(comment._id)}>Confirm Delete</button>
                          <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <i className="text-primary btn fas fa-edit mx-2"
                            onClick={() => startEditing(comment)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                          <i className="text-primary btn fas fa-trash mx-2"
                            onClick={() => handleDeleteConfirmation(comment._id)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                        </>
                      )
                    )}
                  </div>
                  <div className="card-body d-flex align-items-center">
                    <img
                      src={comment.userProfilePic || userProfileFallback}
                      alt="Avatar"
                      className="rounded-circle position-absolute"
                      style={{ width: '45px', height: '45px', top: '10px', left: '10px' }}
                    />
                    <div style={{ marginLeft: '60px' }}> {/* Adjust marginLeft to push content next to the image */}
                      <h6 className="mb-1" style={{ color: '#3366FF' }}>{comment.user?.googleName || comment.username}</h6>
                      {editingCommentId === comment._id ? (
                        <form onSubmit={handleEditSubmit}>
                          <label className="mdc-text-field mdc-text-field--textarea" style={{ display: 'block', width: '100%', border: '1px solid #ccc', padding: '10px' }}>
                            <span className="mdc-text-field__ripple"></span>
                            <textarea
                              className="mdc-text-field__input"
                              rows="4"
                              cols="40"
                              aria-label="Label"
                              style={{ width: '100%', boxSizing: 'border-box' }}  // Ensure textarea does not overflow its container
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            ></textarea>
                          </label>
                          <div style={{ marginTop: '20px' }}>  {/* Adjust marginTop to create space between the textarea and buttons */}
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px', marginTop: '0px' }}>Save</button>
                            <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                          </div>
                          <div style={{ marginTop: '10px' }}>
                            <small className="text-muted" style={{ color: '#666' }}>
                              {moment(comment.lastEdited || comment.date).format('MMMM Do YYYY, h:mm A')}
                            </small>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="mb-1" style={{ color: '#333' }}>
                            {comment.comment.length > 300 && !expandedComments[comment._id]
                              ? `${comment.comment.substring(0, 300)}... `
                              : comment.comment}
                            {comment.comment.length > 300 && (
                              <span
                                className="text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleCommentExpansion(comment._id)}
                              >
                                {expandedComments[comment._id] ? ' Read Less' : 'Read More'}
                              </span>
                            )}
                          </p>
                          <small className="text-muted" style={{ color: '#666' }}>
                            {moment(comment.lastEdited || comment.date).format('MMMM Do YYYY, h:mm A')}
                            {comment.lastEdited && " (edited)"}
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
    
            <div className="bg-light p-5">
              {user ? (
                <>
                  <h3 className="text-uppercase mb-4">Leave a comment</h3>
                  <form onSubmit={handleCommentSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <textarea
                          className="form-control bg-white border-0"
                          rows="5"
                          placeholder="Comment"
                          value={commentText}
                          onChange={(e) => {
                            setCommentText(e.target.value);
                            if (commentError) setCommentError(''); // Clear error when user starts typing again
                          }}
                        ></textarea>
                        {commentError && <div style={{ color: 'red' }}>{commentError}</div>}
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit">Post Comment</button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <button onClick={handleLoginToComment} className="btn btn-primary w-100 py-3" style={{ marginTop: '10px', padding: '15px' }}>Login to Comment</button>
              )}
            </div>
          </>
        )}
      </div>
    
      <div className="col-lg-4">
        {/* Omitted search bar */}
        <div className="mb-5">
          <h3 className="text-uppercase mb-4">Recent Posts</h3>
          {Array.isArray(recentPosts) && recentPosts.map((post) => (
            <div key={post._id} className="bg-light mb-3 p-3">
              <Link to={`/blog/${post._id}`}>
                <img src={post.image} alt={post.title} className="image-preview mb-3 text-center" style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
              </Link>
              <div className="d-flex justify-content-between mb-1">
                <div className="d-flex align-items-center">
                  <img src={post.avatar} alt="Avatar" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
                  <span className="fw-bold">{post.author}</span>
                </div>
                <span><i className="far fa-calendar-alt text-primary me-2"></i> {moment(post.date).format('MMM DD, YYYY')}</span>
              </div>
              <h5 className="mb-1">{post.title}</h5>
              <Link to={`/blog/${post._id}`} className="btn btn-primary" style={{ marginTop: '20px' }}>Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

};

export default Detail;
