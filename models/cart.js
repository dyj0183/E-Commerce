// const fs = require('fs');
// const path = require('path');

// const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

// module.exports = class Cart {

//     static addProduct(id, productPrice) {

//         fs.readFile(p, (err, fileContent) => {
//             let cart = {
//                 products: [],
//                 totalPrice: 0
//             };

//             if (!err) {
//                 cart = JSON.parse(fileContent);
//             }

//             // check if the new product we try to add already exist in the "cart object" or not
//             const existingProductIndex = cart.products.findIndex(product => product.id === id); // check if the id matches or not, returns the matched product's "Index"
//             const existingProduct = cart.products[existingProductIndex];

//             // create a new product variable
//             let updatedProduct;
//             // if product already exists, then we want to increase the quantity
//             if (existingProduct) {
//                 updatedProduct = {
//                     ...existingProduct
//                 }; // use "JS spread operator" to copy the whole object over to updatedProduct
//                 updatedProduct.qty = updatedProduct.qty + 1;

//                 cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct;
//             } else {
//                 updatedProduct = {
//                     id: id,
//                     qty: 1
//                 };
//                 // if no existing products, why we can't just push??
//                 cart.products = [...cart.products, updatedProduct];
//             }

//             // we have to make sure we are adding "numbers" not "strings", use + to convert it to numbers
//             cart.totalPrice = cart.totalPrice + +productPrice;

//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 console.log(err);
//             });
//         });
//     }

//     static deleteProduct(id, productPrice) {
//         fs.readFile(p, (err, fileContent) => {
//             if (err) {
//                 // means there isn't a shopping cart
//                 return;
//             }

//             const updatedCart = {
//                 ...JSON.parse(fileContent)
//             };

//             const product = updatedCart.products.find(p => p.id === id);
//             // if there isn't any this kind of product in the cart, then we of course can't delete anything
//             if (!product) {
//                 return;
//             }
//             const productQty = product.qty;

//             // remove the product by comparing the id
//             updatedCart.products = updatedCart.products.filter(p => p.id !== id);
//             // update the totalPrice based on how much and how many quantity we have for the product
//             updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;


//             fs.writeFile(p, JSON.stringify(updatedCart), err => {
//                 console.log(err);
//             });
//         });
//     }

//     static getCart(cb) {
//         fs.readFile(p, (err, fileContent) => {
//             const cart = JSON.parse(fileContent);
//             if (err) {
//                 cb(null);
//             } else {
//                 cb(cart);
//             }
//         });
//     }
// }