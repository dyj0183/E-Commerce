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
        const updatedCart = {items: [{productId: product._id, quantity: 1 }]};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, { $set: {cart: updatedCart}}); // this will only overwrite the old cart with new updatedCart
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;
