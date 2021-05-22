const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/product-list', shopController.getProductList);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

// export the router back to app.js
module.exports = router;


