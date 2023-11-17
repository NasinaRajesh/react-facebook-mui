import { React, useState } from "react";
import {
  Box,
  Tooltip,
  Fab,
  styled,
  Modal,
  CircularProgress,
  Button,
  ButtonGroup,
  Stack,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth0 } from "@auth0/auth0-react";
import {
  EmojiEmotions,
  Image,
  PersonAdd,
  VideoCameraBack,
} from "@mui/icons-material";
import { auth0urls } from "../../../urls";
import axios from "axios";
import CustomSnackbar from "../../CustomSnackbar";
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
function AuthAddPost({
  onPostAdded,
  openModal,
  setOpenModal,
  selectedPost,
  setSelectedPost,
}) {
  // console.log("selectedPost: ", selectedPost, openModal);
  const [open, setOpen] = useState(false);
  //const [selectedImage, setSelectedImage] = useState(null);
  const [postimageUrl, setPostImageUrl] = useState(""); // State to store the URL of the selected image
  //  console.log(postContent)
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [errorMessage, setErrorMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleImageUpload = (file) => {
    //setSelectedImage(file);
    // Display the selected image in the TextField
    const reader = new FileReader();
    reader.onload = (e) => {
      setPostImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const updatePost = (postDetails) => {
    const postId = selectedPost.postId;
    //console.log("updated post content function is called")
    axios
      .patch(`${auth0urls.updatePost}?emailId=${user.email}&postId=${postId}`, {
        postDetails: postDetails,
      })
      .then((res) => {
        console.log("Post successfully updated!");
        console.log("updated Response data:", res.data.message);
        setSnackbarSeverity("success");
        setSnackbarMessage(res.data.message);
        setSnackbarOpen(true);
        setOpenModal(false);
        // Trigger the onPostAdded callback to update Feed component
        onPostAdded();
        //navigate("/", { replace: true });
        setSelectedPost({ postcontent: "" });
      })
      .catch((error) => {
        console.log(error, "error msg");
        setErrorMessage(error.response.data.error);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.response.data.error);
        setSnackbarOpen(true);
      });
  };
  
  const createPost = (postDetails)=>{
    axios
        .post(`${auth0urls.createpost}?emailId=${user.email}`, postDetails, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("Post successfully created!");
          console.log("Response data:", res);
          setOpen(false);
          // setOnEditClick(false);
          onPostAdded();
          setSnackbarSeverity("success");
          setSnackbarMessage(res.data.message);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.log(error, "error msg");
          setErrorMessage(error.response.data.error);
          setSnackbarSeverity("error");
          setSnackbarMessage(error.response.data.error);
          setSnackbarOpen(true);
        });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const postDetails = {
      postcontent: selectedPost.postcontent,
      postimageUrl: postimageUrl,
    };
    console.log(postDetails);

    if (openModal && selectedPost.postId) {
      updatePost(postDetails);
    } else {
      createPost(postDetails)
      // .finally(() => setLoading(false));
    }
  };

  return (
    <Box>
      <Tooltip
        onClick={(e) => {
          setOpen(true);
          setPostImageUrl(null);
          setErrorMessage(null);
          setSelectedPost("");
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
        open={open || openModal}
        onClose={(e) => {
          setOpen(false);

          setOpenModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          bgcolor={"background.default"}
          color={"text.primary"}
          width={postimageUrl ? "450px" : "400px"}
          height={postimageUrl ? "580px" : "322px"}
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
              src={isAuthenticated && user.picture}
              alt={isAuthenticated && user.name}
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="span">
              {isAuthenticated && user.name}
            </Typography>
          </UserBox>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              sx={{ width: "100%" }}
              label="What's on your mind"
              value={selectedPost.postcontent}
              multiline
              rows={3}
              placeholder="Default Value"
              variant="standard"
              onChange={(e) => {
                setSelectedPost((prevSelectedPost) => ({
                  ...prevSelectedPost,
                  postcontent: e.target.value,
                }));
                setErrorMessage(null);
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
            <EmojiEmotions color="primary" />
            <label htmlFor="image-upload" onClick={() => setErrorMessage(null)}>
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
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {errorMessage}
          </Typography>
        </Box>
      </StyledModal>

      {/* custom snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default AuthAddPost;
