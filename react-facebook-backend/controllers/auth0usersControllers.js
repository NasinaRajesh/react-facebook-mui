const FacebookModel = require('../model/facebook') ;

const FriendRequests = async (req, res) => {
    console.log(req.body)
    try {
      const {email} = req.body; // Get the user ID from the request parameters
        console.log(email)
      const user = await FacebookModel.findOne({email}); // Populate the 'friends' field
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

  module.exports = {FriendRequests, RejectRequest, AcceptRequest}