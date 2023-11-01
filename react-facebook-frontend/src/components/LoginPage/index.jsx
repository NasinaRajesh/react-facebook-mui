import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { urls } from "../../urls";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Link,
  styled,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getloggedUserDetails } from "../UserStateSlice";
const StyledLoginButton = styled(Button)(({ theme }) => ({
  outline: "none",
  border: "none",
  backgroundColor: theme.palette.primary,
  padding: "10px",
  margin: "3px 0px 3px",
  borderRadius: theme.shape.borderRadius,

  color: "#fff",
  "&:hover": {
    background: theme.palette.primary.dark,
  },
}));

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

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email*").required("Email is required*"),
  password: Yup.string().required("Password is required*"),
});

function LoginPage() {
  const [invalidCredentials, setInvalidCredentials] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigatesTo = useNavigate();
  const dispatch = useDispatch()
  const handleSubmit = (values) => {
    setIsLoading(true); // Set loading to true when request starts

    const loginDetails = {
      email: values.email,
      password: values.password,
    };

    axios
      .post(`${urls.login}`, loginDetails)
      .then((res) => {
        console.log(res);

        const token = res.data.token;
        
        //payload data
        if (token) {
          localStorage.setItem("token", token);
          navigatesTo("/dash", { replace: true });
        }
        const decodedToken = jwtDecode(token);
        dispatch(getloggedUserDetails(decodedToken)) ;
        
        
      })
      .catch((error) => {
        console.log(error);
        setInvalidCredentials(error.response.data.msg);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false when the request is complete
      });
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
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form noValidate sx={{ mt: 1 }}>
              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />

              <Field
                as={TextField}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword? "text" : "password"}
                id="password"
                autoComplete="current-password"

                 // Add an InputAdornment for the hide/show icon
                 InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
              <StyledLoginButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                //   sx={{ mt: 3, mb: 2, bgcolor: "#1877f2", padding: "10px" , outline:'none', border:'none'}}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Log In"
                )}
              </StyledLoginButton>
              <UserBox>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Link
                    href="#"
                    variant="body2"
                    sx={{ textDecoration: "none" }}
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    href="/signup"
                    variant="body2"
                    sx={{ textDecoration: "none" }}
                  >
                    Don't have an account Signup?
                  </Link>
                </Box>
                <Divider
                  variant="middle"
                  sx={{ border: 2, width: "100%", mt: 2 }}
                />
                <StyledCreateAccountButton
                  onClick={() => navigatesTo("/signup", { replace: true })}
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: "#06b909",

                    width: "60%",
                  }}
                >
                  Create an account
                </StyledCreateAccountButton>

                <Typography variant="body1" color="error">
                  {invalidCredentials}
                </Typography>
              </UserBox>
            </Form>
          </Formik>
        </CustomCard>
      </CustomBox>
    </Container>
    
  );
}

export default LoginPage;
