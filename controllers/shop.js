// const Cart = require('../models/cart');

const Product = require('../models/product'); // import the Product class from models
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find() // method from mongoose
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: "Sami's Store",
                path: '/', // the path here is used to help users know which page they are viewing (the active class we set up)
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProductList = (req, res, next) => {
    Product.find() // method from mongoose
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'Shop Dessert List',
                path: '/product-list',
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
                path: '/product-list',
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                pageTitle: 'Shop Cart',
                path: '/cart',
                combinedProducts: products,
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postCartDeleteItem = (req, res, next) => {
    const productId = req.body.productId;

    req.user.deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    quantity: i.quantity,
                    product: {
                        ...i.productId._doc
                    }
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({
            "user.userId": req.user._id
        })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Shop Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch(err => console.log(err));
};