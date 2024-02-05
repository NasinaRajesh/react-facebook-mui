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
import React from "react";
import CustomInput from "../CustomInput";
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
  console.log("I am from chart card component");
  console.log(chatCardOpen, chatFriendDetails);
  return (
    <Box position="fixed" bottom={80} right={200} zIndex={1}>
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
        <CardContent>
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
                  alt={chatFriendDetails.username}
                  src={chatFriendDetails.profilePicture}
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

        <CardContent >
          <Box sx={{height:"310px"}}  display={"flex"} flexDirection={"column"} justifyContent={"flex-end"} >
            <Box >
              <Stack direction="row" gap={1} sx={{cursor : 'pointer'}}>
                  <AddCircle color="primary" fontSize="medium" />
                  <PhotoLibrary color="primary" fontSize="medium" />
                  <EmojiEmotions color="primary" fontSize="medium" />
                  <GifRounded color="primary" fontSize="medium" />
                  <CustomInput/>
                  <ThumbUpAlt color="primary" />
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
    </Box>
  );
}

export default ChatCard;
