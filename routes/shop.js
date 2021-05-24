const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProductList);

router.get('/product-list/:productId', shopController.getOneProduct);

router.post('/cart', shopController.postCart);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);



// export the router back to app.js
module.exports = router;


