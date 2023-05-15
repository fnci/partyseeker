import passport from "passport";
import LocalStrategy from "passport-local";
import Users from "../models/users.js";

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
},
    async (email, password, next) => {
        // execute this code after fill form
        const user = await Users.findOne({ where: { email, active: 1 } });

        // check existing user if not
        if(!user) return next(null, false, {
            message: 'User not found'
        });
        // check if user already exists
        const verifyUser = user.validatePassword(password);
        // if password doesn't exist
        if(!verifyUser) return next(null, false, {
            message: 'Incorrect Password'
        });
        // if password is valid
        return next(null, user);

    }
))


// How we can store the user in the session
passport.serializeUser((user, cb) => {
    cb(null, user);
});
// How we get the user out of the session
passport.deserializeUser((user, cb) => {
    cb(null, user);
});



export default passport;