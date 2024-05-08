import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { googleLogout } from '@react-oauth/google';
import userProfileImg from '../img/userprofile.jpg';
import moment from 'moment';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TailSpin } from 'react-loader-spinner';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '75%',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [loadingPostId, setLoadingPostId] = useState(null);
    const [selectedComment, setSelectedComment] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false); // Added state for confirmation dialog
    const [showDeleteAccount, setShowDeleteAccount] = useState(false); // Added state for Delete Account tab
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        handleLogout(); // Log out if the token is expired
                    } else {
                        setUser(decoded);
                        await fetchUserComments(decoded);
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    handleLogout(); // Log out if the token is invalid or there's an error decoding it
                }
            } else {
                handleLogout(); // Log out if no token is found
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleDeleteAccount = async (event) => {
        event.preventDefault(); // Prevent form submission
        setShowConfirmation(true); // Show confirmation dialog
    };

    const handleConfirmedDeleteAccount = async () => {
        setShowConfirmation(false); // Close the confirmation dialog
        try {
            await axios.delete('/api/user/delete', {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
                data: { userId: user.userId },
            });

            // Clear user data and navigate to login page
            localStorage.removeItem('jwtToken');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account. Please try again.');
        }
    };

    const fetchUserComments = async (decoded) => {
        const url = decoded.googleId ? `/api/user-comments/${decoded.googleId}` : `/api/user-comments/user/${decoded.userId}`;
        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
            });
            setBlogPosts(response.data || []);  // Ensure default to array if undefined or null
        } catch (error) {
            console.error('Error fetching user comments:', error);
            setBlogPosts([]);  // Set to empty array on error
        } finally {
            setIsLoading(false);  // Adjusted to set loading false immediately
        }
    };


    const handleLogout = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        setLoggingOut(true); // Begin showing the loading animation
        setTimeout(() => {
            googleLogout();
            localStorage.removeItem('jwtToken');
            setUser(null);
            setLoggingOut(false); // Stop showing the loading animation
            navigate('/login');
        }, 1250); // Adjust delay as needed, here it's set to 3 seconds
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('MMMM Do YYYY, h:mm:ss a');
    };

    const handleOpenModal = (comment) => {
        setSelectedComment(comment);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleReadMoreClick = (postId) => {
        setLoadingPostId(postId); // Set loading state for the clicked post
        navigate(`/blog/${postId}`);
    };

    return (
        <div className="card text-center">
            <div className="card-header">
                <ul className="nav nav-pills justify-content-center">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${!showDeleteAccount ? "active" : ""}`}
                            onClick={() => setShowDeleteAccount(false)}
                            style={{
                                cursor: "pointer",
                                color: !showDeleteAccount ? "white" : "#FD5D14", // White if active, else #FD5D14
                            }}
                        >
                            Profile
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${showDeleteAccount ? "active" : ""}`}
                            onClick={() => setShowDeleteAccount(true)}
                            style={{
                                cursor: "pointer",
                                color: showDeleteAccount ? "white" : "#FD5D14", // White if active, else #FD5D14
                            }}
                        >
                            Delete Account
                        </a>
                    </li>
                </ul>
            </div>

            <div className="card-body">
                {loggingOut ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "20vh",
                            marginTop: "20px",
                        }}
                    >
                        <TailSpin color="rgb(253, 93, 20)" height={80} width={80} />
                    </div>
                ) : isLoading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "20vh",
                            marginTop: "20px",
                        }}
                    >
                        <TailSpin color="rgb(253, 93, 20)" height={100} width={100} />
                    </div>
                ) : user ? (
                    !showDeleteAccount ? (
                        // Profile Tab Content
                        <>
                            <div className="d-flex flex-column align-items-center mb-3">
                                <h2 className="card-title mb-0">
                                    Welcome, {user.googleName || user.username || "Admin"}
                                </h2>
                                <img
                                    src={user.googleProfilePic || userProfileImg}
                                    alt="Profile"
                                    className="rounded-circle mb-3"
                                    style={{ width: "100px", height: "100px" }}
                                />
                                <p className="card-text">
                                    <i className="fa fa-solid fa-envelope me-2 text-primary"></i>{" "}
                                    {user.email}
                                </p>
                                <button onClick={handleLogout} className="btn btn-danger mb-3">
                                    <i className="fa fa-solid fa-right-from-bracket me-2"></i>
                                    Logout
                                </button>
                            </div>
                            <h5 className="card-title mb-3" style={{ color: "#FD5D14" }}>
                                Comment History
                            </h5>
                            <div
                                className="row row-cols-1 row-cols-md-3 g-4"
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                {Array.isArray(blogPosts) && blogPosts.length > 0 ? (
                                    blogPosts.map((post) => (
                                        <div key={post.post._id} className="col mb-4">
                                            <div className="card h-100">
                                                <img
                                                    src={post.post.image}
                                                    className="card-img-top"
                                                    alt="Post"
                                                />
                                                <div className="card-body">
                                                    <Link
                                                        to={`/blog/${post.post._id}`}
                                                        className="text-decoration-none"
                                                    >
                                                        <h5
                                                            className="card-title"
                                                            style={{ color: "#FD5D14" }}
                                                        >
                                                            {post.post.title}
                                                        </h5>
                                                    </Link>
                                                    <img
                                                        src={user.googleProfilePic || userProfileImg}
                                                        alt="Profile"
                                                        className="rounded-circle mb-3"
                                                        style={{ width: "50px", height: "50px" }}
                                                    />
                                                    <p className="card-text comment-text">
                                                        {post.commentText.length > 150
                                                            ? `${post.commentText.substring(0, 250)}...`
                                                            : post.commentText}
                                                    </p>
                                                    {post.commentText.length > 100 && (
                                                        <button
                                                            onClick={() => handleOpenModal(post.commentText)}
                                                            className="btn btn-link"
                                                        >
                                                            Read All
                                                        </button>
                                                    )}
                                                    <p className="card-text">
                                                        <small className="text-muted date-text">
                                                            Posted on {formatDate(post.date)}
                                                        </small>
                                                    </p>
                                                    {loadingPostId === post.post._id ? (
                                                        <div className="d-flex justify-content-center">
                                                            <TailSpin
                                                                color="rgb(253, 93, 20)"
                                                                height={80}
                                                                width={80}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleReadMoreClick(post.post._id)}
                                                            className="btn btn-primary"
                                                        >
                                                            Read More
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <p>No comments available.</p>
                                        <Link
                                            to="/blog"
                                            className="btn btn-primary"
                                            style={{ marginTop: "20px" }}
                                        >
                                            Explore Blog
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Delete Account Tab Content
                        <>
                            <h2 className="card-title mb-4">Delete Account</h2>
                            <form onSubmit={handleDeleteAccount} className="mt-4">
                                <div className="mb-3">
                                    <label htmlFor="usernameInput" className="form-label">
                                        <i className="fa fa-solid fa-user me-2 text-primary"></i>
                                        Confirm Username
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usernameInput"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">
                                        <i className="fa fa-solid fa-lock me-2 text-primary"></i>
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="passwordInput"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-lg w-100 mb-3"
                                    onClick={() => setShowConfirmation(true)} // Open confirmation dialog
                                >
                                    <i className="fa fa-trash me-2"></i> Delete Account
                                </button>
                            </form>
                        </>
                    )
                ) : (
                    <p>User not found or not loaded.</p>
                )}
            </div>

{/* Confirmation Dialog */}
{showConfirmation && (
    <div className="modal-backdrop show">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Confirmation</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowConfirmation(false)}
                    ></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete your account? This action cannot be undone.
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowConfirmation(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleConfirmedDeleteAccount} // Call handleConfirmedDeleteAccount instead of handleDeleteAccount
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default Dashboard;
