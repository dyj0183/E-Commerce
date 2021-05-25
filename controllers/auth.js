const bcrypt = require('bcryptjs');

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
    const email = req.body.email;
    const password = req.body.password;

    // find the user by email
    User.findOne({
            email: email
        })
        .then(user => {
            // if we can't find the user by email, return back to the login page
            if (!user) {
                return res.redirect('/login');
            }

            // validate the password
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    // result will be a boolean, returns "true" if match, returns "flase" if doesn't match
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        // make sure we save all the session data into our database before we redirect, otherwise we might see somthing missing on the page
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    // password doesn't match, return back to login page
                    res.redirect('login');
                }) // both math and not match would go into .then()
                .catch(err => {
                    // fail to login by comparing password
                    console.log(err);
                    redirect('/login');
                })
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({
            email: email
        })
        .then(userDoc => {
            // if this is true, means email already exists in the database, can't create another new user with same email
            if (userDoc) {
                // redirect back to the signup page
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12) // this is async code, so we need to use a then which is below
                .then(hashedPassword => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                })
                // this "then" will happen after "user.save()" is done
                .then(result => {
                    // after we are done saving the new user's data, redirect to the login page
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    // destroy the session in the database
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};