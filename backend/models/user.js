const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    maxlength: 25,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
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
});

module.exports = mongoose.model('User', userSchema);
