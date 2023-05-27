import express from "express";
const router = express.Router();
import home from "../controllers/homeController.js";
import {
  signupForm,
  createNewAccount,
  loginForm,
  confirmAccount,
} from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import {
  groupController,
  createGroup,
  uploadImage,
  groupEditForm,
  editGroup,
  editGroupImage,
  editImage,
  groupDeleteForm,
  deleteGroup
} from "../controllers/groupController.js";
import adminPanel from "../controllers/adminController.js";
import authUser from "../controllers/authUser.js";

const routes = () => {
  router.get("/", home);

  // Create and confirm account
  router.get("/signup", signupForm);
  router.post("/signup", createNewAccount);
  router.get("/account-confirmation/:email", confirmAccount);

  // Log in
  router.get("/login", loginForm);
  router.post("/login", authController);

  // Administration panel
  router.get("/admin", authUser, adminPanel);

  // New Group
  router.get("/newgroup", authUser, groupController);
  router.post("/newgroup", authUser, uploadImage, createGroup, groupController);

  // Edit Groups
  router.get("/edit-group/:groupId", authUser, groupEditForm);
  router.post("/edit-group/:groupId", authUser, editGroup);
  // Edit the image of the group
  router.get("/group-image/:groupId", authUser, editGroupImage);
  router.post("/group-image/:groupId", authUser, uploadImage, editImage);
  // Delete Groups
  router.get("/delete-group/:groupId", authUser, groupDeleteForm);
  router.post("/delete-group/:groupId", authUser, deleteGroup);



  return router;
};

export default routes;
