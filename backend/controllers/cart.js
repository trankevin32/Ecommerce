const { validationResult } = require('express-validator/check');

const Cart = require('../models/cart');
const Product = require('../models/product');

/* Cart Controllers when user is logged in*/

exports.showCart = (req, res, next) => {
	Cart.findOne({ user: req.userId })
		.populate('items.product')
		.exec((err, cart) => {
			if (!cart) {
				return res.status(200).json({
					message: 'No cart found!',
					cart: null,
				});
			}
			res.status(200).json({
				message: 'Cart fetched Successfuly',
				cart: cart,
			});
		});
};

exports.addItemToCart = (req, res, next) => {
	const item = {
		product: req.body.product,
		quantity: req.body.quantity,
	};

	Cart.findOne({ user: req.userId })
		.then((foundCart) => {
			console.log(foundCart);
			if (foundCart) {
				var foundIndex = foundCart.items.findIndex(function (foundItem) {
					return foundItem.product == item.product;
				});

				if (foundIndex != -1) {
					foundCart.items[foundIndex].quantity += Number(item.quantity);
					return foundCart.save();
				} else {
					foundCart.items.push(item);
					return foundCart.save();
				}
			} else {
				const newCart = new Cart({
					user: req.userId,
					items: [item],
				});
				return newCart.save();
			}
		})
		.then((gotCart) => {
			Cart.findById(gotCart.id)
				.populate('items.product')
				.exec((err, cart) => {
					if (cart) {
						res.status(201).json({
							message: 'Item added in the cart successfuly',
							cart: cart,
						});
					}
				});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deleteItemFromCart = (req, res, next) => {
	Cart.findOne({ user: req.userId })
		.then((foundCart) => {
			if (!foundCart) {
				res.status(404).json({
					message: 'Cart not found!',
				});
			}
			foundCart.items = foundCart.items.filter((item) => item._id != req.body.itemId);
			return foundCart.save();
		})
		.then((savedCart) => {
			Cart.findById(savedCart.id)
				.populate('items.product')
				.exec((err, cart) => {
					if (cart) {
						res.status(201).json({
							message: 'Item Deleted from Cart Successfuly',
							cart: cart,
						});
					}
				});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

/* Cart Controllers when user is not logged in/ Guest Cart */

exports.showGuestCart = (req, res, next) => {
	Cart.findById(req.params.cartId)
		.populate('items.product')
		.exec((err, cart) => {
			if (!cart) {
				return res.status(200).json({
					message: 'No cart found!',
					cart: null,
				});
			}
			res.status(200).json({
				message: 'Cart fetched Successfuly',
				cart: cart,
			});
		});
};

exports.addItemToGuestCart = (req, res, next) => {
	const item = {
		product: req.body.product,
		quantity: req.body.quantity,
	};

	Cart.findById(req.body.cartId)
		.then((foundCart) => {
			if (foundCart) {
				var foundIndex = foundCart.items.findIndex(function (foundItem) {
					return foundItem.product == item.product;
				});
				console.log(foundIndex);
				if (foundIndex != -1) {
					foundCart.items[foundIndex].quantity += Number(item.quantity);
					return foundCart.save();
				} else {
					foundCart.items.push(item);
					return foundCart.save();
				}
			} else {
				return Cart.create({
					items: [item],
				});
			}
		})
		.then((gotCart) => {
			Cart.findById(gotCart.id)
				.populate('items.product')
				.exec((err, cart) => {
					if (cart) {
						res.status(201).json({
							message: 'Item added in the cart successfuly',
							cart: cart,
						});
					}
				});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.deleteItemFromGuestCart = (req, res, next) => {
	Cart.findById(req.body.cartId)
		.then((foundCart) => {
			if (!foundCart) {
				res.status(404).json({
					message: 'Cart not found!',
				});
			}
			foundCart.items = foundCart.items.filter((item) => item._id != req.body.itemId);
			return foundCart.save();
		})
		.then((savedCart) => {
			Cart.findById(savedCart.id)
				.populate('items.product')
				.exec((err, cart) => {
					if (cart) {
						res.status(201).json({
							message: 'Item Deleted from Cart Successfuly',
							cart: cart,
						});
					}
				});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

/* Total Price Calculation */

function getItemPrice(item) {
	var price = 0;

	price = item.quantity * item.product.Price //+ item.quantity * item.product.Price * 0.0625;
	return price;
}

exports.getTotalPrice = (req, res, next) => {
	const cartId = req.params.cartId;
	var totalPrice = 0;
	var foundCart;
	Cart.findById(cartId)
		.then((cart) => {
			if (!cart) {
				res.status(404).json({
					message: 'Cart not found',
				});
			}
			foundCart = cart;
			return Product.find();
		})
		.then((products) => {
			//console.log(foundCart);
			return foundCart.items.map((item) => {
				return products.map((product) => {
					if (item.product == product.id) {
						return { product: product, quantity: item.quantity };
					}
				});
			});
		})
		.then((matchedProducts) => {
			matchedProducts = matchedProducts;
			for (var matchedProduct = 0; matchedProduct < matchedProducts.length; matchedProduct++) {
				matchedProducts[matchedProduct] = matchedProducts[matchedProduct].filter(function (gotMatchedProduct) {
					return gotMatchedProduct != undefined;
				});
			}
			//console.log(matchedProducts);
			for (var product = 0; product < matchedProducts.length; product++) {
				totalPrice += getItemPrice(matchedProducts[product][0]);
			}

			totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
			return totalPrice;
		})
		.then((totalPrice) => {
			res.status(200).json({
				message: 'Price fetched successfuly',
				totalAmount: totalPrice,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
