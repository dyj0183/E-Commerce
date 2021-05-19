const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// this will parse the request data, and call next() 
app.use(express.urlencoded({ extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);