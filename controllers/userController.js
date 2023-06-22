import Users from '../models/users.js';
import { sendMail } from '../handlers/emails.js';
import multer from 'multer';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Profile Picture
const profilePhotoForm = async(req, res) => {
    const user = await Users.findByPk(req.user.id);
    res.render('profile-picture', {
        pageTitle: 'Upload profile picture',
        user
    });
}
const multerConfig = {
    limits: { fileSize: 10000000 },
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/profiles/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${nanoid(10)}.${extension}`);
        }
    }),
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' | file.mimetype === 'image/jpg'){
            next(null, true);
        }else{
            next(new Error('Invalid file format'), false);
        }
    }
}
const upload = multer(multerConfig).single('image')
// Upload image to the server
const uploadPicture = (req, res, next) => {
    upload(req, res, function (error) {
        if(error){
            if(error instanceof multer.MulterError){

                if(error.code === 'LIMIT_FILE_SIZE'){
                req.flash('error', 'The size file exceeds the limit of 10MB');
                } else {
                req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')){
                req.flash('error', error.message);
            }
            res.redirect('back')
            return;
        }else{
            next();
        }
    });
}
// Save the new image and delete the old one if it exists and save it on the db.
const uploadProfilePicture = async(req, res) => {
    const user = await Users.findByPk(req.user.id);
    // If a picture already exist, delete it.
    if(req.file && user.image){
        const existingImagePath = __dirname + `/../public/uploads/profiles/${user.image}`;
        // Delete file with and async fs method
        fs.unlink(existingImagePath, (err) => {
            if(err){
                console.log(err);
            }
            return;
        })
    }
    // Save the new picture.
    if(req.file){
        user.image = req.file.filename;
    }
    // Save it on the db and redirect.
    await user.save();
    req.flash('success', 'Picture Saved Successfully!');
    res.redirect('/admin');
}

export {signupForm, createNewAccount, loginForm, confirmAccount, editProfileForm, editProfile, changePasswordForm, changePassword, profilePhotoForm, uploadPicture, uploadProfilePicture};