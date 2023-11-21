var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
exports.router = router; 

var FacebookController = require('../controllers/auth0usersControllers') ;

router.post('/friend-request', FacebookController.FriendRequests) ;
router.delete('/reject-request', FacebookController.RejectRequest) ;
router.post('/accept-request', FacebookController.AcceptRequest) ;
router.post('/create-post', FacebookController.createPost) ;
router.get('/get-posts', FacebookController.getPosts) ;
router.delete('/delete-post', FacebookController.deletePost) ;
router.get('/get-post', FacebookController.getPost) ;
router.patch('/update-post', FacebookController.updatePostContent) ;
router.post(
    "/create-account",
    [
      check("firstName", "First name is required").not().isEmpty(),
      check("lastName", "Last name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail()
  
    ],
    FacebookController.createAccount
  );
module.exports = router;