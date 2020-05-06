const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      //_id: false,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);