import Users from '../models/users.js';
import { sendMail } from '../handlers/emails.js';

const signupForm = (req, res) => {
    res.render('signup', {
        pageTitle: 'SignUp',
    });
};

const createNewAccount = async (req, res) => {
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
        req.flash('success', 'We send you an email to validate your account.');
        res.redirect('/login');

    } catch (error) {
        const sequelizeError = error.errors?.map(err => err.message);
        /* const errorsList = [...sequelizeError]; */
        req.flash('error', sequelizeError);
        res.redirect('/signup');
    }

}
// Confirm account subscription
const confirmAccount = async (req, res, next) => {
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
const loginForm = (req, res) => {
    res.render('login', {
        pageTitle: 'LogIn',
    });
};

// Edit profile form
const editProfileForm = async(req, res, next) => {
    const user = await Users.findByPk(req.user.id);
    res.render('edit-profile', {
        pageTitle: 'Edit Profile',
        user
    })
}
// Save on db the changes of the profile
const editProfile = async(req, res) => {
    const user = await Users.findByPk(req.user.id);
    // Read data from the form
    const {name, description, email} = req.body;
    // Assign values
    user.name = name;
    user.description = description;
    user.email = email;
    // Save on db
    await user.save();
    req.flash('success', 'Profile updated successfully.');
    res.redirect('/admin');
}
// Change password form
const changePasswordForm = (req, res) => {
    res.render('change-password', {
        pageTitle: 'Change Password',

    })
}
// Look at the current password before changing it to a new one
const changePassword = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);
    // Verify current password matches
    if(!user.validatePassword(req.body.current)){
        req.flash('error', 'The current password is incorrect.');
        res.redirect('/change-password');
        return next();
    }
    // If the current password is correct hash the new one
    const hash = user.hashPassword(req.body.new);
    // Assign the new password to the user
    user.password = hash;
    // Save it on the db
    await user.save();
    // Redirect to /admin
    req.logout(function(err) {
        if (err) { return next(err); }
        else {
            req.flash('success', 'Password changed successfully, please log in again');
        }
        res.redirect('/login');
    });
}

export {signupForm, createNewAccount, loginForm, confirmAccount, editProfileForm, editProfile, changePasswordForm, changePassword};