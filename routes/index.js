import express from 'express';
const router = express.Router();


import home from '../controllers/homeController.js';
import { signupForm, createNewAccount } from '../controllers/userController.js';

const routes = () => {

    router.get('/', home);
    router.get('/signup', signupForm);

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

    router.post('/signup', createNewAccount)


    return router;
}

export default routes;