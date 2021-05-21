const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const productsController = require('../controllers/products');

router.get('/', productsController.getProducts);

// export the router back to app.js
module.exports = router;


