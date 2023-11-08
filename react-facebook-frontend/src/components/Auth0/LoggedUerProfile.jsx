import React from "react";
import { Card, CardContent, Box, Avatar, Typography, Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { logOutAuth0User } from "../UserStateSlice";
import { useDispatch , useSelector} from "react-redux";


function LoggedUerProfile({ auth0User }) {
    const dispatch = useDispatch();
    const selectorauth0 = useSelector((state)=>state.LoggedUser.auth0user) ;
    const selector = useSelector((state => state.LoggedUser.user))
    console.log(selectorauth0.picture,"logged")
    console.log(selector,"selector user")

    if(selector){
        console.log(selector, selectorauth0,'bvnm')   
    }
    const { logout } = useAuth0();
    
    console.log("Logged user component")
    function logoutAuthUser(){
        dispatch(logOutAuth0User())
        logout({ logoutParams: { returnTo: window.location.origin } });    
    }
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Card
                key={auth0User.email}
                sx={{

                    width: 300,
                    height: 130,
                    marginBottom: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
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
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                src={auth0User.picture}
                                alt="auth0User Avatar"
                                sx={{ width: 60, height: 60, marginRight: 1 }}
                            />
                            <Typography variant="h6" component="div">
                                {auth0User.name}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            <Button onClick={()=>logoutAuthUser()}>Logout</Button>
        </Box>
    );
}

export default LoggedUerProfile;
