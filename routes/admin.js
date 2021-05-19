const path = require('path');

const express = require('express');

const router = express.Router();

// /admin/add-product, GET method
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
})

// /admin/add-product, POST method
router.post('/add-product', (req, res, next) => {
  
    console.log(req.body);
    res.redirect('/');
   
    console.log("This is my product page");
});

module.exports = router;