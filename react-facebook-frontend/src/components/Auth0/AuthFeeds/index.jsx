import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { auth0urls } from "../../../urls";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { MoreVert } from "@mui/icons-material";
import MuiConfirmModal from "../../MuiConfirmModal";
import CustomSnackbar from "../../CustomSnackbar";
function AuthFeeds({ postAdded }) {
  const { user, isAuthenticated } = useAuth0();
  if(isAuthenticated){
    console.log(user)
  }
  
  const [loading, setLoading] = useState(true);
  const [userFeeds, setUserFeeds] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuCardId, setOpenMenuCardId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fetchAllUserFeeds = () => {
    console.log("fetchAllUserFeeds are called");
    if (user.email) {
      axios
        .get(`${auth0urls.getposts}?emailId=${user.email}`)
        .then((res) => {
          console.log("Feeds response for auth0user: ", res);
          setUserFeeds(res.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally((final) => setLoading(false));
    }
  };

  useEffect(() => {
    
      fetchAllUserFeeds();
    
    
  }, [user, postAdded]);
  const formatTimestamp = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  };

  // const handleDeleteClick = (postId) => {
  //   const check  = window.confirm("Are you sure you want to delete")
  //   //alert(postId)
  //   // console.log(check)
  //   if (user && postId && check) {
  //     axios
  //       .delete(
  //         `${auth0urls.deletepost}?emailId=${user.email}&postId=${postId}`
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         fetchAllUserFeeds() ;

  //       })
  //       .catch((err) => console.log(err))

  //   }
  // };

  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (user && postIdToDelete) {
      axios
        .delete(
          `${auth0urls.deletepost}?emailId=${user.email}&postId=${postIdToDelete}`
        )
        .then((res) => {
          console.log(res);
          fetchAllUserFeeds();
          setSnackbarSeverity("success")
          setSnackbarMessage(res.data.message)
          setSnackbarOpen(true)
        })
        .catch((err) => {
          console.log(err)
          setSnackbarSeverity("error")
          setSnackbarMessage(err.data.message)
          setSnackbarOpen(true)
        })
        .finally(() => {
          setPostIdToDelete(null);
          setConfirmModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setPostIdToDelete(null);
    setConfirmModalOpen(false);
  };

  const handleEditClick = (postId) => {
    alert(postId);

    // axios.get(`${urls.getpost}?userId=${selector.user.id}&postId=${postId}`)
    // .then(res=>{
    //   console.log("Edit responce: ",res)
    //   setSelectedPost(res)
    //   setOnEditClick(true)
    //   closeMenu()
    // })
    // .catch(err => console.log(err))
    // .finally(()=>{

    // })
  };

  const toggleMenu = (cardId, event) => {
    if (openMenuCardId === cardId) {
      setOpenMenuCardId(null);
    } else {
      setOpenMenuCardId(cardId);
      setAnchorEl(event.currentTarget);
    }
  };

  const closeMenu = () => {
    setOpenMenuCardId(null);
    setAnchorEl(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  // console.log(userFeeds.data.posts)
  //  if(userFeeds.data.posts.length === 0){
  //     console.log("posts are empty")
  //  }

  if(userFeeds.length === 0){
    return (
      
        <Typography variant="body1" sx={{ textAlign: "center" ,py:2}}>
           Share you're thoughts while creating posts
          </Typography>
    
    )
  }
  return (
    <Box flex={2} p={2}>
      <Box>
      
        {loading ? (
          <Typography variant="body1" sx={{ textAlign: "center", py: 2 }}>
            <CircularProgress />
          </Typography>
        ) : userFeeds.data.posts.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Posts are not available at the moment
          </Typography>
        ) : (
          userFeeds.data.posts &&
          userFeeds.data.posts
            .slice()
            .reverse()
            .map((feed, index) => (
              <Box key={feed._id} sx={{ position: "relative" }}>
                <Card sx={{ margin: 5 }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={userFeeds.data.profilePicture}
                        sx={{ bgcolor: "red" }}
                        aria-label="recipe"
                      ></Avatar>
                    }
                    action={
                      <IconButton
                        aria-label="settings"
                        onClick={(e) => {
                          toggleMenu(feed._id, e);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                    title={user && user.name}
                    subheader={formatTimestamp(feed.timestamp)}
                  />

                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {feed.postcontent}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    src={feed.postimageUrl}
                    alt=""
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      padding: "10px",
                    }}
                  />
                </Card>
                {openMenuCardId === feed._id && (
                  <Box>
                    <Menu
                      id={`demo-positioned-menu-${feed._id}`}
                      anchorEl={anchorEl}
                      open={openMenuCardId === feed._id}
                      onClose={closeMenu}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "center",
                      }}
                      sx={{ mt: 2 }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleEditClick(feed._id);
                          closeMenu();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleDeleteClick(feed._id);
                          closeMenu();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>
            ))
        )}
      </Box>
      <MuiConfirmModal
        open={confirmModalOpen}
        handleClose={handleCancelDelete}
        handleConfirm={handleConfirmDelete}
      />
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default AuthFeeds;
