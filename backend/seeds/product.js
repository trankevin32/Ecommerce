const mongoose = require('mongoose');
const Product = require('../models/product');

const products = [
  {
    Manufacturer : 'Apple',
    Model : 'iPhone 11',
    Price: 19.99,
    Color: "Black",
    Storage: "128",
    ImageURL : "/Apple/iphone-black.png"
  },
  {
    Manufacturer : 'Apple',
    Model : 'iPhone 11',
    Price: 19.99,
    Color: "Rose Gold",
    Storage: "128",
    ImageURL : "/Apple/iphone-rosegold.png"
  },
  {
    Manufacturer : 'Apple',
    Model : 'iPhone 11',
    Price: 19.99,
    Color: "White",
    Storage: "128",
    ImageURL : "/Apple/iphone-white.png"
  },
  {
    Manufacturer : 'Apple',
    Model : 'iPhone 11',
    Price: 19.99,
    Color: "Green",
    Storage: "128",
    ImageURL : "/Apple/iphone-green.png"
  },
  {
    Manufacturer : 'Google',
    Model : 'Pixel Xl',
    Price: 9.99,
    Color: "Black",
    Storage: "128",
    ImageURL : "/Google/pixel-black.jpg"
  },
  {
    Manufacturer : 'Google',
    Model : 'Pixel Xl',
    Price: 9.99,
    Color: "Pink",
    Storage: "128",
    ImageURL : "/Google/pixel-pink.png"
  },
  {
    Manufacturer : 'Google',
    Model : 'Pixel Xl',
    Price: 9.99,
    Color: "White",
    Storage: "128",
    ImageURL : "/Google/pixel-white.jpg"
  },
  {
    Manufacturer : 'Samsung',
    Model : 'Galaxy S10',
    Price: 12.99,
    Color: "Blue",
    Storage: "256",
    ImageURL: "/Samsung/samsung-blue.jpg"
  },
  {
    Manufacturer : 'Samsung',
    Model : 'Galaxy S10',
    Price: 12.99,
    Color: "Black",
    Storage: "256",
    ImageURL: "/Samsung/samsung-black.jpg"
  },
  {
    Manufacturer : 'Samsung',
    Model : 'Galaxy S10',
    Price: 12.99,
    Color: "Pink",
    Storage: "256",
    ImageURL: "/Samsung/samsung-pink.jpg"
  },    
];

const seedProducts = () => {
  Product.remove({}, (err) => {
    if(err) {
      console.log(err);
    }
    console.log('PRODUCTS REMOVED');
    products.forEach((product) => {
      Product.create(product, (err, createdProduct) => {
        if(err) {
          console.log(err);
        } else {
          console.log('PRODUCT CREATED');
          createdProduct.save();
        }
      })
    })
  })
}

module.exports = seedProducts;