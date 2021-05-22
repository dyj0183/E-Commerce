const Product = require('../models/product'); // import the Product class from models 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin Add-Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title, req.body.imageUrl, req.body.price, req.body.description); // instantiate a new product object
    product.save();
    // products.push({
    //     title: req.body.title
    // });
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products'
    })
}

exports.getEditProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Admin Edit Product',
        path: '/admin/edit-product'
    })
}
