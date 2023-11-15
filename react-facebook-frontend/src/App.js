import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import SideBar from "./components/SideBar";

import RightBar from "./components/RightBar";
import Feed from "./components/Feed";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import AddPost from "./components/AddPost";
import LoginPage from "./components/LoginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegistrationPage from "./components/RegistrationPage";

import NoPage from "./components/NoPage";

import { useSelector } from "react-redux";
import LoggedUerProfile from "./components/Auth0/LoggedUerProfile";
import AuthNavbar from "./components/Auth0/Dashboard";
import AuthSideBar from "./components/Auth0/Sidebar";
import AuthRightBar from "./components/Auth0/Rightbar";
import AuthFeeds from "./components/Auth0/AuthFeeds";
import AuthAddPost from "./components/Auth0/AuthAddPost";


function App() {
  const selector = useSelector((state) => state.LoggedUser.user);
  console.log(selector);
  const [mode, setMode] = useState("light");
  const [postAdded, setPostAdded] = useState(false); // Add a flag to trigger Feed component update

  const [onEditClick, setOnEditClick] = useState(false); // To trigger  Tooltip componet in AddPost.jsx

  const [selectedPost, setSelectedPost] = useState([]); // To get selected post in EDit click Feed.jsx

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
    primary : {
      main : '#2222'
    },
    secondary : {
      main : 'red'
    }
    
  });

  function MainPage() {
    return (
      <Box bgcolor={"background.default"} color={"text.primary"} >
        <Navbar onPostAdded={() => setPostAdded(!postAdded)} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <SideBar mode={mode} setMode={setMode} />

          <Feed
            postAdded={postAdded}
            onPostAdded={() => setPostAdded(!postAdded)}
            setOnEditClick={setOnEditClick}
            setSelectedPost={setSelectedPost}
          />

          <RightBar />
        </Stack>
        <AddPost
          onPostAdded={() => setPostAdded(!postAdded)}
          onEditClick={onEditClick}
          setOnEditClick={setOnEditClick}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      </Box>
    );
  }

  function AuthDashboard(){
    const [postAdded, setPostAdded] = useState(false); // Add a flag to trigger Feed component update
    return(
     <Box>
      <AuthNavbar/>
      <Stack direction="row" spacing={2} justifyContent="space-around">
        <AuthSideBar/>
        <AuthFeeds postAdded={postAdded}/>
        <AuthRightBar/>
      </Stack>

      <AuthAddPost onPostAdded={()=>setPostAdded(!postAdded)}/>
      
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
            element={selector ?   <MainPage /> : <Navigate to="/" /> }
          ></Route>
          <Route path="*" element={<NoPage />}></Route>
          <Route path="/signup" element={<RegistrationPage />}></Route>
          <Route path="/authdash" element={<AuthDashboard/>}></Route> 
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
