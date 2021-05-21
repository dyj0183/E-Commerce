const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (req, res, next) => {
    const products = adminData.products;
    res.render('shop', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
    })
    //res.sendFile(path.join(rootDir, 'views', 'shop.html')); // __dirname points to the folder we are working on
});

// module.exports = router;
exports.routes = router;

