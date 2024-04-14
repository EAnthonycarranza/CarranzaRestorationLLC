import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminEditBlog = () => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // New state for avatar URL
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`/api/blogposts/${id}`);
        setAuthor(response.data.author);
        setContent(response.data.content);
        setImageUrl(response.data.image);
        setAvatarUrl(response.data.avatar); // Set avatar URL from response
        setIsLoading(false);
        const commentsResponse = await axios.get(`/api/blogposts/${id}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    fetchBlogPost();
  }, [id]);

  const modules = {
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

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized to perform this action');
      return;
    }
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };  

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Check if token is retrieved properly
    if (!token) {
      alert('You are not authorized to perform this action');
      return;
    }
    try {
      await axios.put(
        `/api/blogposts/${id}`,
        {
          author,
          content,
          image: imageUrl,
          avatar: avatarUrl, // Include avatar URL in the update
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include admin's authentication token in headers
          },
        }
      );
      navigate('/admindashboard');
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Error updating blog post. Please try again later.');
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-blog-post">
      <h2 className="mb-4">Edit Blog Post</h2>
      <form onSubmit={handleUpdate} className="mb-4">
        <div className="form-group mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="avatarUrl" className="form-label">Avatar URL</label>
          <input
            type="text"
            className="form-control"
            id="avatarUrl"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Post</button>
      </form>
      <h3 className="mb-3">Comments</h3>
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment-item mb-3 p-3 border rounded">
            <p className="mb-2"><strong>{comment.username}:</strong> {comment.comment}</p>
            <button onClick={() => deleteComment(comment._id)} className="btn btn-danger">
              Delete Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default AdminEditBlog;
