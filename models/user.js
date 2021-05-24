const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(newUsername, newEmail, newId, cart) {
        this.username = newUsername;
        this.email = newEmail;
        this._id = newId ? new mongodb.ObjectId(newId) : null;
        this.cart = cart; // an object with some itmes { items: []}
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        // if the product already exists in the cart, then add the quantity, otherwise push the whole product into the cart item 
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: product._id,
                quantity: newQuantity
            });
        }

        // update the entire cart items
        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();
        return db.collection('users').updateOne({
            _id: this._id
        }, {
            $set: {
                cart: updatedCart
            }
        }); // this will only overwrite the old cart with new updatedCart
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne({
                _id: this._id
            }, {
                $set: {
                    cart: {
                        items: updatedCartItems
                    }
                }
            });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({
            _id: new mongodb.ObjectId(userId)
        });
    }
}

module.exports = User;