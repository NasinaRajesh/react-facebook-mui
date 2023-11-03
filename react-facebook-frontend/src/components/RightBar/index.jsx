import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { urls } from "../../urls";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import "./index.css";
import AddFriendButton from "../AddFriendButton/AddFriendButton";
import CloseIcon from '@mui/icons-material/Close'; 
import { useSelector } from "react-redux";
function RightBar({ userState }) {

  const selector = useSelector((state)=> state.LoggedUser.user) ; 

  const userId = selector.user.id;
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [allUsers, setAllUsers] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [requestSent, setRequestSent] = useState(false);

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
    console.log("useEffect called in RightBar component without selector")
    if (selector) {
      console.log("useEffect called in RightBar component with selector")
      FetchUserPostDetails();
      FetchAllUsers();
    }
  }, [userId, selector]);

 

  const handleImageClick = (postId) => {
    setSelectedImage(postId);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  // let user = {
  //   avatar:
  //     "https://img.freepik.com/premium-vector/illustration-dussehra-festival-celebration_23-2150784756.jpg?size=626&ext=jpg",
  //   fullName: "Rajesh Nasina",
  // };

  const handleAddFriendClick = (friend) => {
   // setAllUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
    console.log(selector.user.profilePicture);
    axios.post(`${urls.addFriend}?userId=${userId}&friendId=${friend._id}`,{
      username : selector.user.username ,
      profilePicture : selector.user.profilePicture
    })
    .then((res)=> {
      console.log(res)
      setRequestSent(true)
    })
    .catch((error)=> console.log(error.response.data.message))
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
                      <Box mt={1} >
                        <AddFriendButton
                          onClick={() => handleAddFriendClick(user)}
                          requestSent={requestSent}
                        />
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
              .map((post, index) => (
                <ImageListItem key={index} style={{ cursor: "pointer" }}>
                  <img
                    src={post.postimageUrl}
                    alt=""
                    onClick={() => handleImageClick(post.postimageUrl)}
                  />
                </ImageListItem>
              ))}
          </ImageList>
        )}

        {/* Modal to display the selected image */}
        {modalOpen && (
          <div>
            <div style={{ position: "relative",  }}>
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
                  backgroundColor:'#ffff',
                  borderRadius : '20px',
                  color : 'grey',
                  fontWeight: 'bold',
                  padding: '5px',
                  fontSize : '30px',
                  margin: '2px'
                  
                }}
              />
                
            </div>
          </div>
        )}

        {/* <Typography component="h6" mt={2} mb={2}>
          Latest Conversations
        </Typography>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Wish I could come, but I'm out of town this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Sandra Adams
                  </Typography>
                  {" — Do you have Paris recommendations? Have you ever…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List> */}
      </Box>
    </Box>
  );
}

export default RightBar;
