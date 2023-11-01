const server = "http://localhost:3002/users" ; 

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
    getFriends : `${server}/get-friends`
}