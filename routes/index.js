import express from 'express';
const router = express.Router();


import home from '../controllers/homeController.js';
import { signupForm, createNewAccount, loginForm} from '../controllers/userController.js';

const routes = () => {

    router.get('/', home);

    router.get('/signup', signupForm);
    router.post('/signup', createNewAccount);

    router.get('/login', loginForm);

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