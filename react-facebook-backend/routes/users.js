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
router.get('/all-users', FacebookController.getAllUsers);

// Define the route for deleting a user account by ID
router.delete('/delete-user/:userId',FacebookController.deleteAccount);

router.post('/add-friend', FacebookController.addFriend);

router.get('/get-friends/:userId', FacebookController.friendRequests );

// DELETE route to reject a friend request
router.delete('/reject-friend-requests', FacebookController.rejectFriendRequest );

router.post('/accept-friend-request', FacebookController.acceptFriendRequest ) ;

router.patch('/add-friend-button/:userId', FacebookController.addFriendButtonTextChange ) ;

router.get('/get-friends', FacebookController.getFriends) ; 
router.get('/friend-suggestions/:userId', FacebookController.friendSuggestions)

router.get('/get-user/:userId', FacebookController.getSingleUser) ;
// send message route 
router.post('/send-message', FacebookController.sendMessage) ;
router.get('/get-sender-messages/:userId', FacebookController.getSenderMessages);
router.get('/get-received-messages/userId' , FacebookController.getReceivedMessages) ;
module.exports = router;
