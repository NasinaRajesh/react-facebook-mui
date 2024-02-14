import {
  Add,
  AddCircle,
  Call,
  CallEndOutlined,
  Clear,
  EmojiEmotions,
  GifBoxRounded,
  GifRounded,
  PhotoLibrary,
  Remove,
  Send,
  ThumbUpAlt,
  VideoCall,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography,
  styled,
  Badge,
  Stack,
  Input,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import CustomInput from "../CustomInput";
import { useSelector } from "react-redux";
import axios from "axios";
import { urls } from "../../urls";
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
function ChatCard({setChatCardOpen, chatCardOpen, chatFriendDetails }) {
  const loggedUserId = useSelector(state=> state.LoggedUser.user.user.id)
  //console.log(loggedUserId)
  //console.log("I am from chat card component");
  console.log(chatCardOpen, chatFriendDetails);

  const [inputValue, setInputValue] = useState('');
  const [senderMessages, setSenderMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const handleChangeOfChattingCard = (value) => {
    setInputValue(value);
  };
  //console.log(inputValue)
  
  const handleMessageSend = () => {
    if(loggedUserId && chatFriendDetails.userId){
      axios.post(`${urls.sendMessage}?senderId=${loggedUserId}&receiverId=${chatFriendDetails.userId}`, {
        messageContent : inputValue && inputValue
      })
      .then(res=> {
        console.log(res)
        setInputValue('')
        getSenderMessages()
        getReceivedMessages()
      })
      .catch(err=> console.log(err))
    }
    
  }
  const getSenderMessages = ()=> {
    axios.get(`${urls.getSenderMessages}${loggedUserId}`)
    .then(res=> {
      console.log(res.data.senderMessages);
      setSenderMessages(res.data.senderMessages)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const getReceivedMessages = ()=> {
    axios.get(`${urls.getReceivedMessages}${loggedUserId}`)
    .then(res=> {
      console.log(res.data.receivedMessages);
      setReceivedMessages(res.data.receivedMessages)
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(()=>{
    if(loggedUserId){
      getSenderMessages()
      getReceivedMessages()
    }
    
  },[loggedUserId])

 

  return (
    <Box position="fixed" bottom={80} right={150} zIndex={1} >
      <Card
        sx={{
          display: chatCardOpen ? "block" : "none",
          bgcolor: "background.default",
          color: "text.primary",
          width: "360px",
          height: "450px",
          borderRadius: 1,
          
        }}
      >
        <CardContent sx={{  paddingBottom:0 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Box display="flex">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  alt={chatFriendDetails?.username}
                  src={chatFriendDetails?.profilePicture}
                />
              </StyledBadge>
              <Box
                display="flex"
                flexDirection="column"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: 15, marginLeft: 1, marginBottom: -0.5 }}
                >
                  {chatFriendDetails.username}
                </Typography>
                <Typography variant="body2">Active now</Typography>
              </Box>
            </Box>
            <Stack sx={{cursor:'pointer'}} direction={"row"} gap={1}>
              <Call color="primary" />
              <VideoCall color="primary" />
              <Remove color="primary" />
              <Clear  color="primary" onClick={()=> setChatCardOpen(false)}/>
            </Stack>
            
          </Box>
          <hr className="w-100"/>
        </CardContent>
        {/* <h6>Rajesh</h6> */}
        <CardContent sx={{height:'300px',paddingBottom:0 , paddingTop:0}}>
          <Box sx={{height:'100%',display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
            <Box   maxHeight={'80%'} overflow={"auto"} overflowX={'hidden'} sx={{display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:"flex-start"}} >
              {
                receivedMessages.length>0 && receivedMessages.map((receiverMessages, index)=> (
                  <>
                    <Box  width={'50%'} key={index} >
                      <Typography  variant="body2"   fontSize={12} textAlign={"left"}>{receiverMessages?.content}</Typography>
                    </Box>
                  </>
                ))
              }
            </Box>
            <Box   maxHeight={'80%'} overflow={"auto"} overflowX={'hidden'} sx={{display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:"flex-end"}} >
              {
                senderMessages?.map((sentMessages, index)=> (
                  <>
                    <Box key={index}  width={'50%'} >
                      <Typography variant="body2"   fontSize={12} textAlign={"right"}>{sentMessages.content}</Typography>
                    </Box>
                  </>
                ))
              }
            </Box>
          </Box> 

        </CardContent >
        <CardContent sx={{paddingBottom:0 , paddingTop:0}} >
          <Box sx={{height:"50px" }}  display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} >
            <Box >
              <Stack direction="row" gap={1} sx={{cursor : 'pointer'}}>
                  <AddCircle sx={{display:inputValue.length > 0 ? 'none' : 'block'}} color="primary" fontSize="medium" />
                  <PhotoLibrary sx={{display:inputValue.length > 0 ? 'none' : 'block'}} color="primary" fontSize="medium" />
                  <EmojiEmotions sx={{display:inputValue.length > 0 ? 'none' : 'block'}} color="primary" fontSize="medium" />
                  <GifRounded sx={{display:inputValue.length > 0 ? 'none' : 'block'}} color="primary" fontSize="medium" />
                  <CustomInput onChange={handleChangeOfChattingCard} inputValue={inputValue} />
                  
                  {inputValue.length > 0 ? <Send onClick={()=> handleMessageSend()} color="primary"/> : <ThumbUpAlt color="primary"  /> }
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
    </Box>
  );
}

export default ChatCard;
