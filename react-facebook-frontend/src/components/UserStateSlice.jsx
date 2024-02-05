import { createSlice } from "@reduxjs/toolkit";

export const UserStateSlice = createSlice({
    name : 'Userdetails',
    initialState : {
        user : [],
        auth0user : [],
        openNewmessageBox : false
    },
    
    reducers : {
        getloggedUserDetails : (state, action) => {
            state.user = action.payload ;
        },
        logOutUser : (state) => {
            state.user = [] ;
        },
        updateProfilePicture: (state, action) => {
            // Update the profilePicture field
            state.user.profilePicture = action.payload;
        },
        getAuth0LoggedUser : (state, action)=> {
            state.auth0user = action.payload
        },
        logOutAuth0User : (state) => {
            state.auth0user = {} ;
        },
        openNewmessageBox : (state) => {
            state.openNewmessageBox = !state.openNewmessageBox ;
        }
    }
})

export const {getloggedUserDetails , logOutUser, updateProfilePicture, getAuth0LoggedUser, logOutAuth0User, openNewmessageBox} = UserStateSlice.actions ; 
export default UserStateSlice.reducer ;