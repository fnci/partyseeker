import Users from '../models/users.js';
import { sendMail } from '../handlers/emails.js';

export const signupForm = (req, res) => {
    res.render('signup', {
        pageTitle: 'SignUp',
    });
};

export const createNewAccount = async (req, res) => {
    const user = req.body;

    try {
        await Users.create(user);

        // URL confirmation
        const url = `http://${req.headers.host}/account-confirmation/${user.email}`;

        // Send confirmation email
        await sendMail({
            user,
            url,
            subject: 'PartySeeker Account Confirmation',
            file: 'account-confirmation'
        });
        // Flash Message & redirect
        req.flash('success', 'We send you an email to validate your account');
        res.redirect('/login');

    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        /* const errorsList = [...sequelizeError]; */
        req.flash('error', sequelizeError);
        res.redirect('/signup');
    }

}
// Confirm account subscription
export const confirmAccount = async (req, res, next) => {
    // Verify user's account
    const user = await Users.findOne({ where: { email: req.params.email}})
    console.log(`User Info: ${req.params.email}`);
    // If not verified, redirect
    if(!user) {
        req.flash('error', 'User not found');
        res.redirect('/signup');
        return next();
    }
    // Otherwise, confirm subscription and redirect
    user.active = 1;
    await user.save();
    req.flash('success', 'The account has been confirmed successfully.');
    res.redirect('/login');


}



// LogIn form
export const loginForm = (req, res) => {
    res.render('login', {
        pageTitle: 'LogIn',
    });
};


export default {signupForm, createNewAccount, loginForm, confirmAccount};