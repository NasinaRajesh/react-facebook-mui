import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function MuiConfirmModal({open , handleConfirm, handleClose}) {
 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  
  return (
    <React.Fragment>
      
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
        Are you sure you want to delete?
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText>
          
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button color='error' variant="contained" autoFocus onClick={handleConfirm}>
            Ok
          </Button>
          <Button variant='outlined' color='primary' sx={{textTransform:'none'}} onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}