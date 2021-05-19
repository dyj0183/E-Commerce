const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send("<form action='/product' method='POST'><input type='text' name='important'><button>Submit</button></form>")
})

router.post('/product', (req, res, next) => {
    //res.send(req.body);
    console.log(req.body);
    res.redirect('/');
   
    console.log("This is my product page");
});

module.exports = router;