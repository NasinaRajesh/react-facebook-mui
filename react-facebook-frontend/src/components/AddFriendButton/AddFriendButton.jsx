import React from 'react';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PersonRemove } from '@mui/icons-material';

const AddFriendButton = ({onClick, requestSent, buttonText}) => {
  // console.log(requestSent)
  console.log(buttonText, requestSent)
  return (
    <Button
        onClick={onClick}
      variant="contained"
      color="primary"
      startIcon={requestSent ? <PersonRemove/> :<PersonAddIcon />}
      style={{
        backgroundColor: '#1877f2', // Facebook Add Friend button blue color
        color: 'white',
        borderRadius: 5, 
        textTransform: 'none', // Prevents uppercase text
        fontWeight: 'bold',
        padding: '5px 16px', 
      }}
    >
      {/* {requestSent ? 'Request sent':'Add Friend'} */}
      {buttonText}
    </Button>
  );
};

export default AddFriendButton;
