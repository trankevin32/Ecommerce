import axios from 'axios';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import { updateUser } from '../../../actions/user-actions';
import { addToCart } from '../../../actions/cart-actions';
import { addItemToCart } from '../../../actions/cart-actions';
import AuthContext from '../../../contexts/AuthContext';
import SimpleSnackbar from '../../../components/UI/Snackbar';

import CartItem from './CartItem';

const useStyles = makeStyles({
	paper: {
		padding: '20px',
	},
	root: {
		textAlign: 'left',
		verticalAlign: 'middle',
		alignItems: 'center',
	},
	marginTop: {
		marginTop: '30px',
	},
	leftAlign: {
		textAlign: 'left !important',
	},
});

function Cart(props) {
	const classes = useStyles();

	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const [showEmpty, setShowEmpty] = React.useState(false);

	const authorized = React.useContext(AuthContext);

	const [cart, setCart] = React.useState({});
	const [showCart, setShowCart] = React.useState(true);

	const handleDelete = (cartId, itemId) => {
		if (!authorized) {
			axios
				.put('http://localhost:7000/cart/guest-cart/delete-item', {
					cartId: cartId,
					itemId: itemId,
				})
				.then((res) => {
					let index = 0;
					res.data.cart.items.forEach((item) => {
						res.data.cart.items[index].product['productDescription'] =
							res.data.cart.items[index].product.Manufacturer +
							' ' +
							res.data.cart.items[index].product.Model +
							' ' +
							res.data.cart.items[index].product.Color +
							' ' +
							res.data.cart.items[index].product.Storage +
							' GB';
						res.data.cart.items[index].product['price'] = res.data.cart.items[index].product['Price'];
						index += 1;
					});
					res.data.cart['cartId'] = res.data.cart._id;
					setCart({
						...res.data.cart,
					});
					setOpen(true);
					setMessage('Item deleted from cart');
					setShowEmpty(true);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axios
				.put(
					'http://localhost:7000/cart/delete-item',
					{
						itemId: itemId,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + window.localStorage.getItem('token'),
						},
					}
				)
				.then((res) => {
					setShowEmpty(true);
					let index = 0;
					res.data.cart.items.forEach((item) => {
						res.data.cart.items[index].product['productDescription'] =
							res.data.cart.items[index].product.Manufacturer +
							' ' +
							res.data.cart.items[index].product.Model +
							' ' +
							res.data.cart.items[index].product.Color +
							' ' +
							res.data.cart.items[index].product.Storage +
							' GB';
						res.data.cart.items[index].product['price'] = res.data.cart.items[index].product['Price'];
						index += 1;
					});
					res.data.cart['cartId'] = res.data.cart._id;
					setCart({
						...res.data.cart,
					});
					setOpen(true);
					setMessage('Item deleted from cart');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	const [totalAmount, setTotalAmount] = React.useState(0);

	React.useEffect(() => {
		if (!authorized) {
			axios
				.get('http://localhost:7000/cart/guest-cart/' + localStorage.getItem('cartId'))
				.then((res) => {
					setShowEmpty(true);
					let index = 0;
					res.data.cart.items.forEach((item) => {
						res.data.cart.items[index].product['productDescription'] =
							res.data.cart.items[index].product.Manufacturer +
							' ' +
							res.data.cart.items[index].product.Model +
							' ' +
							res.data.cart.items[index].product.Color +
							' ' +
							res.data.cart.items[index].product.Storage +
							' GB';
						res.data.cart.items[index].product['price'] = res.data.cart.items[index].product['Price'];
						index += 1;
					});
					res.data.cart['cartId'] = res.data.cart._id;

					setCart({
						...res.data.cart,
					});
					setShowCart(true);
				})
				.catch((err) => {
					console.log(err.response);
				});

			axios
				.get('http://localhost:7000/cart/get-total-price/' + localStorage.getItem('cartId'))
				.then((res) => {
					setTotalAmount(res.data.totalAmount);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axios
				.get('http://localhost:7000/cart', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + window.localStorage.getItem('token'),
					},
				})
				.then((res) => {
					let index = 0;
					if (res.data.cart) {
						res.data.cart.items.forEach((item) => {
							res.data.cart.items[index].product['productDescription'] =
								res.data.cart.items[index].product.Manufacturer +
								' ' +
								res.data.cart.items[index].product.Model +
								' ' +
								res.data.cart.items[index].product.Color +
								' ' +
								res.data.cart.items[index].product.Storage +
								' GB';
							res.data.cart.items[index].product['price'] = res.data.cart.items[index].product['Price'];
							index += 1;
						});
						res.data.cart['cartId'] = res.data.cart._id;

						setCart({
							...res.data.cart,
						});

						axios
							.get('http://localhost:7000/cart/get-total-price/' + res.data.cart._id)
							.then((res) => {
								setTotalAmount(res.data.totalAmount);
							})
							.catch((err) => {
								console.log(err);
							});
					}
					setShowEmpty(true);
					setShowCart(true);
				})
				.catch((err) => {
					console.log(err.response);
				});
		}
	}, []);

	const handleCheckout = () => {
		props.handleCheckout(cart);
		props.history.push('/checkout');
	};

	return showCart ? (
		<Container maxWidth="sm" className={classes.marginTop}>
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Paper variant="outlined" className={classes.paper}>
				{!(cart.items ? cart.items.length > 0 : false) || !cart.items ? (
					showEmpty ? (
						<Typography variant="button">The Cart is empty</Typography>
					) : (
						<Typography variant="button">...</Typography>
					)
				) : (
					<React.Fragment>
						<Grid container spacing={5} className={classes.root}>
							<Grid item xs={6}>
								<Typography variant="h6">Item</Typography>
							</Grid>
							<Grid item xs={1}>
								<Typography variant="h6">Qty</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6">Price</Typography>
							</Grid>
							<Grid item xs={3}></Grid>
							{cart.items.map((item) => {
								return item.product ? (
									<CartItem
										quantity={item.quantity}
										product={item.product}
										key={item._id}
										id={item.product._id}
										deleteItemFromCart={() => {
											handleDelete(cart._id, item._id);
										}}
									/>
								) : null;
							})}
						</Grid>
						<Divider />
						<Grid container spacing={5} className={classes.root}>
							<Grid item xs={12}>
								<Typography variant="button">Free Shipping</Typography>
							</Grid>
						</Grid>
						<Divider />
						<Grid container spacing={5} className={classes.root}>
							<Grid item xs={6}>
								<Typography variant="subtitle2">TAX FREE</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="subtitle2"></Typography>
							</Grid>
						</Grid>

						<Divider />
						<Grid container spacing={5} className={classes.root}>
							<Grid item xs={6}>
								<Typography variant="h6">Total Price</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">${totalAmount > 0 ? totalAmount : '...'}</Typography>
							</Grid>
						</Grid>
						<Button
							className={classes.marginTop}
							variant="contained"
							color="primary"
							onClick={handleCheckout}
							disabled={cart.items.length > 0 ? false : true}
						>
							Checkout
						</Button>
					</React.Fragment>
				)}
			</Paper>
		</Container>
	) : null;
}

const productsSelector = createSelector(
	(state) => state.products,
	(products) => products
);

const userSelector = createSelector(
	(state) => state.user,
	(user) => user
);

const cartSelector = createSelector(
	(state) => state.cart,
	(cart) => cart
);

const mapStateToProps = createSelector(productsSelector, userSelector, cartSelector, (products, user, cart) => ({
	products,
	user,
	cart,
}));

const mapActionsToProps = {
	onUpdateUser: updateUser,
	onAddToCart: addItemToCart,
};

export default connect(mapStateToProps, mapActionsToProps)(Cart);
