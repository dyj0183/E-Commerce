const Product = require('../models/product'); // import the Product class from models 

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {

        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop Index',
            path: '/'
        })

    });
}

exports.getProductList = (req, res, next) => {
    Product.fetchAll((products) => {

        res.render('shop/product-list', {
            products: products,
            pageTitle: 'Shop Product List',
            path: '/product-list'
        })

    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Shop Cart',
        path: '/cart'
    })
}