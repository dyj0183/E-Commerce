const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // import this to work with session
const MongoDBStore = require('connect-mongodb-session')(session); // use to store session in the mongodb database
const csrf = require('csurf'); // we use csrf token to make all the user requests more secure

// routes we work with
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const csrfProtection = csrf();

const app = express();

const MONGODB_URI = 'mongodb+srv://Jamal:123456abc@cluster0.sqve2.mongodb.net/shop';
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs'); // set up the template engine ejs
app.set('views', 'views'); // let the program know where to find the templates

// this will parse the request data, and call next() 
app.use(express.urlencoded({
    extended: false
}));
//register a static folder, so that we can use the css files directly from HTML pages in our public folder 
app.use(express.static(path.join(__dirname, 'public')));

// set up the session
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// use the csrf
app.use(csrfProtection);

// get the user's info by id
app.use((req, res, next) => {
    // we need to check here cause if the user doesn't login, then no session yet, so we would get error
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            // we still want to use the user returned by "mongoose" when it is logged it, so that we can call all the methods of the "user object"
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

/************************************************************************************** 
 * instead of having the same codes in all the controllers to render to all the pages,
 * we can simply render these data here to all the pages
 * I need to go to all the views and if there is a form, I need to add this line
 * <input type="hidden" name="_csrf" value="<%= csrfToken %>"> 
 **************************************************************************************/
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes); // only routes that start with /admin will go into the adminRoutes
app.use(shopRoutes);
app.use(authRoutes);

// handle 404 page and wrong url
app.use('/', errorController.get404Error)

mongoose.connect('mongodb+srv://Jamal:123456abc@cluster0.sqve2.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        // return the first user back
        // User.findOne().then(user => {
        //     if (!user) {
        //         const user = new User({
        //             name: 'Jamal',
        //             email: 'jamal@gmail.com',
        //             cart: {
        //                 items: []
        //             }
        //         })
        //         user.save(); // this save method is provided by mongoose, we didn't write it
        //     }
        // });

        // must have "process.env.PORT" for heroku to work!!!
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => {
        console.log(err);
    });



// // old approach without using mongoose
// mongoConnect(() => {
//     // must have "process.env.PORT" for heroku to work!!!
//     app.listen(process.env.PORT || 5000);
// });