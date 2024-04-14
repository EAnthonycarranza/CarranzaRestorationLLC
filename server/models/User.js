const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    username: { type: String, unique: true, sparse: true }, // Marked as sparse to allow non-Google users not to have this field
    googleId: { type: String, unique: true, sparse: true },
    googleName: { type: String },
    userId: { type: String, default: () => uuidv4() },
    googleProfilePic: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// If using the mongoose-findorcreate plugin
userSchema.plugin(findOrCreate);

userSchema.statics.findOrCreate = async function findOrCreate(condition, doc) {
    const user = await this.findOne(condition);
  
    if (!user) {
      // Add 'googleName' and 'googleProfilePic' to the document if available
      const newUser = new this(doc);
      if (doc.googleName) newUser.googleName = doc.googleName;
      if (doc.googleProfilePic) newUser.googleProfilePic = doc.googleProfilePic;
      await newUser.save();
      return newUser;
    }
  
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
