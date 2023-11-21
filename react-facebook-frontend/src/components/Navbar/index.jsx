import { Check, Clear, Facebook, Mail, Notifications, PersonAdd } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
  Drawer,
  Card,
  CardContent,
  Button
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { urls } from "../../urls";
import { isFocusable } from "@testing-library/user-event/dist/utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// reducers
import { logOutUser } from "../UserStateSlice";
import { updateProfilePicture } from "../UserStateSlice";

function Navbar({ onPostAdded }) {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.LoggedUser.user);
  if (selector) {
    console.log(selector.user.username, selector.user.id, "redux");
  }
  const navigatesTo = useNavigate();

  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to store the URL of the selected image

  // To store profilePicture from database
  const [profile, setProfile] = useState(null);

  // State to track if a new image has been selected
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);

  //image upload
  const handleImageUpload = (file) => {
    setIsNewImageSelected(true); // Set to true when a new image is selected
    // Display the selected image in the TextField

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#3b5998",
  });
  const Search = styled("div")(({ theme }) => ({
    backgroundColor: "white",
    padding: " 0 10px",
    width: "40%",
    borderRadius: theme.shape.borderRadius, //uses a value from the Material-UI theme
    bgcolor: "background.default",

    color: "text.primary",
    "& .MuiInputBase-input::placeholder": {
      // is a CSS selector that targets the placeholder text inside an input element with the class MuiInputBase-input. This is a class name often used by Material-UI's text input components.
      color: theme.palette.secondary.main, // Set the color to the secondary color
    },
  }));

  const Icon = styled("div")(({ theme }) => ({
    // backgroundColor: "white",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    [theme.breakpoints.up("sm")]: {
      display: "flex", // breakpoints are greater than small screen then custom styled Icon component will displayed
    },
    cursor: "pointer",
  }));

  const UserBox = styled("div")(({ theme }) => ({
    // backgr"oundColor: "white",
    display: "block",

    [theme.breakpoints.up("sm")]: {
      // breakpoints are >= small screen then custom styled UserBox component will hide
      display: "none",
    },
  }));

  if (isNewImageSelected) {
    // console.log(`Updating profile picture for user ${selector.user.id}`);

    const imageData = profilePicture;
    //console.log(imageData, "image Data");
    axios
      .patch(`${urls.updateprofile}/${selector.user.id}`, {
        imageData: imageData,
      })
      .then((res) => {
        console.log(res);

        setIsNewImageSelected(false); // Reset to false after the update
        onPostAdded();
      })
      .catch((error) => {
        console.log(error);
        setIsNewImageSelected(false); // Reset to false after error
      });
  }

  // To Fetch the Profile Picture for Navbar
  useEffect(() => {
    console.log("useEffect is called for getting profile");
    axios
      .get(`${urls.getprofile}/` + selector.user.id)
      .then((res) => {
        console.log(res.data.data.profilePicture, "navbar profile");
        dispatch(updateProfilePicture(res.data.data.profilePicture));
        setProfile(res.data);
      })
      .catch((error) => console.log(error));
  }, [selector.user.id, profilePicture]);

  const closeMenu = () => {
    setOpen(false);
  };

  const onLogout = () => {
    localStorage.clear();
    dispatch(logOutUser());
    navigatesTo("/");
  };

  const handleDeleteAccount = (userId) => {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      axios
        .delete(`${urls.deleteAccount}/${userId}`)
        .then((res) => {
          console.log(res);
          localStorage.clear();
          dispatch(logOutUser());
          navigatesTo("/");
        })
        .catch((error) => console.log(error));
    }
  };
  console.log(friendRequests);
  useEffect(()=>{
    const userId = selector.user.id ;
    handleFriendRequests(userId)
  },[selector.user.id])
  
  const handleFriendRequests = (userId) => {
    console.log("handleFriendRequest called")
    // setIsDrawerOpen(true)
    axios
      .get(`${urls.getFriends}/${userId}`)
      .then((res) => setFriendRequests(res.data.friendRequests))
      .catch((error) => console.log(error));
  };
  const handleRejectRequest = (request) => {
    const userId = selector.user.id 
    //console.log(request, selector.user.id)
    axios.delete(`${urls.rejectFriendRequest}?userId=${userId}&requestId=${request.userId}`).then(res=>handleFriendRequests(userId)).catch(error=>console.log(error))
  } 
  const handleAcceptRequest = (requestUser) => {
    //console.log(requestUser)
    const userId = selector.user.id ;
    const requestId = requestUser.userId ;
    axios.post(`${urls.acceptFriendRequest}?userId=${userId}&requestId=${requestId}`,{
      requestUser : requestUser
    })
    .then((res)=> {
      console.log(res)
      handleFriendRequests(userId)
    })
    .catch((error) => console.log(error))
  }
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          Facebook
        </Typography>
        <Facebook sx={{ display: { xs: "block", sm: "none" } }} />
        <Search>
          <InputBase placeholder="Search..." />
        </Search>
        <Icon>
          <Badge  color="error">
            <Notifications />
          </Badge>
          <Badge
            title="Requests"
            badgeContent={friendRequests?friendRequests.length:''}
            color="error"
            sx={{padding:'2px', margin:'1px'}}
            onClick={() => {
              setIsDrawerOpen(true) 
              handleFriendRequests(selector.user.id)
            }
          }
          >
            <PersonAdd />
          </Badge>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            
          >
            {/* Render the friendRequests data or any other content inside the Drawer */}
            <Box sx={{p:2}}>
              <Typography variant="body1">Friend Requests</Typography>
               
                {
                  friendRequests.length > 0 ? friendRequests.map((request, index) => (
                    <Card
                    key={request.userId}
                    sx={{ width: 300, height: 130, marginBottom: 1 , marginTop:1}}
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
                            src={request.profilePicture}
                            alt="User Avatar"
                            sx={{ width: 60, height: 60, marginRight: 1, }}
                          />
                          <Typography variant="h6" component="div">
                            {request.username}
                          </Typography>
                        </Box>
                        <Box mt={1}>
                          <Button onClick={()=>handleAcceptRequest(request)} startIcon={<Check/>} color="success" sx={{textTransform:'none'}}>Accept</Button>
                          <Button onClick={()=>handleRejectRequest(request)} startIcon={<Clear/>} color="error" sx={{textTransform:'none'}}>Reject</Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  )) : <Typography variant="body2" sx={{textAlign:'center',p:5}}>empty...</Typography>
                }
              
            </Box>
          </Drawer>
          <Box>
            <Avatar
              title="Profile"
              src={profile ? profile.data.profilePicture : profilePicture}
              sx={{ width: 24, height: 24, }}
              onClick={(e) => {
                //setAnchorEl(e.currentTarget);
                setOpen(true);
              }}
            ></Avatar>
          </Box>
          <Typography variant="span">{selector.user.username}</Typography>
        </Icon>
        <UserBox>
          <Box sx={{ display: "flex" }}>
            <Avatar
              sx={{ width: 24, height: 24, }}
              src={profile ? profile.data.profilePicture : profilePicture}
              onClick={(e) => {
                //setAnchorEl(e.currentTarget);
                setOpen(true);
              }}
            ></Avatar>
            <Typography variant="span">{selector.user.username}</Typography>
          </Box>
        </UserBox>
      </StyledToolbar>
      <Menu // profile details menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        // anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 7 }}
      >
        <input
          type="file"
          accept=".jpg, .png, .jpeg"
          id="image-upload"
          name="image"
          style={{ display: "none" }}
          onChange={(e) => handleImageUpload(e.target.files[0])}
          //onClick={(e) => setAnchorEl(e.currentTarget)}
        />
        <MenuItem>
          <label htmlFor="image-upload">Update profile</label>
        </MenuItem>
        {/* <MenuItem onClick={(e) => closeMenu()}>My account</MenuItem> */}
        <MenuItem
          onClick={() => {
            // setUserState({});
            onLogout();
            closeMenu();
          }}
        >
          Logout
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteAccount(selector.user.id);

            closeMenu();
          }}
        >
          Delete account
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;
