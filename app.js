const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); // set up the template engine ejs
app.set('views', 'views'); // let the program know where to find the templates

// this will parse the request data, and call next() 
app.use(express.urlencoded({
    extended: false
}));
//register a static folder, so that we can use the css files directly from HTML pages in our public folder 
app.use(express.static(path.join(__dirname, 'public')));

// get the user's info by id
app.use((req, res, next) => {
    User.findById('60ac37d0abf58564b0e8ef4e')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); // only routes that start with /admin will go into the adminRoutes
app.use(shopRoutes);

// handle 404 page and wrong url
app.use('/', errorController.get404Error)

mongoose.connect('mongodb+srv://Jamal:123456abc@cluster0.sqve2.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        // return the first user back
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Jamal',
                    email: 'jamal@gmail.com',
                    cart: {
                        items: []
                    }
                })
                user.save(); // this save method is provided by mongoose, we didn't write it
            }
        });

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