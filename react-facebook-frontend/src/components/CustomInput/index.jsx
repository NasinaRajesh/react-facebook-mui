import React from 'react';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import './index' ;
const StyledInput = styled(Input)(
  ({theme}) => ({
    border:'2px solid black', 
    borderRadius : '50px',
    
    '&:hover': {
      border:'2px solid black', 
      borderRadius : '50px',
      
    },
    '&:focus': {
     outline:'none ',
     borderBottom: 'none',
    },
  })
)

const CustomInput = ({onChange, inputValue}) => {
  const handleInputChange = (event) => {
    onChange(event.target.value)
  }
  return (
    <Input fullWidth
      className='test '
      placeholder="Aa"
      value={inputValue}
      onChange={handleInputChange}
      // endAdornment={
      //   <InputAdornment position="end">
      //     <IconButton>
      //       <SearchIcon />
      //     </IconButton>
      //   </InputAdornment>
      // }
      // Add other props as needed
    />
  );
};

export default CustomInput;