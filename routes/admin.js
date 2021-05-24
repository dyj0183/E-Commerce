const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product, GET method
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product, POST method
router.post('/add-product', adminController.postAddProduct);

// we already put 'admin' in the app.js, so only need 'products' here
// /admin/products, GET method
router.get('/products', adminController.getProducts);

// /admin/edit-product, GET method
router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/edit-product, POST method
router.post('/edit-product', adminController.postEditProduct);

// /admin/delete-product, POST method
router.post('/delete-product', adminController.postDeleteProduct);

// export this back to the app.js
module.exports = router;