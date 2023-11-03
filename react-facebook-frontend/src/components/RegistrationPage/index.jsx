import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";

import { urls } from "../../urls";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  styled,
  Card,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";



// const StyledLoginButton = styled(Button)(({ theme }) => ({
//   outline: "none",
//   border: "none",
//   backgroundColor: theme.palette.primary,
//   padding: "10px",
//   margin: "3px 0px 3px",
//   borderRadius: theme.shape.borderRadius,

//   color: "#fff",
//   "&:hover": {
//     background: theme.palette.primary.dark,
//   },
// }));

const StyledCreateAccountButton = styled(Button)(({ theme }) => ({
  outline: "none",
  border: "none",
  backgroundColor: theme.palette.success,

  margin: "3px 0px 3px",
  borderRadius: theme.shape.borderRadius,
  width: "60%",
  color: "#fff",
  "&:hover": {
    background: theme.palette.success.dark,
  },
}));

const CustomCard = styled(Card)({
  backgroundColor: "#fff",
  padding: "2rem",
  width: "450px",
  height: "380x",
  borderRadius: "15px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
});

const UserBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3rem",

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));

function RegistrationPage() {
  const navigatesTo = useNavigate();
  const [isUserExit, setIsUserExist] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("")
  // console.log(selectedDate.$D, "-", selectedDate.$M + 1 , "-", selectedDate.$y)
  const formatedate = (date)=>{
    return date.$D + "-" + (selectedDate.$M + 1) + '-'+selectedDate.$y
  }

  // if(selectedDate){
  //  formatedate(selectedDate)
  // }
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordErrorMsg("Passwords do not match");
      return;
    }

    const data = new FormData(event.currentTarget);
    const registrationDetails = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      birthdate: selectedDate && formatedate(selectedDate),
    };

    axios
      .post(urls.register, registrationDetails)
      .then((res) => {
        console.log(res);
        const token = res.data.token;
        const decodedToken = jwtDecode(token);

        console.log(decodedToken);
        setIsUserExist(decodedToken.user.msg);
        setTimeout(()=>{
          navigatesTo('/')
        },1000)
      })
      .catch((error) => {
        console.log(error);

        setIsUserExist(error.response.data.msg);
      });

    console.log(registrationDetails, "registration details");
  };

  return (
    <Container
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CustomBox>
        <Box>
          <Typography component="h1" variant="h3" color="primary">
            Facebook
          </Typography>
          <Typography variant="subtitle2">
            Connect with friends and the world around you on Facebook.
          </Typography>
        </Box>
        <CustomCard>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First name"
              type="text"
              id="firstName"
              autoComplete="First name"
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
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm password"
              type="password"
              id="cpassword"
              autoComplete="current-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker 
                label="Date of birth"
                value={selectedDate} 
                onChange={handleDateChange}
                sx={{width:'100%'}}/>
              </DemoContainer>
            </LocalizationProvider>
            <StyledCreateAccountButton
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#06b909",

                width: "100%",
              }}
            >
              Create an account
            </StyledCreateAccountButton>
              {
                password !== confirmPassword ? <Typography variant="body1" color="error" sx={{textAlign:"center"}}>{passwordErrorMsg}</Typography> : null
              }
            <UserBox>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                {isUserExit && (
                  <Typography variant="body1" color="error">
                    {isUserExit}
                  </Typography>
                )}
                <Link href="/" variant="body2" sx={{ textDecoration: "none" }}>
                  Already have an account Login?
                </Link>
              </Box>
            </UserBox>
          </Box>
        </CustomCard>
      </CustomBox>
    </Container>
  );
}

export default RegistrationPage;
