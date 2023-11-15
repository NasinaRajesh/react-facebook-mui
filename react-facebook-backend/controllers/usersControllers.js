const FacebookModel = require('../model/facebook') ;
var express = require('express');
var router = express.Router();
exports.router = router;
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const moment = require("moment") ;
var mongoose = require("mongoose") ;

const updateprofile = async  (req, res) => {
    const userId = req.params.id;
    const { imageData } = req.body;
    try {
      // Find the user by their ID
      const user = await FacebookModel.findById(userId); 
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Update the user's profilePicture field
      user.profilePicture = imageData
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Profile picture updated successfully.' });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  const createAccount = async (req, res) => {
    // Check for validation errors from express-validator library

    console.log(req.body, "registration")
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

      //If errors is empty, it means there are no validation errors.

      //If errors is not empty, it means there are validation errors.

      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, birthdate } = req.body;

    try {
      // Check if user already exists
      let user = await FacebookModel.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create a new user
      user = await FacebookModel.create({
        firstName,
        lastName,
        email,
        password,
        birthdate
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create and return a JWT token
      const payload = {
        user: {
          id: user._id,
          msg: "Account registered successfully!!"
        },
      };

      jwt.sign(
        payload,
        "secret", 
        { expiresIn: 3600 }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
const accountLogin = async (req, res) => {
    // Check for validation errors
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await FacebookModel.findOne({ email });
      // console.log(user, "97 line login route")
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check if the entered password matches the stored hashed password

      // console.log(password, "login password");
      // console.log(user.password, " db password");

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create and return a JWT token
      const payload = {
        user: {
          id: user._id,
          username: user.firstName + (user.lastName ? " " + user.lastName : ""),
          profilePicture : user.profilePicture
        },
      };

      jwt.sign(
        payload,
        "secret", 
        { expiresIn: 3600 }, 
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

const createPost = async (req, res) => {
    const { postcontent, postimageUrl } = req.body;
    const userId = req.params.id; // Get userId from URL parameter
    //console.log(req.body, userId, "create-post");
    // Check if the content and imageUrl exist
    try {
      if (!postcontent || !postimageUrl) {
        return res.status(400).json({ error: 'Both content and imageUrl are required.' });
      }

      // Find the user based on the provided userId
      const user = await FacebookModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if(user.postcontent === postcontent ){
        return res.status(404).json({error: "Post already exists"}) ;
      }
      console.log(user);
      // Create a new post object
      const newPost = {
        postcontent,
        postimageUrl,
      };

      // Add the new post to the user's posts array
      user.posts.push(newPost);

      // Save the updated user document
      await user.save();

      res.status(201).json({ message: 'Post created successfully.' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
// To get all posts 
  const getPosts =  async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await FacebookModel.findById(userId).select('posts profilePicture');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.status(200).json({ data: user, error: null });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ data: null, error: 'Internal server error.' });
    }
  };
  
// To get single post with postId 

const getPost = async (req, res) => {
  const { userId, postId } = req.query;
  //console.log(userId, postId)
  try {
    // Find the user by _id
    const user = await FacebookModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the post within the user's posts array by _id
    const post = user.posts.find((post) => post._id.equals(postId));

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the post as the response
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
const getProfilePicture = async (req, res) => {
    const userId = req.params.id;
    try {
      const userProfile = await FacebookModel.findById(userId).select('profilePicture');
  
      if (!userProfile) {
        return res.status(404).json({ error: 'UserProfile not found.' });
      }
  
      res.status(200).json({ data: userProfile, error: null });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ data: null, error: 'Internal server error.' });
    }
  }

// const updatePost = async (req, res) => {
//     try {
//       const postId = req.params.postId;
  
//       // Check if the post exists
//       const post = await FacebookModel.findById(postId);
  
//       if (!post) {
//         return res.status(404).json({ message: 'Post not found' });
//       }
  
//       // Check if the user making the request is the owner of the post
//       if (post.user.toString() !== req.user.id) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
  
//       // Update the post content
//       post.postcontent = req.body.postcontent; // You should validate and sanitize user input here
  
//       // Save the updated post
//       await post.save();
  
//       res.json({ message: 'Post updated successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   } 

  const deletePost = async (req, res) => {
    const { userId, postId } = req.query;
  
    try {
      // Find the user by _id
      const user = await FacebookModel.findById(userId);
      const postIdAsObjectId = new mongoose.Types.ObjectId(postId);
  
      // const postIndex = user.posts.findIndex((post) => post._id.equals(postIdAsObjectId));
      // console.log('Post Index:', postIndex);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the index of the post to delete by _id
      const postIndex = user.posts.findIndex((post) => post._id.equals(postIdAsObjectId));
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Remove the post from the posts array
      user.posts.splice(postIndex, 1);
  
      // Save the updated user document     
      await user.save();
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  const updatePostContent = async (req, res) => {
    const { postDetails } = req.body;
    const { userId, postId } = req.query;
    console.log(userId, postId)
    console.log(postDetails)
    try {
      if (!postDetails.postcontent ) {
        return res.status(400).json({ error: 'post content required.' });
      }
      // Find the user based on the provided userId
      const user = await FacebookModel.findById(userId);
      console.log(user.posts._id, postId)
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Find the post to update in the user's posts array
      const postToUpdate = user.posts.find((post) => post._id.toString() === postId);
  
      if (!postToUpdate) {
        return res.status(404).json({ error: 'Post not found.' });
      }
  
      // Update the post's postcontent
      postToUpdate.postcontent = postDetails.postcontent;
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ message: 'Post content updated successfully.' });
    } catch (error) {
      console.error('Error updating post content:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  

  // const getAllUsersDetails = async (req, res) => {
  //   try {
  //     const users = await FacebookModel.find({}, 'firstName lastName email profilePicture');
  //     // Send the retrieved user data as a response
  //     res.status(200).json(users);
  //   } catch (error) {
  //     console.error(error);
  //     // Handle the error
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };


module.exports = {updateprofile , createAccount, accountLogin, createPost, getPosts, getPost, getProfilePicture, deletePost , updatePostContent} 