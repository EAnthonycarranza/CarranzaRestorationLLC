const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: String,
    userProfilePic: String,
    comment: String,
    googleId: String,  // For comments made by Google-authenticated users
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the User model
    date: { type: Date, default: Date.now },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
