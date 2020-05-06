import axios from 'axios';
import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import AuthContext from '../../../contexts/AuthContext';
import SimpleSnackbar from '../../../components/UI/Snackbar';

const useStyles = makeStyles({
	div: {
		display: 'flex',
		width: '100%',
		justifyContent: 'space-around',
	},
	root: {
		marginTop: '30px',
	},
	leftAlign: {
		textAlign: 'left',
	},
	blockDisplay: {
		display: 'block',
		textAlign: 'center',
		marginTop: '25px',
		margin: '25px auto 0 auto',
	},
});

export default function ProductDetails(props) {
	const classes = useStyles();

	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const [url, setUrl] = React.useState('');
	const [product, setProduct] = React.useState(null);

	const [quantity, setQuantity] = React.useState(1);

	React.useEffect(() => {
		axios
			.get('http://localhost:7000/products/show-product/' + props.match.params.id)
			.then((res) => {
				setUrl('http://localhost:7000/images' + res.data.product.ImageURL);
				setProduct(res.data.product);
			})
			.catch((err) => {
				console.log(err.response);
			});
	}, []);

	const authorized = React.useContext(AuthContext);

	const handleAddToCart = (event, product, qty, cartId) => {
		if (!authorized) {
			axios
				.post('http://localhost:7000/cart/guest-cart/add-item', {
					product: product,
					quantity: qty,
					cartId: localStorage.getItem('cartId'),
				})
				.then((res) => {
					setOpen(true);
					setMessage('Item added to cart');
					window.localStorage.setItem('cart', res.data.cart);
				})
				.catch((err) => {
					setOpen(true);
					setMessage(err.reponse.data.message);
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
					setMessage('Item added to cart');
				})
				.catch((err) => {
					setOpen(true);
					setMessage(err.response.data.message);
				});
		}
	};

	return (
		<Container className={classes.root} maxWidth="lg">
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Grid container spacing={5}>
				<Grid item xs={12} sm={6}>
					<img src={url} height={400} />
				</Grid>
				<Grid className={classes.root} item xs={12} sm={6}>
					{product ? (
						<React.Fragment>
							<Typography variant="h6">{product.Manufacturer}</Typography>
							<Typography variant="h6">{product.Model}</Typography>
							<Typography variant="h6">Color: {product.Color}</Typography>
							<Typography variant="h6">{product.Storage} GB</Typography>
							<Typography variant="h6">${product.Price}</Typography>
							<TextField
								className={classes.root}
								value={quantity}
								onChange={(event) => {
									if (event.target.value > 0) setQuantity(event.target.value);
								}}
								type="number"
								variant="outlined"
								label="Quantity"
								gutterBottom
							/>
							<Button
								onClick={(event) => {
									handleAddToCart(event, props.match.params.id, quantity, '54544as');
								}}
								className={classes.blockDisplay}
								variant="contained"
								color="primary"
								size="large"
							>
								Add to Cart
							</Button>
						</React.Fragment>
					) : null}
				</Grid>
			</Grid>
		</Container>
	);
}
