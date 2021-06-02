const { validationResult } = require('express-validator/check');

const Product = require('../models/product'); // import the Product class from models 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin Add Product',
        path: '/admin/add-product',
        hasError: false,
        product: {},
        errorMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/add-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    // instantiate a new product object, we set id to null otherwise it would go into update product if statement in the Product model
    // left side is from the Product Schema, right side is the data from req.body
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user._id
    });

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
    // this find() method is provided by mongoose
    Product.find({
            userId: req.user._id // authorization: we only want to display the products created by this specific user
        })
        //.populate('userId'), we can use this to grab all the user's data based on the userId, very neat tech!
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                username: req.session.user.name
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                console.log("sorry, no product found for editing.");
                res.redirect('/');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Admin Edit Product',
                path: '/admin/edit-product',
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id: productId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(productId)
        .then(product => {
            // make sure only the user who created the product can edit it
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }

            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;

            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    // we need to make sure the product id is matched, and also only the user who created the product can delete it
    Product.deleteOne({
            _id: productId,
            userId: req.user._id
        })
        .then(() => {
            console.log('Delete product successfully');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}