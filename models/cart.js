const fs = require('fs');
const path = require('path');

module.exports = class Cart {

    static addProduct(id, productPrice) {

        const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};

            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // check if the new product we try to add already exist in the "cart object" or not
            const existingProductIndex = cart.products.findIndex(product => product.id === id); // check if the id matches or not, returns the matched product's "Index"
            const existingProduct = cart.products[existingProductIndex];
            
            // create a new product variable
            let updatedProduct;
            // if product already exists, then we want to increase the quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct}; // use "JS spread operator" to copy the whole object over to updatedProduct
                updatedProduct.qty = updatedProduct.qty + 1;

                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                // if no existing products, why we can't just push??
                cart.products = [...cart.products, updatedProduct];
            }

            // we have to make sure we are adding "numbers" not "strings", use + to convert it to numbers
            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }
}