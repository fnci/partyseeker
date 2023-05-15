import passport from "passport";
const authController = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required',
})

export default authController;