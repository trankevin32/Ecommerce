const { validationResult } = require("express-validator/check");

const Product = require("../models/product");

exports.showAllProducts = (req,res,next) => {
    Product.find()
    .then(products => {
        if (!products) {
            res.status(200).json({
                message: "No products found!",
                products : products
            });
        }
        res.status(200).json({
            message : "Products fetched Successfuly",
            products : products
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
}


exports.showProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if (!product) {
            res.status(404).json ({
                message: "Product not found!"
            });
        }
        res.status(200).json ({
            message: "Product found successfuly",
            product: product
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
};
