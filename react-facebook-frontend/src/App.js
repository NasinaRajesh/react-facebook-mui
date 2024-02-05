import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import SideBar from "./components/SideBar";

import RightBar from "./components/RightBar";
import Feed from "./components/Feed";
import { Box, Stack, ThemeProvider, Typography, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage";

import NoPage from "./components/NoPage";

import { useSelector } from "react-redux";
import LoggedUerProfile from "./components/Auth0/LoggedUerProfile";
import AuthNavbar from "./components/Auth0/Dashboard";
import AuthSideBar from "./components/Auth0/Sidebar";
import AuthRightBar from "./components/Auth0/Rightbar";
import AuthFeeds from "./components/Auth0/AuthFeeds";
import AuthAddPost from "./components/Auth0/AuthAddPost";

import { useAuth0 } from "@auth0/auth0-react";
import Friends from "./components/Auth0/Sidebar/Friends";
import CreateAccount from "./components/Auth0/CreateAccount";
import NewMessage from "./components/NewMessage";
function App() {

  const selector = useSelector((state) => state.LoggedUser.user);
  
  const [mode, setMode] = useState("light");
  const [postAdded, setPostAdded] = useState(false); //  to trigger Feed component when created post
 const [postDeleted, setPostDeleted] = useState(false) ; // to trigger getPosts in Rightbar when delete post in Feed
  const [onEditClick, setOnEditClick] = useState(false); // To trigger  Tooltip componet in AddPost.jsx

  const [selectedPost, setSelectedPost] = useState([]); // To get selected post in EDit click Feed.jsx
  const [acceptedRequest, setAcceptedRequest] = useState([]) ; // To trigger fetchFriends function in RightBar componentIn when  accept the request in navbar drawer
  const [openNewmessage, setOpenNewmessage] = useState(false)
  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
    primary: {
      main: '#2222'
    },
    secondary: {
      main: 'red'
    }

  });

  function UserDashboard() {
    return (
      <Box bgcolor={"background.default"} color={"text.primary"} >
        <Navbar  onPostAdded={() => setPostAdded(!postAdded)} onFriendRequestAccecpt={()=> setAcceptedRequest(!acceptedRequest)} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <SideBar mode={mode} setMode={setMode} />

          <Feed
            postAdded={postAdded}
            onPostAdded={() => setPostAdded(!postAdded)}
            setOnEditClick={setOnEditClick}
            setSelectedPost={setSelectedPost}
            onPostDeleted={() => setPostDeleted(!postDeleted)}
          />

          <RightBar openNewmessage={openNewmessage} setOpenNewmessage={setOpenNewmessage} mode={mode}  postDeleted={postDeleted} acceptedRequest={acceptedRequest}/> 
        </Stack>
        <AddPost
          onPostAdded={() => setPostAdded(!postAdded)}
          onEditClick={onEditClick}
          setOnEditClick={setOnEditClick}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
        <NewMessage mode={mode}/>
      </Box>
    );
  }

  function AuthDashboard() {
    const [postAdded, setPostAdded] = useState(false); //  to trigger Feed component when creating a post in AuthPost component update
    const [openModal, setOpenModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState({ postcontent: '' });
    const { isLoading } = useAuth0();
    if (isLoading) {
      return (
        <Typography sx={{ textAlign: 'center', py: 2 }} variant="body2">loading...</Typography>
      )
    }
    return (
      <Box>
        <AuthNavbar />
        <Stack direction="row" spacing={2} justifyContent="space-around">
          <AuthSideBar />
          <AuthFeeds postAdded={postAdded} setOpenModal={setOpenModal} setSelectedPost={setSelectedPost} />
          <AuthRightBar />
        </Stack>

        <AuthAddPost onPostAdded={() => setPostAdded(!postAdded)} openModal={openModal} setOpenModal={setOpenModal} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />

      </Box>
    )
  }
  
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route
            path="/dash"
            element={selector.user ? <UserDashboard /> : <Navigate to="/" />}
          ></Route>
          <Route path="*" element={<NoPage />}></Route>
          <Route path="/signup" element={<RegistrationPage />}></Route>
          <Route path="/authdash" element={<AuthDashboard />}></Route>
          <Route path="/create-auth0-account" element={<CreateAccount/>}></Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
