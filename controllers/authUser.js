const authUser = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}




export default authUser;