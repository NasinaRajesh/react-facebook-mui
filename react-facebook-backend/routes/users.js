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
    const {username, profilePicture} = req.body ;
    const user = await FacebookModel.findById(userId); // Find the user who wants to add a friend
    const friend = await FacebookModel.findById(friendId); // Find the friend
    
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

     // Check if the friend is already in the user's `friends` array
    //  const isFriendAlreadyAdded = friend.friends.some((friendDetails) => friendDetails.username === username);

    //  if (isFriendAlreadyAdded) {
    //    return res.status(400).json({ message: 'Friend request already sent' });
    //  }

    // Add the friend to the user's `friends` array
    const friendDetails = {
      userId,
      username,
      profilePicture
    }
    //console.log(friendDetails)
    friend.friendRequests.push(friendDetails);
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

    const user = await FacebookModel.findById(userId); // Populate the 'friends' field
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendRequests = user.friendRequests; // Extract the list of friends
    //console.log(friendRequests, "get-friends")
    return res.status(200).json({ friendRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting friends' });
  }
});

// DELETE route to reject a friend request
router.delete('/reject-friend-requests', async (req, res) => {
  //const requestId = parseInt(req.params.id);
  try{
  const {userId, requestId} = req.query 
  //console.log(userId, requestId)
  const user =  await FacebookModel.findById(userId) ;
  // Find the index of the request with the provided ID
  const index = user.friendRequests.findIndex((request) => request.userId == requestId);
  console.log(index)
  if (index === -1) {
    return res.status(404).json({ message: 'Friend request not found' });
  }

  // Remove the request from the array
  user.friendRequests.splice(index, 1);
  await user.save()
  //console.log(user.friendRequests, "friendRequests array")
  return res.json({ message: 'Friend request rejected' });
}catch(error){
  console.error(error);
    return res.status(500).json({ message: 'Error Reject friend' });
}
});

router.post('/accept-friend-request', async (req,res)=>{
  const {userId, requestId} = req.query ;
  console.log(userId, requestId)
try{
  const user = await FacebookModel.findById(userId) ;

  if(!user){
    return res.status(404).json({message : 'User Not Found'})
  }
  user.friends.push(req.body)
  
  const index = user.friendRequests.findIndex((request)=> request.userId == requestId) ;
  user.friendRequests.splice(index,1) ;
  await user.save()
  console.log(user.friends, "accept friend")
  console.log(user.friendRequests, "friend requests")
  return res.status(200).json({message: 'Friend request accepted'})
  
} catch(error){
  console.log(error) ;
  return res.status(500).json({message: 'Error while accepting friend request'})
}
  
})

module.exports = router;
