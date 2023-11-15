const mongoose = require("mongoose") ;
const FacebookModel = require('../model/facebook') ;

const FriendRequests = async (req, res) => {
    console.log(req.body)
    try {
      const {email} = req.body; // Get the user email from the request body
        console.log(email)
      const user = await FacebookModel.findOne({email}); // finding the user with user email
      // console.log(user)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const friendRequests = user.friendRequests; // Extract the list of friends and stored in friendRequests variable
      //console.log(friendRequests, "get-friends")
      return res.status(200).json({ friendRequests });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error getting friends' });
    }
  }

const RejectRequest = async (req, res) => {
    
    try{
    const {emailId, requestId} = req.query 
    console.log(emailId, requestId)
    const user =  await FacebookModel.findOne({email : emailId}) ;

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    // Find the index of the request with the provided ID
    
    const index = user.friendRequests.findIndex((request) => request.email.toLowerCase().trim() === requestId.toLowerCase().trim());
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
  };

  const AcceptRequest = async (req,res)=>{
    const {emailId, requestId} = req.query ;
    console.log(emailId, requestId)
  try{
    const user = await FacebookModel.findOne({email : emailId}) ;
  
    if(!user){
      return res.status(404).json({message : 'User Not Found'})
    }
    user.friends.push(req.body)
    
    const index = user.friendRequests.findIndex((request)=> request.email.toLowerCase().trim() == requestId.toLowerCase().trim()) ;
    user.friendRequests.splice(index,1) ;
    await user.save()
    console.log(user.friends, "accept friend")
    console.log(user.friendRequests, "friend requests")
    return res.status(200).json({message: 'Friend request accepted'})
    
  } catch(error){
    console.log(error) ;
    return res.status(500).json({message: 'Error while accepting friend request'})
  }
    
  }

  const createPost = async (req, res) => {
    const { postcontent, postimageUrl } = req.body;
    const {emailId} = req.query ;
    console.log(postimageUrl, "post image url")
    // Check if the content is exist
    try {
      if (!postcontent ) {
        return res.status(400).json({ error: 'Post content is required.' });
      }

      // Find the user based on the provided userId
      const user = await FacebookModel.findOne({email : emailId});

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if(user.postcontent === postcontent && user.postimageUrl === postimageUrl ){
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

  const getPosts =  async (req, res) => {
    const {emailId} = req.query;
    try {
      const user = await FacebookModel.findOne({email : emailId}).select('posts profilePicture');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.status(200).json({ data: user, error: null });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ data: null, error: 'Internal server error.' });
    }
  };

  const deletePost = async (req, res) => {
    const { emailId, postId } = req.query;
  
    try {
      // Find the user by email
      const user = await FacebookModel.findOne({email : emailId});
      const postIdAsObjectId = new mongoose.Types.ObjectId(postId); // selected postId 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the index of the post to delete by _id
      const postIndex = user.posts.findIndex((post) => post._id.equals(postIdAsObjectId)); // compare selected postId with user postId
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
  module.exports = {FriendRequests, RejectRequest, AcceptRequest, createPost, getPosts, deletePost}