const products = [];

module.exports = class Product {
    constructor(newTitle) {
        this.title = newTitle;
    }

    save() {
        products.push(this);
    }

    // use 'static' to make sure we can use 'Product' to call this method without needing to creating an object 
    static fetchAll() {
        return products;
    }

}