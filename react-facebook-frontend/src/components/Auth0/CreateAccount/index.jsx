import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  styled,
  Card,
} from "@mui/material";
import axios from "axios";
import { auth0urls } from "../../../urls";

const StyledCreateAccountButton = styled(Button)(({ theme }) => ({
  outline: "none",
  border: "none",
  backgroundColor: theme.palette.success,
  margin: "3px 0px 3px",
  borderRadius: theme.shape.borderRadius,
  width: "100%",
  color: "#fff",
  "&:hover": {
    background: theme.palette.success.dark,
  },
  textTransform: "none",
}));

const CustomCard = styled(Card)({
  backgroundColor: "#fff",
  padding: "2rem",
  width: "450px",
  height: "380x",
  borderRadius: "15px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
});

function CreateAccount() {
  const navigatesTo = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const createAccountDetails = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
    };

    // Include your axios post request logic here
    console.log(createAccountDetails, "create Account details");
    // navigatesTo()
    if(!createAccountDetails.firstName && !createAccountDetails.lastName && !createAccountDetails.email){
        return
    } else {
        axios.post(`${auth0urls.createAccount}`, createAccountDetails)
        .then((res)=>{
            console.log(res)
            navigatesTo('/authdash')
         } )
        .catch((error)=>console.log(error))
        
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        {/* <Typography>Complete your profile to go auth dashboard</Typography> */}
      <CustomCard>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="firstName"
            label="First name"
            type="text"
            id="firstName"
            autoComplete="First name"
            autoCapitalize={true}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="lastName"
            label="last name"
            type="text"
            id="lastname"
            autoComplete="last name"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address"
            name="email"
            autoComplete="email"
            
            value="testemail@gmail.com"
          />
          <StyledCreateAccountButton
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#06b909",
            }}
          >
            Create an account
          </StyledCreateAccountButton>
        </Box>
      </CustomCard>
    </Box>
  );
}

export default CreateAccount;
