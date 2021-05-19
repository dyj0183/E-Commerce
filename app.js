const path = require('path');

const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// this will parse the request data, and call next() 
app.use(express.urlencoded({ extended: false}));

app.use('/admin', adminRoutes); // only routes that start with /admin will go into the adminRoutes
app.use(shopRoutes);

// handle 404 page and wrong url
app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(3000);