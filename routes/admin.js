const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

// variables
const products = [];

// /admin/add-product, GET method
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
})

// /admin/add-product, POST method
router.post('/add-product', (req, res, next) => {
  
    products.push({title: req.body.title});
    //console.log(req.body);
    res.redirect('/');
   
    //console.log("This is my product page");
});

// module.exports = router;
exports.routes = router;
exports.products = products;