const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const cartRoutes = require ('./routes/cart');
const orderRoutes = require ('./routes/order');

//const seedProducts = require('./seeds/product');
//seedProducts();


const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order',orderRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const MONGODB_URI = "mongodb+srv://admin:test1@cluster0-zxubq.mongodb.net/test?retryWrites=true&w=majority";

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(result => {
        app.listen(7000);
        console.log("connected to the sever");
    })
    .catch (error => {
        console.log(error);
    });


module.exports.app = app;
