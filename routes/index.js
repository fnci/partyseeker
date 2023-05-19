import express from 'express';
const router = express.Router();
import home from '../controllers/homeController.js';
import { signupForm, createNewAccount, loginForm, confirmAccount} from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import {groupController, createGroup} from '../controllers/groupController.js';
import adminPanel from '../controllers/adminController.js';
import authUser from '../controllers/authUser.js';


const routes = () => {

    router.get('/', home);

    // Create and confirm account
    router.get('/signup', signupForm);
    router.post('/signup', createNewAccount);
    router.get('/account-confirmation/:email', confirmAccount);

    // Log in
    router.get('/login', loginForm);
    router.post('/login', authController);

    // Administration panel
    router.get('/admin',
    authUser,
    adminPanel);

    // New Group
    router.get('/newgroup',
    authUser,
    groupController);

    router.post('/newgroup',
    createGroup,
    groupController);

    return router;
}

export default routes;