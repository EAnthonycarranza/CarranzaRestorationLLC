const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now },
  image: String, // URL of the main image
  avatar: String, // URL of the avatar image
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
