const Product = require('../models/product'); // import the Product class from models 

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin Add-Product',
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {
    // instantiate a new product object, we set id to null otherwise it would go into update product if statement in the Product model
    // left side is from the Product Schema, right side is the data from req.body
    const product = new Product({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description
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
    Product.find() // this find method is provided by mongoose
    .then(products => {
        res.render('admin/products', {
            products: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
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
            product: product
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

    Product.findById(productId)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
     
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId)
    .then(() => {
        console.log('Delete product successfully');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}