import Users from '../models/users.js';

export const signupForm = (req, res) => {
    res.render('signup', {
        pageTitle: 'SignUp',
    });
};

export const createNewAccount = async (req, res) => {
    const user = req.body;

    try {

        await Users.create(user);

        // Flash Message & redirect
        req.flash('success', 'We send you an email to validate your account');
        res.redirect('/login');
    } catch (error) {
        const sequelizeError = error.errors.map(err => err.message);
        const errorsList = [...sequelizeError];
        req.flash('error', errorsList);
        res.redirect('/signup');
    }

}

export const loginForm = (req, res) => {
    res.render('login', {
        pageTitle: 'LogIn',
    });
};


export default {signupForm, createNewAccount, loginForm};