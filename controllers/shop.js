const Product = require('../models/product'); // import the Product class from models 
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/index', {
            products: products,
            pageTitle: 'Shop Index',
            path: '/' // the path here is used to help users know which page they are viewing (the active class we set up)
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProductList = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'Shop Product List',
            path: '/product-list'
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getOneProduct = (req, res, next) => {
    const productId = req.params.productId // we can get the ID from "productId" cause we set up the name in the shop routes
    Product.findById(productId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Shop Product Detail',
            path: '/product-list'
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price); // using the static method in Cart
    });
    console.log(req.body.productId);
    // res.render('shop/cart', {
    //     pageTitle: 'Shop Cart',
    //     path: '/cart'
    // });
    res.redirect('/cart');
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }

            res.render('shop/cart', {
                pageTitle: 'Shop Cart',
                path: '/cart',
                cart: cart,
                combinedProducts: cartProducts
            });
        })
    })
}

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Shop Orders',
        path: '/orders'
    });
}

