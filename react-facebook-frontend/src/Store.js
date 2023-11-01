import { configureStore } from "@reduxjs/toolkit";
import UserStateSlice from "./components/UserStateSlice";
import jwtDecode from "jwt-decode";

// Retrieve the token from local storage
const token = localStorage.getItem("token");


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
} else {
  // If no token is found, configure the store with the default state
  store = configureStore({
    reducer: {
      LoggedUser: UserStateSlice 
    },
  });
} 


export { store };
