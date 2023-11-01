import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@material-ui/core";

const UserProfileCard = () => {
  const user = {
    avatar:
      "https://img.freepik.com/premium-vector/illustration-dussehra-festival-celebration_23-2150784756.jpg?size=626&ext=jpg",
    fullName: "Rajesh Nasina",
  };

  return (
    <Card sx={{ width: 300, height: 180 }}>
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
              flexDirection:'row',
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              src={user.avatar}
              alt="User Avatar"
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5" component="div">
              {user.fullName}
            </Typography>
          </Box>
          <Button variant="contained" color="primary">
            Add Friend
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
