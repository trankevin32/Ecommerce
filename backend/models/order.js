const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderInfoSubSchema = new Schema ({
    Firstname: {
        type: String,
        maxlength: 25,
        required: true
      },
      Lastname: {
        type: String,
        maxlength: 25,
        required: true
      },
      Address1 : {
        type: String,
        maxlength: 100,
        required: true
      },
      Address2: {
        type: String,
        maxlength: 100,
        required: false
      },
      City: {
        type: String,
        maxlength: 100,
        required: true
      },
      State: {
        type: String,
        maxlength: 2,
        required: true
      },
      Zipcode: {
        type: Number,
        maxlength: 9,
        minlength: 5,
        required: true
      }
}, { _id: false });


const orderSchema = new Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
          _id: false,
          product: {
            productDescription : {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
          },
          quantity: Number
        }
    ],
    shipping : orderInfoSubSchema,
    billing : orderInfoSubSchema,
    payment : {
        name: {
            type: String,
            maxlength: 100,
            required: true
        },
        cardNumber: {
            type: Number,
            maxlength: 20,
            required: true
        },
        expirationDate : {
            type: String,
            required: true
        },
        cvv: {
            type: Number,
            maxlength: 5,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    estimatedDelivery : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model ('Order', orderSchema);