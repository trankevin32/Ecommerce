const express = require('express');
const { body } = require('express-validator/check');

const orderController = require('../controllers/order');

const isAuth = require('../middleware/is-auth-light');

const router = express.Router();

router.post('/place-order',isAuth,
[
    body("billing.firstname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("billing.lastname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("billing.address1")
      .isLength({ max: 100 })
      .not()
      .isEmpty(),

    body("billing.address2")
      .isLength({ max: 100 }),
    
    body("billing.city")
      .isLength({ max:100 })
      .not()
      .isEmpty(),

    body("billing.state")
      .isLength({ max:2, min:2 })
      .not()
      .isEmpty(),

    body("billing.zipcode")
      .isLength({ min: 5, max: 9 })
      .not()
      .isEmpty(),

    body("shipping.firstname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("shipping.lastname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("shipping.address1")
      .isLength({ max: 100 })
      .not()
      .isEmpty(),

    body("shipping.address2")
      .isLength({ max: 100 }),
    
    body("shipping.city")
      .isLength({ max:100 })
      .not()
      .isEmpty(),

    body("shipping.state")
      .isLength({ max:2, min:2 })
      .not()
      .isEmpty(),

    body("shipping.zipcode")
      .isLength({ min: 5, max: 9 })
      .not()
      .isEmpty(),

    body("payment.name")
        .isLength({ max: 100 })
        .not()
        .isEmpty(),
    
    body("payment.cardnumber")
        .isLength({ max: 20 })
        .not()
        .isEmpty(),

    body("payment.expirationdate")
        .not()
        .isEmpty(),

    body("payment.cvv")
        .isLength({ max: 5 })
        .not()
        .isEmpty()

],
orderController.placeOrder);


module.exports = router;