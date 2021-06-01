const path = require('path');
const rootDir = require('../util/path');
// we import this to protect our routes by going through authentication
const authRoute = require('../middleware/auth-protect-route');

const express = require('express');
const {
    body
} = require('express-validator/check');

const router = express.Router();

const adminController = require('../controllers/admin');

/**********************************************************
 * we put "auth" in front of all the controller middlewares, 
 * cause the requests travel from left to right, so it will go
 * through authentication first to protect our routes
 ***********************************************************/

// /admin/add-product, GET method
router.get('/add-product', authRoute, adminController.getAddProduct);

// /admin/add-product, POST method
router.post(
    '/add-product',
    [
        body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    authRoute,
    adminController.postAddProduct
);

// we already put 'admin' in the app.js, so only need 'products' here
// /admin/products, GET method
router.get('/products', authRoute, adminController.getProducts);

// /admin/edit-product, GET method
router.get('/edit-product/:productId', authRoute, adminController.getEditProduct);

// /admin/edit-product, POST method
router.post(
    '/edit-product',
    [
        body('title')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description')
        .isLength({
            min: 5,
            max: 400
        })
        .trim()
    ],
    authRoute,
    adminController.postEditProduct
);

// /admin/delete-product, POST method
router.post('/delete-product', authRoute, adminController.postDeleteProduct);

// export this back to the app.js
module.exports = router;