import {React, useState} from 'react' ;
import {Box, Tooltip, Fab, styled, Modal, CircularProgress, Button, ButtonGroup, Stack, TextField,Typography,Avatar} from '@mui/material' ;
import AddIcon from "@mui/icons-material/Add";
import {
    EmojiEmotions,
    Image,
    PersonAdd,
    VideoCameraBack,
  } from "@mui/icons-material";

const StyledModal = styled(Modal)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  const UserBox = styled(Box)({
    display: "flex",
    gap: "5px",
    alignItems: "center",
    marginBottom: "20px",
  });
function AuthAddPost(){
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [postimageUrl, setPostImageUrl] = useState(null); // State to store the URL of the selected image
    const [postcontent, setPostContent] = useState('')

    const handleImageUpload = (file) => {
        setSelectedImage(file);
        // Display the selected image in the TextField
        const reader = new FileReader();
        reader.onload = (e) => {
          setPostImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      };

    const handleSubmit = (e)=> {
        e.preventDefault() ;
        const postDetails = {
            postcontent : postcontent ,
            postimageUrl : postimageUrl
        }
        console.log(postDetails)
    }

    return(
        <Box>
        <Tooltip
        onClick={(e) => {
          setOpen(true)
        }}
        title="create a new post"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 20px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="Addpost">
          <AddIcon />
        </Fab>
      </Tooltip>

      <StyledModal
        open={open }
        onClose={(e) => {
          setOpen(false);
          
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
         bgcolor={"background.default"}
         color={"text.primary"}
          width={postimageUrl ? "450px" : "400px"}
          height={postimageUrl ? "580px" : "320px"}
          p={3}
          mt={2}
          borderRadius={5}
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Typography
            variant="h6"
            component="h6"
            textAlign={"center"}
            color={"gray"}
          >
            create post
          </Typography>

          <UserBox>  
            <Avatar
              src=""  
              alt=""
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="span">Rajesh</Typography>
          </UserBox>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              sx={{ width: "100%" }}
              label="What's on your mind"
              //value={postContent ? postContent : ""}
              multiline
              rows={3}
              placeholder="Default Value"
              variant="standard"
              onChange={(e) => {
                setPostContent(e.target.value);
            
              }}
            />
            {postimageUrl && (
              <img
                src={postimageUrl}
                alt="Selected Image"
                style={{
                  // margin:'auto',
                  maxWidth: "200px",
                  maxHeight: "250px",
                  minHeight: "250px",
                  minWidth: "200px",
                }}
              />
            )}
          </Box>
          <input
            type="file"
            accept=".jpg, .png, .jpeg"
            id="image-upload"
            name="image"
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          <Stack
            direction="row"
            gap={1}
            mt={2}
            mb={3}
            sx={{ cursor: "pointer" }}
          >
            <EmojiEmotions
              color="primary"
              />            
            <label htmlFor="image-upload" >
              <Image color="secondary" sx={{ cursor: "pointer" }} />
            </label>

            <VideoCameraBack color="success" />
            <PersonAdd color="error" />
          </Stack>
          {/* Emoji picker */}
         

          <ButtonGroup
            fullWidth
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
            style={{ display: "flex", justifyContent: "center" }}
          >
          
              <Button type="submit">Post</Button>
        
          </ButtonGroup>
          {/* <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {errorMessage}
          </Typography> */}
        </Box>
      </StyledModal>


</Box>
      
    )
    
}


export default AuthAddPost ;