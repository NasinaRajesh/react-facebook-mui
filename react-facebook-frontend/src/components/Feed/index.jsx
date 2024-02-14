import React, { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "../../urls";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder, MoreVert, Share } from "@mui/icons-material";
import { useSelector } from "react-redux";
import MuiConfirmModal from "../MuiConfirmModal";
import CustomSnackbar from "../CustomSnackbar";
  function Feed({  postAdded, onPostDeleted, setOnEditClick,  setSelectedPost}) {

    const selector = useSelector((state)=> state.LoggedUser.user) ; 
    //console.log(selector.user.username, selector.user.id, "redux")
  const [userFeeds, setUserFeeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenuCardId, setOpenMenuCardId] = useState(null);
  const [deletingPost , setDeletingPost] = useState(false) ; 
  const [confirmModalOpen, setConfirmModalOpen] = useState(false) ;
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchAllUserFeeds = () => {
    console.log("fetchAllUserFeeds are called")
    const userId = selector.user.id;
      axios
        .get(`${urls.getposts}/${userId}`)
        .then((res) => {
          console.log("Feeds response: " , res)
          setUserFeeds(res.data);
          
        })
        .catch((error) => { 
          
          console.log(error);
        })
        .finally((final)=> setIsLoading(false))
  }


  useEffect(() => {
    
      fetchAllUserFeeds()
    
  }, [selector, postAdded]);

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

  const handleCancelDelete = () => {
    setPostIdToDelete(null);
    setConfirmModalOpen(false);
  };
  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setConfirmModalOpen(true);
  };
  const handleConfirmDelete = () => {
    
    if (selector && postIdToDelete ) {
      
      axios
        .delete(
          `${urls.deletepost}?userId=${selector.user.id}&postId=${postIdToDelete}`
        )
        .then((res) => {
          console.log(res);
          fetchAllUserFeeds() ;
          setSnackbarSeverity("success") ;
          setSnackbarMessage(res.data.message) ;
          setSnackbarOpen(true) ;
          onPostDeleted() ;
        })
        .catch((err) => {
          console.log(err) ;
          setSnackbarSeverity("error") ;
          setSnackbarMessage(err.data.message) ;
          setSnackbarOpen(true) ;
        })
        .finally((res)=>{
          setPostIdToDelete(null)
          setConfirmModalOpen(false)
        })
    }
  };

  const handleEditClick = (postId) => {
   
    
    //alert(postId);

    axios.get(`${urls.getpost}?userId=${selector.user.id}&postId=${postId}`)
    .then(res=>{
      console.log("Edit responce: ",res) 
      setSelectedPost(res)
      setOnEditClick(true)
      closeMenu()
    })
    .catch(err => console.log(err))
    .finally(()=>{
      
    })
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
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <Box flex={2} p={1}  >
      
      <Box >
          
        {isLoading ? (
         <Typography variant="body1" sx={{ textAlign: "center", py: 2 }}>
          <CircularProgress />
       </Typography>
        ) : userFeeds.data.posts.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Posts are not available at the moment 
          </Typography>
        ) : (
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
                    title={selector.user.username}
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

                  {/* <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <Checkbox
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite sx={{ color: "red" }} />}
                      />
                    </IconButton>
                    <IconButton aria-label="share">
                      <Share />
                    </IconButton>
                  </CardActions> */}
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

export default Feed;
