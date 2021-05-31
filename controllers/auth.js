const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// set up the email transporter
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    // if we console.log req.flash('error'), we can see that it is an empty array
    // so we need to assign it to null in order for our CSS to work on the login page
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login Page',
        errorMessage: message,
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup Page',
        errorMessage: message,
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
                req.flash('error', 'Invalid Email'); // set up the key value pair
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
                    req.flash('error', 'Invalid Password');
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
                req.flash('error', 'E-Mail already exists, please use a different one.');
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
                    // after saving a new user successfully, we will send out an email
                    return transporter.sendMail({
                        to: email,
                        from: 'sami.dessertstore@gmail.com',
                        subject: 'Signup succeeded!',
                        html: '<h1>You successfully signed up! Log back in & Start shopping for your favorite desserts!!</h1>'
                    })
                })
                .catch(err => {
                    console.log(err);
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

exports.getResetPassword = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password',
        errorMessage: message,
    });
}

exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'No account found with that email');
                return res.redirect('/reset-password');
            }

            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // one hour
            return user.save();

        })
        .then(result => {
            // codes come in here means that successfully save the new token and expiration date to the user

            res.redirect('/');
            transporter.sendMail({
                to: email,
                from: 'sami.dessertstore@gmail.com',
                subject: 'Password Reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:5000/reset/${token}>link</a> to set a new password.</p>
                `
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
}