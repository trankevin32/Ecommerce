const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}
	const name = req.body.name;
	const password = req.body.password;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const address1 = req.body.address1;
	const address2 = req.body.address2;
	const city = req.body.city;
	const state = req.body.state;
	const zipcode = req.body.zipcode;
	bcrypt
		.hash(password, 12)
		.then((hashedPw) => {
			const user = new User({
				Name: name,
				Password: hashedPw,
				Firstname: firstname,
				Lastname: lastname,
				Address1: address1,
				Address2: address2,
				City: city,
				State: state,
				Zipcode: zipcode,
			});
			return user.save();
		})
		.then((result) => {
			res.status(201).json({ message: 'User created!', userId: result._id });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.login = (req, res, next) => {
	const name = req.body.name;
	const password = req.body.password;

	let loadedUser;
	User.findOne({ Name: name })
		.then((user) => {
			if (!user) {
				const error = new Error('A user with this name could not be found.');
				error.statusCode = 401;
				throw error;
			}
			loadedUser = user;
			return bcrypt.compare(password, user.Password);
		})
		.then((isEqual) => {
			if (!isEqual) {
				const error = new Error('Wrong password!');
				error.statusCode = 401;
				throw error;
			}
			const token = jwt.sign(
				{
					name: loadedUser.Name,
					userId: loadedUser._id.toString(),
				},
				'Thisisasecret-password-tercesasisihT',
				{ expiresIn: '24h' }
			);
			res.status(200).json({
				token: token,
				name: loadedUser.Firstname,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.showUserProfile = (req, res, next) => {
	User.findById(req.userId)
		.then((user) => {
			if (!user) {
				const error = new Error('User not found!');
				error.statusCode = 401;
				throw error;
			}
			res.status(200).json({
				message: 'Profile fetched successfully.',
				user: user,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updateProfile = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.statusCode = 422;
		error.data = errors.array();
		throw error;
	}

	var shouldPasswordChange = false;

	var password;
	if (req.body.password) {
		if (req.body.password.length != 0) {
			if (req.body.password.length >= 8 && req.body.password.length <= 25) {
				password = req.body.password;
				shouldPasswordChange = true;
			} else {
				const error = new Error('Validation failed.');
				error.statusCode = 422;
				error.data = 'Password must be of length between 8 and 25 characters';
				throw error;
			}
		}
	}

	const name = req.body.name;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const address1 = req.body.address1;
	const address2 = req.body.address2;
	const city = req.body.city;
	const state = req.body.state;
	const zipcode = req.body.zipcode;

	User.findById(req.userId)
		.then((user) => {
			if (!user) {
				const error = new Error('User not found!');
				error.statusCode = 401;
				throw error;
			}
			return user;
		})
		.then((fetchedUser) => {
			if (shouldPasswordChange) {
				bcrypt.hash(password, 12).then((hashedPw) => {
					fetchedUser.Name = name;
					fetchedUser.Password = hashedPw;
					fetchedUser.Firstname = firstname;
					fetchedUser.Lastname = lastname;
					fetchedUser.Address1 = address1;
					fetchedUser.Address2 = address2;
					fetchedUser.City = city;
					fetchedUser.State = state;
					fetchedUser.Zipcode = zipcode;
					return fetchedUser.save();
				});
			} else {
				fetchedUser.Name = name;
				fetchedUser.Firstname = firstname;
				fetchedUser.Lastname = lastname;
				fetchedUser.Address1 = address1;
				fetchedUser.Address2 = address2;
				fetchedUser.City = city;
				fetchedUser.State = state;
				fetchedUser.Zipcode = zipcode;
				return fetchedUser.save();
			}
		})
		.then((result) => {

				return res.status(201).json({
					message: 'Profile Information updated successfully',
				});

		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};
