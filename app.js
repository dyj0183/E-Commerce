const path = require('path');

const express = require('express');

const adminData = require('./routes/admin');
const shopData = require('./routes/shop');

const app = express();

// this will parse the request data, and call next() 
app.use(express.urlencoded({ extended: false}));
//register a static folder, so that we can use the css files directly from HTML pages in our public folder 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes); // only routes that start with /admin will go into the adminRoutes
app.use(shopData.routes);

// handle 404 page and wrong url
app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(3000);