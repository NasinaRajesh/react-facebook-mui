import {
  Check,
  Clear,
  Facebook,
  Mail,
  Notifications,
  PersonAdd,
} from "@mui/icons-material";
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
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth0urls, urls } from "../../../urls";
import { isFocusable } from "@testing-library/user-event/dist/utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie' ;
import jwtDecode from "jwt-decode";
// reducers
// import { logOutUser } from "../UserStateSlice";
// import { updateProfilePicture } from "../UserStateSlice";

import { logOutAuth0User, logOutUser } from "../../UserStateSlice";
import { useAuth0 } from "@auth0/auth0-react";
import CustomSnackbar from "../../CustomSnackbar";

function AuthNavbar({ onPostAdded }) {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { logout, isLoading, user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  //console.log(user)
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.LoggedUser.auth0user);
  console.log(selector);
  const navigatesTo = useNavigate();

  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State to store the URL of the selected image


  // State to track if a new image has been selected
const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false) ;

  const [userMetadata, setUserMetadata] = useState(null);
  console.log(userMetadata , "user data")

  useEffect(() => {
    console.log("getUserMetadata function called")
    getUserMetadata()
  
  }, [getAccessTokenSilently, user?.sub]);

  const getUserMetadata = async () => {
    const domain = "dev-8c0es5gx0fgv2mbe.us.auth0.com";

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
       
      });
      console.log('Access Token:', accessToken);
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { user_metadata } = await metadataResponse.json();
      console.log(user_metadata)
      setUserMetadata(user_metadata);
    } catch (e) {
      console.log(e.message);
    }
  };
  //image upload
  const handleImageUpload = (file) => {
    isNewImageSelected(true) ;
    const reader = new FileReader() ;
      reader.onload = (e) => {
        setProfilePicture(e.target.result)
      }
      reader.readAsDataURL(file)
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
      // breakpoints are greater than small screen then custom styled UserBox component will hide
      display: "none",
    },
  }));


const closeMenu = () => {
    setOpen(false);
  };

    const auth0userLogout = () => {
    
    localStorage.removeItem("auth0user");
    Cookies.remove("auth0user")
    dispatch(logOutAuth0User());
    logout({ logoutParams: { returnTo: window.location.origin } });
    // navigatesTo("/");
  };

  const handleDeleteAccount = (userId) => {
    const confirm = window.confirm("Are you sure you want to delete");
    if (confirm) {
      axios
        .delete(`${urls.deleteAccount}/${userId}`)
        .then((res) => {
          console.log(res);
          localStorage.clear();
          dispatch(logOutAuth0User());
          navigatesTo("/");
        })
        .catch((error) => console.log(error));
    }
  };
  console.log(friendRequests);
    useEffect(()=>{
      
      handleFriendRequests()
    },[selector.email])
  const handleFriendRequests = () => {
    console.log("handleFriendRequest called"); 
    setLoading(true)
    axios
      .post(`${auth0urls.friendRequests}`, {
        email: selector.email,
      })
      .then((res) => {
        setLoading(false)
        setFriendRequests(res.data.friendRequests)
    })
      .catch((error) => console.log(error));
  };
  const handleRejectRequest = (request) => {
    console.log(request.email);
    const emailId = selector.email;
    // //console.log(request, selector.email)
    axios
      .delete(
        `${auth0urls.rejectFriendRequest}?emailId=${emailId}&requestId=${request.email}`
      )
      .then((res) => {
        console.log(res);
        handleFriendRequests();
        setSnackbarSeverity("success") ;
        setSnackbarMessage(res.data.message) ;
        setSnackbarOpen(true) ;
      })
      .catch((error) => {
        console.log(error)
        handleFriendRequests();
        setSnackbarSeverity("error") ;
        setSnackbarMessage(error.response.data.error) ;
        setSnackbarOpen(true) ;
      });
  };
  const handleAcceptRequest = (requestUser) => {
    console.log(requestUser);
    const emailId = selector.email;
    const requestId = requestUser.email;
    axios
      .post(
        `${auth0urls.acceptFriendRequest}?emailId=${emailId}&requestId=${requestId}`,
        {
          requestUser: requestUser,
        }
      )
      .then((res) => {
        console.log(res);
        handleFriendRequests();
        setSnackbarSeverity("success") ;
        setSnackbarMessage(res.data.message) ;
        setSnackbarOpen(true) ;
      })
      .catch((error) => {
        console.log(error)
        handleFriendRequests();
        setSnackbarSeverity("error") ;
        setSnackbarMessage(error.response.data.error) ;
        setSnackbarOpen(true) ;
      });
  };

  if(isLoading){
    return(
      <Typography sx={{textAlign:'center', py:5}}>
        loading...
      </Typography>
    )
   }

   const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

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
          <Badge color="error">
            <Notifications />
          </Badge>
          <Badge
             title="Requests"
             badgeContent={friendRequests?friendRequests.length:''}
             color="error"
             sx={{padding:'2px', margin:'1px'}}
            onClick={() => {
              setIsDrawerOpen(true);
              handleFriendRequests();
            }}
          >
            <PersonAdd />
          </Badge>

          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            {/* Render the friendRequests data inside the Drawer */}
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">Friend Requests</Typography>

              {friendRequests.length > 0 ? (
                friendRequests.map((request, index) => (
                  <Card
                    key={request.userId}
                    sx={{
                      width: 300,
                      height: 130,
                      marginBottom: 1,
                      marginTop: 1,
                    }}
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
                            sx={{ width: 60, height: 60, marginRight: 1 }}
                          />
                          <Typography variant="h6" component="div">
                            {request.username}
                          </Typography>
                        </Box>
                        <Box mt={1}>
                          <Button
                            onClick={() => handleAcceptRequest(request)}
                            startIcon={<Check />}
                            color="success"
                            sx={{ textTransform: "none" }}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request)}
                            startIcon={<Clear />}
                            color="error"
                            sx={{ textTransform: "none" }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", p: 5 }}>
                  empty...
                </Typography>
              )}
              {/* {loading && <Typography variant="body2" sx={{ textAlign: "center", p: 5 }}>
                  loading...
                </Typography>} */}
            </Box>
          </Drawer>

          <Box>
            <Avatar
              title="Profile"
              src={selector.picture}
              sx={{ width: 24, height: 24 }}
              onClick={(e) => {
                //setAnchorEl(e.currentTarget);
                setOpen(true);
              }}
            ></Avatar>
          </Box>
          <Typography variant="span">{selector.name}</Typography>
        </Icon>
        <UserBox>
          <Box sx={{ display: "flex" }}>
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={selector.picture}
              onClick={(e) => {
                //setAnchorEl(e.currentTarget);
                setOpen(true);
              }}
            ></Avatar>
            <Typography variant="span">{selector.name}</Typography>
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
        {/* <MenuItem>
          <label htmlFor="image-upload">Update profile</label>
        </MenuItem> */}
        {/* <MenuItem onClick={(e) => closeMenu()}>My account</MenuItem> */}
        <MenuItem
          onClick={() => {
            // setUserState({});
            auth0userLogout();
            closeMenu();
          }}
        >
          Logout
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleDeleteAccount(user.email);

            closeMenu();
          }}
        >
          Delete account
        </MenuItem> */}
      </Menu>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </AppBar>
  );
}

export default AuthNavbar;
