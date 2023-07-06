import express from "express";
const router = express.Router();
import home from "../controllers/homeController.js";
import {
  signupForm,
  createNewAccount,
  loginForm,
  confirmAccount,
  editProfileForm,
  editProfile,
  changePasswordForm,
  changePassword,
  profilePhotoForm,
  uploadPicture,
  uploadProfilePicture
} from "../controllers/userController.js";
import {authController, logOut} from "../controllers/authController.js";
import {
  partyController,
  createParty,
  uploadPartyImage,
  partyEditForm,
  editParty,
  editPartyImage,
  editPartiesImage,
  partyDeleteForm,
  deleteParty,
} from "../controllers/partyController.js";
import {
  groupController,
  createGroup,
  uploadImage,
  groupEditForm,
  editGroup,
  editGroupImage,
  editImage,
  groupDeleteForm,
  deleteGroup,
} from "../controllers/groupController.js";
import adminPanel from "../controllers/adminController.js";
import authUser from "../controllers/authUser.js";
import {showParty, confirmAssistance, showAttendees, showCategory} from '../controllers/frontend/partyseekerController.js';
import {showUser} from '../controllers/frontend/usersController.js';
import {showGroup} from '../controllers/frontend/groupsController.js';
import {addComment, deleteComment} from '../controllers/frontend/commentsController.js';


const routes = () => {

  /* Public */
  router.get("/", home);
  // Show a Party
  router.get('/party/:slug', showParty);
  // Confirm party assistance
  router.post('/confirm-assistance/:slug', confirmAssistance);
  // Show attendees.
  router.get('/assistants/:slug', showAttendees);
  // Comments
  router.post('/party/:id', addComment);
  // Delete Comment
  router.post('/delete-comment', deleteComment);
  // Show user profile
  router.get('/users/:id', showUser);
  // Show profile group
  router.get('/groups/:id', showGroup);
  // Show Parties by Category
  router.get('/category/:category', showCategory);
  // Create and confirm account
  router.get("/signup", signupForm);
  router.post("/signup", createNewAccount);
  router.get("/account-confirmation/:email", confirmAccount);
  // Log in
  router.get("/login", loginForm);
  router.post("/login", authController);
  // Log out
  router.get("/logout", authUser, logOut);


  /* Private */
  // Administration panel
  router.get("/admin", authUser, adminPanel);
  // New Group
  router.get("/new-group", authUser, groupController);
  router.post("/new-group", authUser, uploadImage, createGroup, groupController);
  // Edit Groups
  router.get("/edit-group/:groupId", authUser, groupEditForm);
  router.post("/edit-group/:groupId", authUser, editGroup);
  // Edit the image of the group
  router.get("/group-image/:groupId", authUser, editGroupImage);
  router.post("/group-image/:groupId", authUser, uploadImage, editImage);
  // Delete Groups
  router.get("/delete-group/:groupId", authUser, groupDeleteForm);
  router.post("/delete-group/:groupId", authUser, deleteGroup);
  // New Party
  router.get("/new-party", authUser, partyController);
  router.post("/new-party", authUser, uploadPartyImage, createParty);
  // Edit Party
  router.get("/edit-party/:id", authUser, partyEditForm);
  router.post("/edit-party/:id", authUser, editParty);
    // Edit the Party Picture
  router.get("/party-image/:id", authUser, editPartyImage);
  router.post("/party-image/:id", authUser, uploadPartyImage, editPartiesImage);
  // Delete Party
  router.get("/delete-party/:id", authUser, partyDeleteForm);
  router.post("/delete-party/:id", authUser, deleteParty);
  // Edit Profile
  router.get("/edit-profile", authUser, editProfileForm);
  router.post("/edit-profile", authUser, editProfile);
  // Change Password
  router.get("/change-password", authUser, changePasswordForm);
  router.post("/change-password", authUser, changePassword);
  // Profile Picture
  router.get("/profile-picture", authUser, profilePhotoForm);
  router.post("/profile-picture", authUser, uploadPicture, uploadProfilePicture);





  return router;
};

export default routes;
