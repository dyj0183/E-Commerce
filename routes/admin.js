const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const productsController = require('../controllers/products');

const router = express.Router();


// /admin/add-product, GET method
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product, POST method
router.post('/add-product', productsController.postAddProduct);

// export this back to the app.js
module.exports = router;