const fs = require('fs');
const path = require('path');

const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

// import the Cart Model
const Cart = require('./cart');

module.exports = class Product {
    constructor(newId, newTitle, newImageUrl, newPrice, newDescription) {
        this._id = newId ? new mongodb.ObjectId(newId) : null; // the newId got sent in as a string, so we need to convert it to what mongoDB uses, otherwise we wouldn't be working with the correct product
        this.title = newTitle;
        this.imageUrl = newImageUrl;
        this.price = newPrice;
        this.description = newDescription;
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (this._id) {
            // Update the product
            dbOperation = db
                .collection('products')
                .updateOne({_id: this._id}, {$set: this});
        } else {
            dbOperation = db.collection('products').insertOne(this);
        }

        return dbOperation
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();

        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(productId) {
        const db = getDb();

        return db.collection('products').find({
                _id: new mongodb.ObjectId(productId)
            })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static deleteById(productId) {
        const db = getDb();

        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(productId)})
        .then(result => {
            console.log('Deleted product by ID');
        })
        .catch(err => console.log(err))
    }

    /* all the methods below we use for working with "json files" but not a database 
     *
     *
     * 
     * 
     */

    // // this is used to save a new product or update an existing product
    // save() {
    //     const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

    //     fs.readFile(p, (err, fileContent) => {
    //         let products = [];
    //         if (!err) {
    //             products = JSON.parse(fileContent);
    //         }

    //         // check if the id exists or not, if exists, then simply update it instead of creating a new id for it
    //         if (this.id) {
    //             // first, find the product
    //             const existingProductIndex = products.findIndex(p => p.id === this.id);
    //             const updatedProducts = [...products]; // why do I need to create a new one? Can't I do this: products[existingProductIndex] = this; ?
    //             updatedProducts[existingProductIndex] = this;

    //             fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
    //                 console.log(err);
    //             });

    //         } else {
    //             this.id = Math.random().toString();
    //             products.push(this);

    //             fs.writeFile(p, JSON.stringify(products), (err) => {
    //                 console.log(err);
    //             });
    //         }
    //     });
    // }

    // static deleteById(id) {

    //     const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
    //     let cb;

    //     fs.readFile(p, (err, fileContent) => {
    //         if (err) {
    //             cb([]);
    //         }
    //         cb(JSON.parse(fileContent));
    //     });

    //     cb = (products => {

    //         const product = products.find(p => p.id === id);
    //         const productPrice = product.price; // we need the productPrice for removing it from the shopping cart

    //         const updatedProducts = products.filter(product => product.id !== id); // filter returns all elements that meets that statement

    //         // below will work, but we want to use a new approach "filter"
    //         // const productIndex = products.findIndex(p => p.id === id); 

    //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //             // if no err, we also want to remove the product from the shopping cart
    //             if (!err) {
    //                 Cart.deleteProduct(id, productPrice)

    //             } else {
    //                 console.log(err);
    //             }
    //         });
    //     });
    // }

    // // use 'static' to make sure we can use 'Product' to call this method without needing to creating an object 
    // // fetchAll() doesn't return anything, the return statements belong to the inner function
    // // so we need to pass a callback function to make this work 
    // static fetchAll(cb) {
    //     const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

    //     fs.readFile(p, (err, fileContent) => {
    //         if (err) {
    //             cb([]);
    //             // return [];
    //         }
    //         cb(JSON.parse(fileContent));
    //         // return JSON.parse(fileContent);
    //     });
    // }

    // static findById(id, anotherCB) {
    //     const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
    //     let cb;

    //     fs.readFile(p, (err, fileContent) => {
    //         if (err) {
    //             cb([]);
    //         }
    //         cb(JSON.parse(fileContent));
    //     });

    //     cb = (products => {
    //         const product = products.find(p => p.id === id); // javascript find() method will run through all the products and if the id matches, then it will return the product
    //         anotherCB(product);
    //     });
    // }
}