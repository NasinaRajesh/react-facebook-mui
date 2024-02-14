import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ImageList,
  ImageListItem,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery
} from "@mui/material";

import axios from "axios";
import { urls } from "../../urls";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import "./index.css";
import AddFriendButton from "../AddFriendButton/AddFriendButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CustomSnackbar from "../CustomSnackbar";
import OnlineFriendsCard from "./OnlineFriendsCard";



function RightBar({ postDeleted, acceptedRequest, mode, setOpenNewmessage, openNewmessage }) {
  const selector = useSelector((state) => state.LoggedUser.user);
  const profilePicture = useSelector(
    (state) => state.LoggedUser.user.profilePicture
  );
  const userId = selector.user.id;
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [allUsers, setAllUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [requestSent, setRequestSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [friends, setFriends] = useState(false) ;
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [toggleAddFriendText, setToggleAddFriendText] = useState(null)
  const fetchFriends = () => {
    const emailId = selector.user.email ;
    // console.log(emailId, "dfdashfbisfbsif")
    axios.get(`${urls.getFriends}?emailId=${emailId}`)
    .then((res)=>{
      setLoading(false)
      setFriends(res.data.userFriends)
      console.log(res.data.userFriends, "res logged user friends")
    })
    .catch((error)=>console.log(error))
  }

  const FetchUserPostDetails = () => {
    axios
      .get(`${urls.getposts}/${userId}`)
      .then((res) => {
        console.log(res, "User Posts response to display latest images");
        //setLoading(false);
        setUserPosts(res.data.data.posts);
        
      })
      .catch((err) => console.log(err));
  };

  const FetchAllUsers = () => {
    axios
      .get(`${urls.getAllusers}`)
      .then((res) => {
        console.log(res.data);
        const filteredUsers = res.data.filter((user) => user._id !== userId);
        setAllUsers(filteredUsers);
      })
      .catch((err) => console.log(err));
  };

  const fetchFriendSuggestions = () => {
    axios
      .get(`${urls.friendSuggestions}${userId}`)
      .then((res) => {
        setSuggestions(res.data.friendSuggestions);
        setLoading(false)
        console.log("friend suggestions response", res.data.friendSuggestions);
       
      })
      .catch((err) => console.log(err));
  };

  function filterFriendSuggestions(){
    const filteredSuggestions = suggestions.filter(suggestion =>
      !friends.some(friend => friend.userId === suggestion.userId)
    );
  
      return filteredSuggestions
  }


  useEffect(() => {
    if (selector) {
      FetchUserPostDetails();
      FetchAllUsers();
      fetchFriends() ;
      fetchFriendSuggestions() ;
      
    }
  }, [userId, selector, requestSent, postDeleted, acceptedRequest]);
 console.log(suggestions, "before updated suggestions")
  useEffect(() => {
    if (suggestions.length > 0 && friends.length >= 0) {
      const filtered = filterFriendSuggestions();
      setFilteredSuggestions(filtered);
    }
  }, [suggestions, friends]);

  const handleImageClick = (postId) => {
    setSelectedImage(postId);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleAddFriendClick = (friend) => {
    
    axios
      .post(`${urls.addFriend}?userId=${userId}&friendId=${friend.userId}`, {
        username: selector.user.username,
        profilePicture: profilePicture,
      })
      .then((res) => {
        const filtered = filterFriendSuggestions();
        setFilteredSuggestions(filtered);
        // Update the addFriend text for the specific friend suggestion
        console.log(res);
        // console.log(res.data.user.friendSuggestions[4].addFriend, "friend suggestions add friend fild");
        console.log(res.data.requestedUserIndex, "requested user index")
        setToggleAddFriendText(res.data.user.friendSuggestions[res.data.requestedUserIndex].addFriend)
        setSnackbarSeverity("success");
        setSnackbarMessage(res.data.message);
        setSnackbarOpen(true); 

        const updatedSuggestions = suggestions.map(suggestion => {
          if (suggestion.userId === friend.userId) {
            console.log(suggestion.userId)
            return { ...suggestion, addFriend: true };
          }
          return suggestion;
        });
        setSuggestions(updatedSuggestions);
        console.log("after updated suggestions  ", suggestions);
        console.log(friend)
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.message);
        setSnackbarOpen(true);
      });
  };

  const toggleAddFriendButtonText = (userId) => {
    console.log("toggleAddFriendButtonText function called", userId);
    //const userId = selector.user.id;
    axios
      .patch(`${urls.toggleAddFriendButtonText}/${userId}`)
      .then((res) => {
        console.log(res.data.addFriend);
        setRequestSent(res.data.addFriend);
      })
      .catch((error) => console.log(error));
  };

  const displayBox = useMediaQuery('(min-width: 820px)');

  return (
    <Box flex={1} p={2} sx={{ display: displayBox ? 'block' : 'none' }}>
      <Box position="static" sx={{ width: "300px" }}>
        <Typography component="h6" mt={2} mb={2}>
          Online friends
        </Typography>
        <OnlineFriendsCard
          friends = {friends} 
          mode = {mode} 
          setOpenNewmessage = {setOpenNewmessage} 
          openNewmessage = {openNewmessage}
        />
        <Typography component="h6" mt={2} mb={2}>
          Friends suggestions
        </Typography>
        {loading ? (
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Loading...
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column">
            {filteredSuggestions
              .slice()
              .reverse()
              .map((user, index) => (
                <Card
                  key={user._id}
                  sx={{ width: 300, height: 110, marginBottom: 1 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={user.profilePicture}
                          alt="User Avatar"
                          sx={{ width: 40, height: 40, marginRight: 1 }}
                        />
                        <Typography variant="h6" component="div" sx={{ fontSize: 15}}>
                          {`${user.firstName} ${
                            user.lastName ? user.lastName : ""
                          }`}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        <Button onClick={()=> handleAddFriendClick(user)} variant="contained" sx={{height:30, textTransform:'none'}}>{user.addFriend?"Request sent" : "Add Friend"}</Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            <Box>
              {filteredSuggestions.length <= 0 && (
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  Friends suggestions are not available at the moment...
                </Typography>
              )}
            </Box>
          </Box>
        )}

        
        {userPosts.length>0 && 
          <>
          <Typography component="h6" mt={2} mb={2}>
            Latest Photos
          </Typography>
          <ImageList cols={4} rowHeight={100} gap={3}>
            {/* Map over userPosts and create ImageListItem components */}
            {userPosts
              .slice()
              .reverse()
              .map(
                (post, index) =>
                  post.postimageUrl && (
                    <Box key={post._id}>
                      <ImageListItem style={{ cursor: "pointer" }}>
                        <img
                          src={post.postimageUrl}
                          alt=""
                          onClick={() => handleImageClick(post.postimageUrl)}
                        />
                      </ImageListItem>
                    </Box>
                  )
              )}
          </ImageList>
          </>
        }

        {/* Modal to display the selected image */}
        {modalOpen && (
          <div>
            <div style={{ position: "relative" }}>
              <img
                src={selectedImage}
                style={{ width: "100%", height: "100%" }}
              />
              <CloseIcon
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "transparent",

                  cursor: "pointer",
                  backgroundColor: "#ffff",
                  borderRadius: "20px",
                  color: "grey",
                  fontWeight: "bold",
                  padding: "5px",
                  fontSize: "30px",
                  margin: "2px",
                }}
              />
            </div>
          </div>
        )}
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        severity={snackbarSeverity}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default RightBar;
