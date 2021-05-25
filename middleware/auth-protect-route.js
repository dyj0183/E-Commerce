module.exports = (req, res, next) => {
    // we want to prevent users from accessing some of our pages simply by typing the url(routes) without even logging in
    if (!req.session.isLoggedIn) {
        // isLoggedIn is only true after a user login successfully (in our controller auth.js's postLogin)
        return res.redirect('/login');
    }
    // if the user logged in already, we want to call next() to allow the middleware to travel to the next one
    next();
}