import axios from 'axios';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SimpleSnackbar from '../../../components/UI/Snackbar';
import AuthContext from '../../../contexts/AuthContext';

const useStyles = makeStyles({
	card: {
		padding: 20,
	},
	media: {
		height: 425,
		backgroundSize: 'contain',
	},
});

export default function ProductCard(props) {
	const classes = useStyles();

	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const authorized = React.useContext(AuthContext);

	const handleAddToCart = (event, product, qty, cartId) => {
		let cartIdUpdated = localStorage.getItem('cartId');
		let fCart = cartIdUpdated ? cartIdUpdated : cartId;
		console.log("cart - ", cartId);
		if (!authorized) {
			axios
				.post('http://localhost:7000/cart/guest-cart/add-item', {
					product: product,
					quantity: qty,
					cartId: fCart,
				})
				.then((res) => {
					console.log(res);
					setOpen(true);
					setMessage('Item added to cart.');
					window.localStorage.setItem('cart', res.data.cart);
					window.localStorage.setItem('cartId', res.data.cart._id);
					props.addToCart(res.data.cart);
				})
				.catch((err) => {
					console.log(err.respnse);
				});
		} else {
			axios
				.post(
					'http://localhost:7000/cart/add-item',
					{
						product: product,
						quantity: qty,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('token'),
						},
					}
				)
				.then((res) => {
					setOpen(true);
					setMessage('Item added to cart.');
				})
				.catch((err) => {
					console.log(err.respnse);
				});
		}
	};

	return (
		<React.Fragment>
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Card>
				<CardActionArea onClick={props.showDetails}>
					<CardMedia
						className={classes.media}
						//image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-11-pro-max-gold-select-2019?wid=834&hei=1000&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1566953859132"
						image={'http://localhost:7000/images' + props.imageUrl}
						title="image-title"
					/>
					<Typography variant="h5" component="h5" gutterBottom>
						{props.model}
					</Typography>
					<Typography variant="h6" component="h6">
						{props.color}
					</Typography>
					<Typography variant="h6" component="h6">
						{props.storage}GB
					</Typography>
					<Typography variant="h6" component="h6">
						${props.price}
					</Typography>
				</CardActionArea>
				<CardActions>
					<Button
						variant="contained"
						color="primary"
						onClick={(event) => {
							handleAddToCart(event, props.id, 1, props.id);
						}}
					>
						Add to Cart
					</Button>
					<Button onClick={props.showDetails} color="primary">
						View Details
					</Button>
				</CardActions>
			</Card>
		</React.Fragment>
	);
}
