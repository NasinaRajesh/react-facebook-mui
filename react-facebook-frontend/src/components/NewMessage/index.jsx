import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Fab,
  styled,
  Modal,
  Box,
  TextField,
  Typography,
  Input,
  Card,
  CardContent,
  Badge,
  Avatar,
  useMediaQuery
} from "@mui/material";
import { BorderColor, Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { openNewmessageBox } from "../UserStateSlice";
import axios from "axios";
import { urls } from "../../urls";
import ChatCard from "../ChatCard";
function NewMessage({mode}) {
  const selector = useSelector((state)=> state.LoggedUser.user) ;
  //console.log(selector)
  const openNewmessageBoxSelector = useSelector((state)=> state.LoggedUser.openNewmessageBox) ;
  
  const dispatch = useDispatch()
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },  
  }));

  const [openModal, setOpenModal] = useState(false);
 const [friends, setFriends] = useState([]) ;
 const [fileterFriends, setFilterFriends] = useState([]) ;
 const [chatCardOpen, setChatCardOpen] = useState(false) ;
  const [chatFriendDetails, setChatFriendDetails] = useState([]) ;
  // const [friendName, setFriendName] = useState("");
  // console.log(friendName);
  const fetchFriends = () => {
    const emailId = selector.user.email ;
    // console.log(emailId, "dfdashfbisfbsif")
    axios.get(`${urls.getFriends}?emailId=${emailId}`)
    .then((res)=>{
      setFriends(res.data.userFriends)
      console.log(res.data.userFriends)
    })
    .catch((error)=>console.log(error))
  }
  useEffect(()=> {
    fetchFriends()
  },[openModal])
  const handleClose = () => {
    console.log("handle close function called to close the Newmessage Card")
    setOpenModal(false);
    dispatch(openNewmessageBox())
  };

  const handleChange = (event) => {
    const inputFriendName = event.target.value.toLowerCase();
    // setFriendName(inputFriendName);
    
    const filteredFriends = friends.filter(
      (friend) => friend.username.toLowerCase().includes(inputFriendName)
    );
  
    setFilterFriends([...filteredFriends]);
    
  };

  const handleChatCardOpen = (friend) => { 
    setChatFriendDetails(friend)
    console.log("handle chat card open function called")
    setOpenModal(false)
    dispatch(openNewmessageBox()) 
    
     setChatCardOpen(!chatCardOpen) ;
    
    

  }
  console.log('chatCardOpen'  , chatCardOpen, 'openModal :' ,openModal, 'openNewmessageBoxSelector : ', openNewmessageBoxSelector) 
  const displayBox = useMediaQuery('(min-width:820px)')
  return (
    <Box sx={{display: displayBox ? "block" : "none"}}>
      <Tooltip
        onClick={() =>{ setOpenModal(!openModal) ; setChatCardOpen(false)}}
        title="New message"
        sx={{
          position: "fixed",
          bottom: 20,
          //   left: { xs: "calc(50% - 20px)", md: 30 },
          right: 30,
        }}
      >
        <Fab color="primary" aria-label="Addpost">
          <BorderColor />
        </Fab>
      </Tooltip>
      <Box
        position="fixed"
        bottom={80}
        right={50}
        
        zIndex={1} // with this Z-index box is visible above other components.
      >
        <Card
          sx={{
            display: openModal || openNewmessageBoxSelector ? "block" : "none",
            bgcolor: "background.default",
            color: "text.primary",
            width: "280px",
            height: "350px",
            p: 1,
            mt: 1,
            borderRadius: 1,
          }}
          
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">New message</Typography>
              <Close onClick={() => handleClose()} sx={{cursor : 'pointer'}} />
            </Box>
            <Box>
              <Input
                placeholder="To:"
                //value={friendName}
                onChange={(e) => handleChange(e)}
                fullWidth
              />
            </Box>
            <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pt:1,
              pb:1
            }}
          >
            {fileterFriends.length >=1 ? (
              fileterFriends.slice().reverse().map((friend) => (
                <Box key={friend.userId} onClick={()=> {handleChatCardOpen(friend) }}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 1.25,
                    "&:hover": {
                        backgroundColor: mode === "light" ? "#e0e0e0" : "#3C3D3E", //dark bgColor#3C3D3E light bgColor #e0e0e0
                        cursor: "pointer",
                        borderRadius : 1
                      },
                  }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar sx={{ width: 40, height: 40 }} alt={friend.username} src={friend.profilePicture} />
                  </StyledBadge>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: 15, marginLeft: 1 }}
                  >
                    {friend.username}
                  </Typography>
                </Box>
              ))
            ) : <Typography variant="body2">No results found</Typography> }
          </Box>
          </CardContent>
        </Card>

        <ChatCard setChatCardOpen={setChatCardOpen} chatCardOpen={chatCardOpen} chatFriendDetails={chatFriendDetails}/>
      </Box>
    </Box>
  );
}

export default NewMessage;
