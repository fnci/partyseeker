import Users from '../models/users.js';

export const signupForm = (req, res) => {
    res.render('signup', {
        pageTitle: 'Sign Up',
    });
};

export const createNewAccount = async (req, res) => {
    const user = req.body;

    const newUser = await Users.create(user);


    // Flash Message & redirect
    console.log("User Created", newUser);
}


export default {signupForm, createNewAccount};