import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from './AdminLogin'; // Import the AdminLogin component
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Include styles for ReactQuill

const BlogCreator = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // State for avatar image URL
  const [imageUrl, setImageUrl] = useState(''); // State for image URL
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  BlogCreator.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };
  
  BlogCreator.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];  

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Replace with your backend token validation endpoint
        const response = await axios.get('/api/validateToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // The response should indicate whether the token is valid
        setIsLoggedIn(response.data.isValid);
      } catch (error) {
        console.error('Error validating token', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const postData = {
      title,
      content,
      author,
      image: imageUrl,
      avatar: avatarUrl, // Include avatar URL in the post data
    };

    try {
      await axios.post('/api/blogposts', postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error posting blog', error);
      // If there's an error (e.g., 401 Unauthorized), log out the user
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Render AdminLogin if not logged in or the token is invalid
  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={validateToken} />;
  }

  // Render submission success message
  if (submitted) {
    return <div>Blog post submitted successfully!</div>;
  }

  return (
    <div className="container my-5">
<h2 style={{ textAlign: 'center' }}>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit} className="mt-4">
                {/* Input field for avatar image URL */}
                <div className="mb-3 row">
          <label htmlFor="avatarUrlInput" className="col-sm-2 col-form-label">Avatar Image URL:</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="avatarUrlInput"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Enter avatar image URL"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="authorInput" className="col-sm-2 col-form-label">Author:</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="authorInput"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3 row">
  <label htmlFor="imageUrlInput" className="col-sm-2 col-form-label">Image URL:</label>
  <div className="col-sm-10">
    <input
      type="text"
      className="form-control"
      id="imageUrlInput"
      value={imageUrl}
      onChange={(e) => setImageUrl(e.target.value)}
      placeholder="Enter image URL"
    />
  </div>
</div>

        <div className="mb-3 row">
          <label htmlFor="titleInput" className="col-sm-2 col-form-label">Title:</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="titleInput"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-3 row">
  <label htmlFor="contentInput" className="col-sm-2 col-form-label">Content:</label>
  <div className="col-sm-10">
    <ReactQuill
      theme="snow"
      value={content}
      onChange={setContent}
      modules={BlogCreator.modules}
      formats={BlogCreator.formats}
      placeholder="Enter blog content here..."
    />
  </div>
</div>
      {/* Row for buttons */}
      <div className="row mt-3">
        {/* Column for Submit button */}
        <div className="col d-flex justify-content-start">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>

        {/* Column for Logout button */}
        <div className="col d-flex justify-content-end">
        <button onClick={handleLogout} className="btn btn-primary btn-danger">Logout</button>
        </div>  
        </div>
      </form>
      {/* Optional: Image Preview */}
{imageUrl && (
  <div className="image-preview mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
    <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
)}

        {/* Avatar image preview */}
        {avatarUrl && (
          <div className="image-preview mb-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={avatarUrl} alt="Avatar Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
    </div>
  );
};

export default BlogCreator;
