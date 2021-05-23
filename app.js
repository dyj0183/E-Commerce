const path = require('path');

const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs'); // set up the template engine ejs
app.set('views', 'views'); // let the program know where to find the templates

// this will parse the request data, and call next() 
app.use(express.urlencoded({ extended: false}));
//register a static folder, so that we can use the css files directly from HTML pages in our public folder 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); // only routes that start with /admin will go into the adminRoutes
app.use(shopRoutes);

// handle 404 page and wrong url
app.use('/', errorController.get404Error)

app.listen(process.env.PORT||5000);

// app.listen(3000);