import express from 'express';
const router = express.Router();


import home from '../controllers/homeController.js';
import { signupForm, createNewAccount, loginForm, confirmAccount} from '../controllers/userController.js';
import authController from '../controllers/authController.js';
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

    /* router.get('/login', loginForm); */
/*     router.get('/', (req, res) => {
        res.render('home', {
            pageTitle: 'Home Page'
        })
    }); */
/*     router.get('/signup', (req, res) => {
        res.render('signup', {
            pageTitle: 'Sign Up',
        })
    }); */




    return router;
}

export default routes;