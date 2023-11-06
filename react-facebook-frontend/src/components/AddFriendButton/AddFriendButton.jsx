import React from 'react';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddFriendButton = ({onClick, requestSent, buttonText}) => {
  // console.log(requestSent)
  return (
    <Button
        onClick={onClick}
      variant="contained"
      color="primary"
      startIcon={<PersonAddIcon />}
      style={{
        backgroundColor: '#1877f2', // Facebook Add Friend button blue color
        color: 'white',
        borderRadius: 5, 
        textTransform: 'none', // Prevents uppercase text
        fontWeight: 'bold',
        padding: '5px 16px', // Adjust padding as needed
      }}
    >
      {/* {requestSent ? 'Request sent':'Add Friend'} */}
      {buttonText}
    </Button>
  );
};

export default AddFriendButton;
