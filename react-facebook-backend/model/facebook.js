const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  
  postId: {
    type: String,
    unique: true, // Ensures that each post has a unique identifier
    required: false, // You can make it required if necessary
  },
  
  postcontent: {
    type: String,
    required: false,
    
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: false,

  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,

    },
  ],
  comments: [
    {
      content: {
        type: String,
        required: false,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,

      },
      timestamp: {
        type: Date,
        default: Date.now,
        required: false,

      },
    },
  ],
  postimageUrl: { // New field to store the image URL
    type: String,
    required: false,
  },
});
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  birthdate: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false,
  },
  profilePicture: {
    type: String,
    default: 'https://example.com/default-profile-picture.jpg',
  },
  coverPhoto: {
    type: String,
    default: 'https://example.com/default-cover-photo.jpg',
  },
  friends: [
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  ],
  friendRequests : [] ,
  addFriend :{
    type : Boolean ,
    default : false
  }, 
  posts: [
    postSchema
  ],
});


// Create an index on the email field
userSchema.index({ email: 1 });


const User = mongoose.model('User', userSchema);

module.exports = User;
