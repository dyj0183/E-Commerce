const Product = require('../models/product'); // import the Product class from models 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin Add-Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {
    // instantiate a new product object, we set id to null otherwise it would go into update product if statement in the Product model 
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.price, req.body.description); 
    product.save()
    .then(result => {
        console.log('created product successfully');
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    })
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if (!product) {
            console.log("sorry, no product found for editing.");
            return res.redirect('/');
        }

        res.render('admin/edit-product', {
            pageTitle: 'Admin Edit Product',
            path: '/admin/edit-product',
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);

    updatedProduct.save(); // it will check the id first, and then if id already exists, it will update the data in the products

    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);

    res.redirect('/admin/products')
}