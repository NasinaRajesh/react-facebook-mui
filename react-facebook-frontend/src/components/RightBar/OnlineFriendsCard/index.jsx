import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  styled,
  Badge,
  Modal,
  Tooltip
} from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { openNewmessageBox } from "../../UserStateSlice";
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

const AvatarWithBadge = styled(Avatar)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

function OnlineFriendsCard({ friends, mode , setOpenNewmessage, openNewmessage}) {
  console.log(openNewmessage) ;
  const dispatch = useDispatch() ;
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Card
        key={1}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" pb={2}>
            <Typography>Contacts</Typography>
            <Box display="flex">
              <Tooltip title="New message" arrow onClick={()=> dispatch(openNewmessageBox())}>
                <Search  sx={{cursor : 'pointer'}} />
                </Tooltip>
              
              <MoreVert sx={{cursor : 'pointer'}} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {friends.length >=1 ? (
              friends.slice().reverse().map((friend) => (
                <Box
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
            ) : <Typography>You have no friends..</Typography>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OnlineFriendsCard;
