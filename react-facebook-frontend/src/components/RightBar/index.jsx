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
function RightBar({ postDeleted }) {
  const selector = useSelector((state) => state.LoggedUser.user);
  const profilePicture = useSelector(
    (state) => state.LoggedUser.user.profilePicture
  );
  const userId = selector.user.id;
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [allUsers, setAllUsers] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [requestSent, setRequestSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const FetchUserPostDetails = () => {
    axios
      .get(`${urls.getposts}/${userId}`)
      .then((res) => {
        console.log(res);
        setLoading(false);
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

  useEffect(() => {
    if (selector) {
      FetchUserPostDetails();
      FetchAllUsers();
    }
  }, [userId, selector, requestSent, postDeleted]);

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
    // setAllUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    //console.log(selector.user.profilePicture);
    //toggleAddFriendButtonText(friend._id);
    axios
      .post(`${urls.addFriend}?userId=${userId}&friendId=${friend._id}`, {
        username: selector.user.username,
        profilePicture: profilePicture,
      })
      .then((res) => {
        console.log(res);
        setSnackbarSeverity("success");
        setSnackbarMessage(res.data.message);
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.message);
        setSnackbarOpen(true);
      });
  };

  const toggleAddFriendButtonText = (userId) => {
    console.log("toggleAddFriendButtonText called", userId);
    //const userId = selector.user.id;
    axios
      .patch(`${urls.toggleAddFriendButtonText}/${userId}`)
      .then((res) => {
        console.log(res.data.addFriend);
        setRequestSent(res.data.addFriend);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box flex={2} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="static" sx={{ width: "300px" }}>
        <Typography component="h6" mt={2} mb={2}>
          Friends suggestions
        </Typography>
        {loading ? (
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Loading...
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column">
            {allUsers
              .slice()
              .reverse()
              .map((user, index) => (
                <Card
                  key={user._id}
                  sx={{ width: 300, height: 130, marginBottom: 1 }}
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
                          sx={{ width: 60, height: 60, marginRight: 1 }}
                        />
                        <Typography variant="h6" component="div">
                          {`${user.firstName} ${
                            user.lastName ? user.lastName : ""
                          }`}
                        </Typography>
                      </Box>
                      <Box mt={1}>
                        {/* <AddFriendButton
                          onClick={() => handleAddFriendClick(user)}
                          requestSent={requestSent}
                        /> */}
                        {user.addFriend ? (
                          <AddFriendButton
                            onClick={() => handleAddFriendClick(user)}
                            requestSent={requestSent}
                            buttonText="Requested"
                          />
                        ) : (
                          <AddFriendButton
                            onClick={() => handleAddFriendClick(user)}
                            requestSent={requestSent}
                            buttonText="Add Friend"
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            <Box>
              {allUsers.length <= 0 && (
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  Friends suggestions are not available at the moment...
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Typography component="h6" mt={2} mb={2}>
          Latest Photos
        </Typography>
        {loading ? (
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Loading...
          </Typography>
        ) : (
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
        )}

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
