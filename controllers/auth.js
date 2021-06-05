const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {
    validationResult
} = require('express-validator/check');

const User = require('../models/user');

require('dotenv').config({ path: __dirname + '/.env' })

// set up the email transporter
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRIDAPI
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
        oldInput: {
            email: '',
            password: '',
        },
        validationErrors: []
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
        oldInput: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // check the validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(email); // there is a bug in the code cause it is diaplying "@" when I simply clicked on "Login" without entering any input
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: {
            email: email,
            password: password,
        },
        validationErrors: errors.array()
      });
    }

    // find the user by email
    User.findOne({
            email: email
        })
        .then(user => {
            // if we can't find the user by email, return back to the login page
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'User wtih This Email Does Not Exist',
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: []
                });
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
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Password Does Not Match with This Email',
                        oldInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: []
                    });
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

    // receive the "req" from the middleware "check('email') in the auth.js route"
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array() // return the entire error array to help us make invalid border red
        });
    }

    bcrypt.hash(password, 12) // this is async code, so we need to use a then which is below
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

        User.findOne({
                email: email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account found with this email');
                    return res.redirect('/reset-password');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // one hour
                user.save()
                .then(result => {
                    // codes come in here means that successfully save the new token and expiration date to the user
    
                    res.redirect('/');
                    transporter.sendMail({
                        to: email,
                        from: 'sami.dessertstore@gmail.com',
                        subject: 'Password Reset',
                        html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:5000/reset-password/${token}>link</a> to set a new password.</p>
                    `
                    })
                })
            })
            .catch(err => {
                console.log(err);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    // grab the token from the url and check if it matches the one from the user
    // also checks the time to make sure it is still within the 1 hour time frame, $gt means greater than
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {

            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = (req, res, next) => {
    // newPassword, userId, and passwordToken come from "new-password.ejs"
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    // now we need to find the user and reset the password and save
    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        })
        .then(user => {
            // we still need to hash the new password first before we save it back to the user
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            // update the user with new password
            resetUser.password = hashedPassword;
            // after we reset the password, set token back to undefined cause we don't need them anymore at this moment
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            // once we are done with saving new data back to the user, redirect back to login page
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}