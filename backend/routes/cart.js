const express = require('express');
const { body } = require('express-validator/check');

const cartController = require('../controllers/cart');

const router = express.Router();

const isAuth = require('../middleware/is-auth');


router.get('/',isAuth,cartController.showCart);

router.post ('/add-item',isAuth,cartController.addItemToCart);

router.put ('/delete-item',isAuth,cartController.deleteItemFromCart);


router.get('/guest-cart/:cartId',cartController.showGuestCart);

router.post ('/guest-cart/add-item',cartController.addItemToGuestCart);

router.put ('/guest-cart/delete-item',cartController.deleteItemFromGuestCart);


router.get ('/get-total-price/:cartId',cartController.getTotalPrice);




module.exports = router;