import { getAuth0LoggedUser, logOutAuth0User } from "./components/UserStateSlice"; 
import Cookies from 'js-cookie' ;

const cookieMiddleware = (store) => (next) => (action) => {
    if (action.type === getAuth0LoggedUser.type || action.type === logOutAuth0User.type) {
      // Update the cookie when Auth0 user data is set or cleared
      Cookies.set('auth0UserData', JSON.stringify(store.getState().LoggedUser.auth0user), { expires: 1/24}); // To set auth0user data in cookies
    }
  
    return next(action);
  };
  
  export default cookieMiddleware;