// save all the products logic here whether it is for admin or shop

const Product = require('../models/product'); // import the Product class from models 

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add-Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {

    const product = new Product(req.body.title); // instantiate a new product object
    product.save();
    // products.push({
    //     title: req.body.title
    // });
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();
    
    res.render('shop', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
    })
}