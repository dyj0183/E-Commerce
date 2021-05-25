const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login Page',
        isAuthenticated: false // we set this up here to help us identify what pages to display to user based on authentication
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup Page',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('60ac37d0abf58564b0e8ef4e')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // make sure we save all the session data into our database before we redirect, otherwise we might see somthing missing on the page
            req.session.save(err => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
    // destroy the session in the database
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};