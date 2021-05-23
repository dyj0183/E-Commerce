const Product = require('../models/product'); // import the Product class from models 

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {

        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop Index',
            path: '/' // the path here is used to help users know which page they are viewing (the active class we set up)
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

exports.getOneProduct = (req, res, next) => {
    const productId = req.params.productId // we can get the ID from "productId" cause we set up the name in the shop routes
    Product.findById(productId, product => {

        console.log(product);

        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Shop Product Detail',
            path: '/product-list'
        })
    });
}

exports.postCart = (req, res, next) => {
    console.log(req.body.productId);
    // res.render('shop/cart', {
    //     pageTitle: 'Shop Cart',
    //     path: '/cart'
    // });
    res.redirect('/');
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Shop Cart',
        path: '/cart'
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Shop Orders',
        path: '/orders'
    });
}