const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(newTitle, newImageUrl, newPrice, newDescription) {
        this.title = newTitle;
        this.imageUrl = newImageUrl;
        this.price = newPrice;
        this.description = newDescription;
    }

    save() {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }

            products.push(this);

            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log("write data into file successfully!");
                console.log(err);
            });
        });
    }

    // use 'static' to make sure we can use 'Product' to call this method without needing to creating an object 
    // fetchAll() doesn't return anything, the return statements belong to the inner function
    // so we need to pass a callback function to make this work 
    static fetchAll(cb) {
        const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb([]);
                // return [];
            }
            cb(JSON.parse(fileContent));
            // return JSON.parse(fileContent);
        })
    }
}