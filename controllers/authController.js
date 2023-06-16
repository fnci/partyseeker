import passport from "passport";
const authController = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required',
})

// Log out
const logOut = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        else {
        req.flash('success', 'Closed Session');
        };
        res.redirect('/login');
    });
}

export {authController, logOut};