import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import UserStateSlice from "./components/UserStateSlice";
import jwtDecode from "jwt-decode";
import cookieMiddleware from "./cookieMiddleware";

// Retrieve the token from local storage
const token = localStorage.getItem("token");
const auth0user = JSON.parse(localStorage.getItem("auth0user"));
let store;

if (token) {
  try {
    // Decode the token and get user details
    const decodedToken = jwtDecode(token);

    // Assuming decodedToken contains user details like username, email, etc.
    const preloadedState = {
      LoggedUser: {
        user: decodedToken,
      },
    };

    // When configuring your store, initialize it with the preloaded state
    store = configureStore({
      reducer: {
        LoggedUser: UserStateSlice,
      },
      preloadedState,
    });
  } catch (error) {
    console.error('Error decoding the token:', error);
  }
// } else if (auth0user) {
//   try {
//     // When configuring your store, initialize it with the preloaded state
//     store = configureStore({
//       reducer: {
//         LoggedUser: UserStateSlice,
//       },
//       preloadedState: {
//         LoggedUser: {
//           auth0user: auth0user,
//         },
//       },
//     });
//   } catch (error) {
//     console.error('Error while updating the auth0user to redux-store', error);
//   } 
} else {
  // If no token is found, configure the store with the default state
  store = configureStore({
    reducer: {
      LoggedUser: UserStateSlice,
    },
   // middleware : [...getDefaultMiddleware(), cookieMiddleware] 
  });
}

export { store };
