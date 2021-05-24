// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// let _db; // will only be used internally

// // take url to connect, copy and paste from mongodb atlas, connect here returns a promise
// const mongoConnect = (callback) => {
//     MongoClient.connect(
//             'mongodb+srv://Jamal:123456abc@cluster0.sqve2.mongodb.net/shop?retryWrites=true&w=majority'
//             // above code connects to "shop" databse, if it doesn't exist, it will create one for me
//         )
//         .then(client => {
//             console.log('Connected!');
//             _db = client.db(); // store the database into it, connect to "shop" database we decided in the url above
//             callback();
//         })
//         .catch(err => {
//             console.log(err);
//             throw err;
//         });
// };

// const getDb = () => {
//     if (_db) {
//         return _db;
//     }
//     throw 'No database found!';
// };

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;