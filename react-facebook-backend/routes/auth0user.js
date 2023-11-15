var express = require('express');
var router = express.Router();
exports.router = router; 

var FacebookController = require('../controllers/auth0usersControllers') ;

router.post('/friend-request', FacebookController.FriendRequests) ;
router.delete('/reject-request', FacebookController.RejectRequest) ;
router.post('/accept-request', FacebookController.AcceptRequest) ;
router.post('/create-post', FacebookController.createPost) ;
router.get('/get-posts', FacebookController.getPosts) ;
router.delete('/delete-post', FacebookController.deletePost) ;
module.exports = router;