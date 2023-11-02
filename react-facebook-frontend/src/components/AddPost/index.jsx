import React, { useState } from "react";
import axios from "axios";
import { urls } from "../../urls";
import {
  Avatar,
  Box,
  Fab,
  Modal,
  TextField,
  Tooltip,
  Typography,
  styled,
  Stack,
  ButtonGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  EmojiEmotions,
  Image,
  PersonAdd,
  VideoCameraBack,
} from "@mui/icons-material";

import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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

function AddPost({
  userState,
  onPostAdded,
  onEditClick,
  setOnEditClick,
  selectedPost,
  setSelectedPost,
}) {

  const selector = useSelector((state)=> state.LoggedUser.user) ; 
  const profilePicture = useSelector((state) => state.LoggedUser.user.profilePicture);

  // console.log(profilePicture)
  // console.log(selector.user.profilePicture)
  
  const [postContent, setPostContent] = useState(
    selectedPost.data ? selectedPost.data.postcontent : ""
  );
  
  // State for managing emoji picker visibility and selected emoji
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  //console.log(selectedEmoji.emoji)
  //  error message manging state
  const [errorMessage, setErrorMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [postimageUrl, setPostImageUrl] = useState(null); // State to store the URL of the selected image
  const [loading, setLoading] = useState(false);
  //console.log(selectedImage, "addpost")
  // Function to handle emoji selection
  const handleEmojiSelect = (emoji) => {
    console.log("Selected Emoji:", emoji);
    setSelectedEmoji(emoji);
    //setEmojiPickerOpen(false); // Close the emoji picker after selection
  };

  //image upload
  const handleImageUpload = (file) => {
    setSelectedImage(file);
    // Display the selected image in the TextField
    const reader = new FileReader();
    reader.onload = (e) => {
      setPostImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (selectedImage) {
      data.append("image", selectedImage);
    }
    console.log(postContent);

    //const postContent = data.get("standard-multiline-static");
    const postDetails = {
      postcontent: postContent,
      postimageUrl: postimageUrl && postimageUrl,
    };
    console.log(postDetails);
    const userId = selector.user.id;
    setLoading(true);

    if (selectedPost.length == 0) {
      axios
        .post(`${urls.createpost}/` + userId, postDetails, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("Post successfully created!");
          console.log("Response data:", res);
          setOpen(false);
          setOnEditClick(false);
          onPostAdded();
          //navigate("/", { replace: true });
        })
        .catch((error) => {
          console.log(error, "error msg");
          setErrorMessage(error.response.data.error);
        })
        .finally(() => setLoading(false));
    } else {
      const postId = selectedPost.data._id;
      axios
        .patch(
          `${urls.updatePostContent}?userId=${selector.user.id}&postId=${postId}`,
          { postDetails: postDetails }
        )
        .then((res) => {
          console.log("Post successfully updated!");
          console.log("updated Response data:", res);

          setOnEditClick(false);
          // Trigger the onPostAdded callback to update Feed component
          onPostAdded();
          //navigate("/", { replace: true });
          setSelectedPost([]);
        })
        .catch((error) => {
          console.log(error, "error msg");
          setErrorMessage(error.response.data.error);
        })
        .finally(() => setLoading(false));
    }
  };
  const defaultProfilePicture = 'https://example.com/default-profile-picture.jpg' ;
  return (
    <>
      <Tooltip
        onClick={(e) => {
          setPostContent(null);
          setOpen(true);
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
        open={open || onEditClick}
        onClose={(e) => {
          setOpen(false);
          setOnEditClick(false);
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
              src={selector.user.profilePicture === defaultProfilePicture ? profilePicture :  selector.user.profilePicture }  
              alt=""
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="span">{selector.user.username}</Typography>
          </UserBox>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              sx={{ width: "100%" }}
              label="What's on your mind"
              value={postContent ? postContent : ""}
              multiline
              rows={3}
              placeholder="Default Value"
              variant="standard"
              onChange={(e) => {
                setPostContent(e.target.value);
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
            <EmojiEmotions
              color="primary"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)} // Toggle emoji picker visibility
            />
            <label htmlFor="image-upload" onClick={() => setErrorMessage(null)}>
              <Image color="secondary" sx={{ cursor: "pointer" }} />
            </label>

            <VideoCameraBack color="success" />
            <PersonAdd color="error" />
          </Stack>
          {/* Emoji picker */}
          {emojiPickerOpen && <EmojiPicker onEmojiClick={handleEmojiSelect} />}

          <ButtonGroup
            fullWidth
            disableElevation
            variant="contained"
            aria-label="Disabled elevation buttons"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Button type="submit">Post</Button>
            )}
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
    </>
  );
}

export default AddPost;
