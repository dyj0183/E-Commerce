const path = require('path');

// this points to the path of the file where we start the app which is app.js in this case 
module.exports = path.dirname(require.main.filename); 