// import React from 'react'

// function AuthSideBar() {
//   return (
//     <div>AuthSideBar</div>
//   )
// }

// export default AuthSideBar

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import {
  AccountBox,
  Article,
  Group,
  Home,
  LogoutOutlined,
  ModeNight,
  PersonSearch,
  Settings,
  Storefront,
  
} from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { logOutAuth0User } from "../../UserStateSlice";
import { useNavigate } from "react-router-dom";
function AuthSideBar() {
  const navigatesTo = useNavigate() ;
  const dispatch = useDispatch() ;
  const {logout, isLoading} = useAuth0() ;
  const auth0userLogout = () => {
    localStorage.removeItem("auth0user");
    dispatch(logOutAuth0User());
    logout({ logoutParams: { returnTo: window.location.origin } });
    
  };

  if(isLoading){
    console.log("react auth0 isLoading called")
    return(
      <Typography sx={{textAlign:'center', py:5}}>
        loading...
      </Typography>
    )
   }
  return (
    <Box flex={1} p={2}  sx={{ display: { xs: "none", sm: "block" } ,  }}>
      <Box position="fixed"  >
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#home">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Homepage" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#pages">
              <ListItemIcon>
                <Article />
              </ListItemIcon>
              <ListItemText primary="Pages" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#groups">
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="groups" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#marketplace">
              <ListItemIcon>
                <Storefront />
              </ListItemIcon>
              <ListItemText primary="Marketplace" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#Friends">
              <ListItemIcon>
                <PersonSearch />
              </ListItemIcon>
              <ListItemText primary="Friends" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#Settings">
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#Profile">
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

          

          <ListItem disablePadding>
            <ListItemButton component="a" href="#switch">
              <ListItemIcon>
                <ModeNight />
              </ListItemIcon>
              <Switch
                
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
             <ListItemButton onClick={()=>auth0userLogout()} >
               <ListItemIcon>
                <LogoutOutlined/>
               </ListItemIcon>
               <ListItemText primary="Logout" />
              </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default AuthSideBar;
