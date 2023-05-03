import express from 'express';
const router = express.Router();

const routes = () => {
    router.get('/', (req, res) => {
        res.render('home', {
            pageTitle: 'Home Page'
        })
    });

    router.get('/signup', (req, res) => {
        res.render('signup', {
            pageTitle: 'Sign Up',
        })
    });


    return router;
}

export default routes;