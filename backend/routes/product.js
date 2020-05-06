const express = require('express');
const { body } = require('express-validator/check');

const productController = require('../controllers/product');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/',productController.showAllProducts);

router.get('/show-product/:productId',productController.showProduct);


module.exports = router;