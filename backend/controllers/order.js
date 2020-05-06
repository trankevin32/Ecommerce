const { validationResult } = require("express-validator/check");

const Order = require("../models/order");
const Cart = require('../models/cart');


exports.placeOrder = (req,res,next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    var billingInfo = {
        Firstname           : req.body.billing.firstname,
        Lastname            : req.body.billing.lastname,
        Address1            : req.body.billing.address1,
        Address2            : req.body.billing.address2,
        City                : req.body.billing.city,
        State               : req.body.billing.state,
        Zipcode             : req.body.billing.zipcode,

    }
    var shipmentInfo = {
        Firstname           : req.body.shipping.firstname,
        Lastname            : req.body.shipping.lastname,
        Address1            : req.body.shipping.address1,
        Address2            : req.body.shipping.address2,
        City                : req.body.shipping.city,
        State               : req.body.shipping.state,
        Zipcode             : req.body.shipping.zipcode,
    }
    var paymentInfo = {
        name                : req.body.payment.name,
        cardNumber          : req.body.payment.cardnumber,
        expirationDate      : req.body.payment.expirationdate,
        cvv                 : req.body.payment.cvv
    }

    var totalAmount         = req.body.totalamount;

    var estimatedDelivery   = req.body.estimateddelivery;

    var items               = req.body.items;

    const newOrder = new Order ({
        user                : req.userId,
        items               : items,
        shipping            : shipmentInfo,
        billing             : billingInfo,
        payment             : paymentInfo,
        totalAmount         : totalAmount,
        estimatedDelivery   : estimatedDelivery
    });

    newOrder.save()
    .then(result=> {
        return Cart.findByIdAndRemove(req.body.cartId);     
    })
    .then(result=> {
        res.status(201).json({
            message : "Order placed successfuly",
            order   : newOrder
        });
    })
    .catch(err=>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};