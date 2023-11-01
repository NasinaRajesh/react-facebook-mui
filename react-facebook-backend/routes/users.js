var express = require('express');
var router = express.Router();
exports.router = router;
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const moment = require("moment") ;
var mongoose = require("mongoose") ;
var FacebookModel = require('../model/facebook') ;
var FacebookController = require('../controllers/usersControllers')
/* GET FacebookModels listing. */
// To get single post with postId
router.get('/get-post/', FacebookController.getPost);

// Define a route to handle the PATCH request for updating the profile picture
router.patch('/update-profile/:id', FacebookController.updateprofile);

router.post(
  "/register",
  [
    check("firstName", "Username is required").not().isEmpty(),
    check("lastName", "Surname is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    // check("birthdate", "Please enter a valid date of birth").isDate()

  ],
  FacebookController.createAccount
);
// login
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  FacebookController.accountLogin
);
// create a post with content and imageUrl fields
router.post('/create-post/:id',FacebookController.createPost) ; 
  
// To get all Posts

// router.get('/get-posts/:id',async(req,res)=>{
//   const userId = req.params.id ;
//   try{
//     const user = await FacebookModel.findById(userId).select(posts);

//       if (!user) {
//         return res.status(404).json({ error: 'User not found.' });
//       }

//       res.status(200).json(user.posts,{ message: 'Fetching user Posts successfully.' });

//   }
//   catch(error){
//     console.error('Error fetching user posts:', error);
//       res.status(500).json({ error: 'Internal server error.' });
//     }

// })

// get user posts 

router.get('/get-posts/:id', FacebookController.getPosts);



// to get profilePicture 

router.get('/get-profile/:id', FacebookController.getProfilePicture);

// PATCH (update) a post by ID
router.patch('/update-post/', FacebookController.updatePostContent);

router.delete('/delete-post/', FacebookController.deletePost);


// Define the route for getting all user details
router.get('/all-users', async (req, res) => {
  try {
    const users = await FacebookModel.find({}, 'firstName lastName email profilePicture');
    // Send the retrieved user data as a response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    // Handle the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define the route for deleting a user account by ID
router.delete('/delete-user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by their ID and delete it
    const deletedUser = await FacebookModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Optionally, you can perform additional cleanup tasks here
    // (e.g., delete user-related data, revoke tokens, etc.)

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    // Handle the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-friend', async (req, res) => {
  try {
    const { userId, friendId } = req.query; // Assuming you send the user and friend IDs in the request body
    const {firstName, lastName, profilePicture} = req.body ;
    const user = await FacebookModel.findById(userId); // Find the user who wants to add a friend
    const friend = await FacebookModel.findById(friendId); // Find the friend
   
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Add the friend to the user's `friends` array
    const friendDetails = {
      firstName,
      lastName,
      profilePicture
    }
    friend.friends.push(friendDetails);
    await friend.save();

    return res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding friend' });
  }
});

router.get('/get-friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters

    const user = await FacebookModel.findById(userId).populate('friends'); // Populate the 'friends' field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friends = user.friends; // Extract the list of friends

    return res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting friends' });
  }
});
module.exports = router;
