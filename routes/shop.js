const path = require('path');
const rootDir = require('../util/path');
// we import this to protect our routes by going through authentication
const authRoute = require('../middleware/auth-protect-route');

const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

/**********************************************************
 * we put "auth" in front of all the controller middlewares, 
 * cause the requests travel from left to right, so it will go
 * through authentication first to protect our routes
 ***********************************************************/

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProductList);

router.get('/product-list/:productId', shopController.getOneProduct);

router.post('/cart', authRoute, shopController.postCart);

router.get('/cart', authRoute, shopController.getCart);

router.post('/cart-delete-item', authRoute, shopController.postCartDeleteItem);

router.post('/create-order', authRoute, shopController.postOrder);

router.get('/orders', authRoute, shopController.getOrders);

// export the router back to app.js
module.exports = router;