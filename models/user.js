const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class User {
    constructor(newUsername, newEmail, newId) {
        this.username = newUsername;
        this.email = newEmail;
        this._id = newId ? new mongodb.ObjectId(newId) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
    }
}

module.exports = User;
