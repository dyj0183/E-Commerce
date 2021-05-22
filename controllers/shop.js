const Product = require('../models/product'); // import the Product class from models 

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {

        res.render('shop/product-list', {
            products: products,
            pageTitle: 'product-list',
            path: '/'
        })

    });
}