import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import { Provider } from 'react-redux';
import { store } from './Store';
import { Auth0Provider } from '@auth0/auth0-react';
import { getAuth0LoggedUser } from './components/UserStateSlice';
import Cookies from 'js-cookie' ;

const persistedUserData = Cookies.get('auth0UserData'); // To get auth0 authenticated user details from browser cookies , 
if(persistedUserData){
  store.dispatch(getAuth0LoggedUser(JSON.parse(persistedUserData))) // if user details in cookies it updated to store under browser re-loads.
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-8c0es5gx0fgv2mbe.us.auth0.com" // Auth0 domain
        clientId="l7fV8opGa96ewyIFXqlhhW3qtlPxfOnf" // Auth0 client ID
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </Provider>

  </React.StrictMode>
);


