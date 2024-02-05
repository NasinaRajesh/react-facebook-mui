const server = "http://localhost:3002/users" ; 
const auth0server = "http://localhost:3002/auth0user" ;
export const urls = {
    login : `${server}/login` ,
    register : `${server}/register` ,
    createpost : `${server}/create-post` ,
    getposts : `${server}/get-posts` ,
    getpost : `${server}/get-post` ,
    deletepost : `${server}/delete-post` ,
    getprofile : `${server}/get-profile` ,
    updateprofile : `${server}/update-profile`,
    updatePostContent : `${server}/update-post` ,
    deleteAccount :    `${server}/delete-user` ,
    getAllusers :   `${server}/all-users` ,
    addFriend : `${server}/add-friend`, 
    getFriends : `${server}/get-friends` ,
    rejectFriendRequest : `${server}/reject-friend-requests`,
    acceptFriendRequest : `${server}/accept-friend-request` ,
    toggleAddFriendButtonText : `${server}/add-friend-button`,
   
}

export const auth0urls = {
    friendRequests : `${auth0server}/friend-request` ,
    rejectFriendRequest : `${auth0server}/reject-request`,
    acceptFriendRequest : `${auth0server}/accept-request` ,
    createpost : `${auth0server}/create-post`,
    getposts : `${auth0server}/get-posts`,
    deletepost : `${auth0server}/delete-post` ,
    getPost : `${auth0server}/get-post`,
    updatePost : `${auth0server}/update-post` ,
    createAccount : `${auth0server}/create-account`
} 