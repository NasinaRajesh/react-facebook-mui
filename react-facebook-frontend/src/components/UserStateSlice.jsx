import { createSlice } from "@reduxjs/toolkit";

export const UserStateSlice = createSlice({
    name : 'Userdetails',
    initialState : {
        user : []
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
        }
    }
})

export const {getloggedUserDetails , logOutUser, updateProfilePicture} = UserStateSlice.actions ; 
export default UserStateSlice.reducer ;