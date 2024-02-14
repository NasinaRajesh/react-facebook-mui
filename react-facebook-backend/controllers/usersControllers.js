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

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      } 

      // Create and return a JWT token
      const payload = {
        user: {
          id: user._id,
          email : user.email,
          username: user.firstName + (user.lastName ? " " + user.lastName : ""),
          profilePicture : user.profilePicture,
          
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
    const userId = req.params.id;
     console.log(postimageUrl)
    try {
      if (!postcontent) {
        return res.status(400).json({ error: 'Post content required.' });
      }
  
      const user = await FacebookModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if post with the same content already exists
      if (user.posts.some(post => post.postcontent === postcontent)) {
        return res.status(400).json({ error: 'Post with the same content already exists.' });
      }
  
      // Create a new post object
      const newPost = {
        postcontent,
        postimageUrl: postimageUrl || null, // Set postimageUrl to null if it's empty
      };
  
      // Add the new post to the user's posts array 
      console.log(newPost)
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
  

  const getAllUsers = async (req, res) => {
    try {
      const users = await FacebookModel.find({}, 'firstName lastName email profilePicture addFriend');
      // Send the retrieved user data as a response
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      // Handle the error
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // const friendSuggestions = async (req, res) => { 
  //   const userId = req.params.userId ;
  //   console.log(userId)
  //   try {
  //     const users = await FacebookModel.find({}, 'firstName lastName email profilePicture addFriend');
  //     const friendSuggestions = users.map(user => ({
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       profilePicture: user.profilePicture,
  //       addFriend: user.addFriend
  //     }));
  //     //console.log(friendSuggestions, "friend suggestions array")

  //     const user = await FacebookModel.findById(userId) ;
  //     if(!user){
  //       return res.status(404).json({error: "User not found"})
  //     }
  //     //user.friendSuggestions.push(...friendSuggestions)
  //      // Filter out duplicate friend suggestions
  //      const uniqueFriendSuggestions = friendSuggestions.filter(suggestion => suggestion.email === user.friendSuggestions.email);
  //      // Push unique friend suggestions into user's friendSuggestions array
  //      user.friendSuggestions.push(...uniqueFriendSuggestions);
  //     await user.save();
  //     res.status(200).json(user);
  //   } catch (error) {
  //     console.error(error.errors);
  //     // Handle the error
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // };
  
  const friendSuggestions = async (req, res) => { 
    const userId = req.params.userId;
    console.log(userId);
    try {
        // Fetch all users except the specified user
        const users = await FacebookModel.find({ _id: { $ne: userId } }, 'firstName lastName email profilePicture addFriend');
        const friendSuggestions = users.map(user => ({
            userId : user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture,
            addFriend: user.addFriend
        }));
        
        // Find the specified user
        const user = await FacebookModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Clear existing friendSuggestions and push new suggestions
        user.friendSuggestions = friendSuggestions;
        await user.save();
        
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

  
  const deleteAccount = async (req, res) => {
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
    }}
 const addFriend =  async (req, res) => {
  try {
    const { userId, friendId } = req.query; // Assuming you send the user and friend IDs in the request body
    const {username, profilePicture} = req.body ;
    const user = await FacebookModel.findById(userId); // Find the user who wants to add a friend
    const friend = await FacebookModel.findById(friendId); // Find the friend
    const email = user.email ;
    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

     // Check if the friendRequest is already in the user's friendRequest array
     //const isFriendRequestAlreadyAdded = friend.friendRequests.some((friendDetails) => friendDetails.username.toLowerCase().trim() === username.toLowerCase().trim());
     const isFriendRequestAlreadyAdded = friend.friendRequests.some((friendDetails) => friendDetails.userId === userId);

     if (isFriendRequestAlreadyAdded) {
       return res.status(400).json({ message: 'Friend request already sent' });
     }

    // Add the friend to the user's `friends` array
    const friendDetails = {
      userId,
      username,
      profilePicture,
      email
    }
    //console.log(friendDetails)
    friend.friendRequests.push(friendDetails);
    await friend.save();
    // Toggle the addFriend boolean
    
    console.log(user.friendSuggestions[0].addFriend, "add friend request fun default")
     // Toggle the addFriend boolean for the specific friend suggestion
     const index = user.friendSuggestions.findIndex(suggestion => suggestion.userId === friendId);
     if (index !== -1) {
       user.friendSuggestions[index].addFriend = !user.friendSuggestions[index].addFriend;
       await user.save();
     }

    console.log(user.friendSuggestions[0].addFriend, "add friend request fun button clicked")
    
    await user.save();
    const updatedUser = await FacebookModel.findById(userId) ;
    // Find the requested user index in friendSuggestions array 
    const requestedUserIndex = updatedUser.friendSuggestions.findIndex(suggestion=> suggestion.userId === friendId)
    return res.status(200).json({ message: 'Add Friend Request sent', user: updatedUser, requestedUserIndex });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding friend' });
  }
}

const friendRequests = async (req, res) => {
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
}

const rejectFriendRequest = async (req, res) => {
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
}



// const acceptFriendRequest = async (req, res) => {
//   const { userId, requestId } = req.query;
//   console.log(userId, requestId);
//   try {
//     // Validate if userId and requestId are valid ObjectId strings
//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(requestId)) {
//       return res.status(400).json({ message: 'Invalid user ID or request ID' });
//     }

//     const user = await FacebookModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User Not Found' });
//     }

//     // Convert requestId to ObjectId
//     const requestedObjectId = new mongoose.Types.ObjectId(requestId);

//     // Check if the user is already in the friends array
//     const isAlreadyFriend = user.friends.some(friend => friend.userId.equals(requestedObjectId));
//     if (isAlreadyFriend) {
//       return res.status(400).json({ message: 'User is already a friend' });
//     }

//     // Push the accepted friend details into the friends array 
//     if(!req.body){
//       return res.status(400).json({message: "Requested user details are not found"})
//     }
//     user.friends.push(req.body);

//     // Remove the friend request
//     const index = user.friendRequests.findIndex(request => request.userId == requestId);
//     user.friendRequests.splice(index, 1);

//     // Remove the accepted user's details from the friendSuggestions array
//     const requestUser = await FacebookModel.findById(requestId);
//     const friendSuggestionIndex = user.friendSuggestions.findIndex(suggestion => suggestion.email === requestUser.email);
//     if (friendSuggestionIndex !== -1) {
//       user.friendSuggestions.splice(friendSuggestionIndex, 1);
//     }

//     // Save the user document
//     await user.save();

//     console.log(user.friends, "accept friend");
//     console.log(user.friendRequests, "friend requests");
//     console.log(user.friendSuggestions, "friend suggestions");
//     return res.status(200).json({ message: 'Friend request accepted' });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Error while accepting friend request' });
//   }
// };

const acceptFriendRequest = async (req, res) => {
  const { userId, requestId } = req.query;
  console.log(userId, requestId);
  console.log(req.body, "body")
  try {
    // Validate if userId and requestId are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid user ID or request ID' });
    }

    const user = await FacebookModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    // Convert requestId to ObjectId
    const requestedObjectId = new mongoose.Types.ObjectId(requestId);

    // Check if the user is already in the friends array
    const isAlreadyFriend = user.friends.some(friend => friend.userId === requestId);
    if (isAlreadyFriend) {
      return res.status(400).json({ message: 'User is already a friend' });
    }

    // Push the accepted friend details into the friends array 
    if(!req.body){
      return res.status(400).json({message: "Requested user details are not found"})
    }
    user.friends.push({
      userId : req.body.requestUser.userId,
      username : req.body.requestUser.username,
      profilePicture : req.body.requestUser.profilePicture,
      email : req.body.requestUser.email
    });

    // Remove the friend request
    const index = user.friendRequests.findIndex(request => request.userId == requestId);
    user.friendRequests.splice(index, 1);

    // Remove the accepted user's details from the friendSuggestions array
    const requestUser = await FacebookModel.findById(requestId);
    if (!requestUser) {
      // Handle the case where the requested user doesn't exist
      console.log('Requested user not found');
    } else {
      // Remove the accepted user's details from the friendSuggestions array
          const friendSuggestionIndex = user.friendSuggestions.findIndex(suggestion => suggestion.userId == requestId);
          console.log(friendSuggestionIndex, "friend suggestions index")
          if (friendSuggestionIndex !== -1) {
            user.friendSuggestions.splice(friendSuggestionIndex, 1);
             console.log(user.friendSuggestions ,"user.friendSuggestions 629") 
            //return user.friendSuggestions
       
          }
        
           // Push the loggedInUser details into the requestUser's friends array
      requestUser.friends.push({
        userId: req.body.loggedInUser.userId,
        username: req.body.loggedInUser.username,
        profilePicture: req.body.loggedInUser.profilePicture,
        email: req.body.loggedInUser.email
      });

      await requestUser.save();

    }

    // Save the user document
    await user.save();
    // console.log(user.friends, "accept friend");
    // console.log(user.friendRequests, "friend requests");
    // console.log(user.friendSuggestions, "friend suggestions");
    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error while accepting friend request' });
  }
};


const addFriendButtonTextChange = async (req,res)=>{
  const userId = req.params.userId ;
  console.log(userId)
  try{
    const user = await FacebookModel.findById(userId) ; 

    if(!user){
      return res.status(404).json({message : 'User not found'})
    } 

    user.addFriend = !user.addFriend ;
    await user.save() ;
    console.log(user.addFriend) ;
    const addFriend = user.addFriend ;
    return res.status(200).json({addFriend})

  } catch(error) {
    console.log(error) ;
    return res.status(500).json({message : 'Error while updating the addFriend button text'})
  }
}
const getFriends = async (req, res) => {
  const { emailId } = req.query;

  try {
    const user = await FacebookModel.findOne({ email: emailId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFriends = user.friends;
    // console.log(userFriends.requestUser)
    return res.status(200).json({ message: 'User friends retrieved successfully', userFriends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error getting user friends' });
  }
};

const getSingleUser = async (req,res) => {
  const userId = req.params.userId ;
  try {
    const user = await FacebookModel.findById(userId) ;
    if(!user){
      return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json(user)

  } catch(error){
    console.log(error) ;
    return res.status(500).json({error : 'Internal server error'})
  }
}

const sendMessage = async (req, res) => {
  const {senderId, receiverId} = req.query 
  const {messageContent} = req.body 
  console.log(senderId, receiverId, messageContent)
  try{
    const sender = await FacebookModel.findById(senderId) ;
    const receiver = await FacebookModel.findById(receiverId) ;
    console.log(sender.firstName, receiver.firstName)
    if(!sender || !receiver){
      return res.status(404).json({message : 'Sender or receiver are not found'})
    }
    if(!messageContent){
      return res.status(404).json({message : "Message content is empty"})
    }
    const message = {
      sender : senderId,
      receiver : receiverId,
      content : messageContent,
      timestamp : new Date()
    }
    sender.sentMessages.push(message) ;
    await sender.save();
    receiver.receivedMessages.push(message) ;
    await receiver.save();
    return res.status(200).json({message : "Sent message successfully", content: messageContent})
  } catch(error){
    console.log(error) ;
    return res.status(500).json({message:'Internal server error'})
  }
}
const getSenderMessages = async (req, res) => {
  const userId = req.params.userId;
  const friendId = req.query.friendId;

  try {
    // Validate if userId and friendId are valid ObjectId strings
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid user ID or friend ID' });
    }

    const sender = await FacebookModel.findById(userId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Filter sent messages for the specific friend ID
    const senderMessages = sender.sentMessages.filter(message => message.receiver == friendId);
    return res.status(200).json({ senderMessages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: 'Error while retrieving sender messages' });
  }
};

const getReceivedMessages = async (req,res)=>{
  const userId = req.params.userId ;
  //console.log(userId)
  try{
    const receiver = await FacebookModel.findById(userId);
    if(!receiver){
      return res.status(404).json({message: "Receiver not found"})
    }
    const receivedMessages = receiver.receivedMessages ;
    return res.status(200).json({receivedMessages})
  }
  catch(error){
    console.log(error) ;
    return res.status(500).json({Error : "Error while retrieving received messages"})
  }
}


module.exports = {  getReceivedMessages,
                    getSenderMessages,
                    sendMessage,
                    getSingleUser,
                    updateprofile , 
                    createAccount,
                     accountLogin, 
                     createPost, 
                     getPosts,
                      getPost, 
                      getProfilePicture, 
                      deletePost ,
                       updatePostContent,
                        getAllUsers, 
                        deleteAccount, 
                        addFriend, 
                        friendRequests, 
                        rejectFriendRequest,
                         acceptFriendRequest, 
                         addFriendButtonTextChange, 
                         getFriends, 
                         friendSuggestions
                  } 