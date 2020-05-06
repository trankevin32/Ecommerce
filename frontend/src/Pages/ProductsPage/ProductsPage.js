import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';

import ProductCard from '../../components/Products/ProductCard';

const useStyles = makeStyles({
	card: {
		padding: 20,
		width: '75%',
		marginLeft: '25%',
	},
	flexBox: {
		display: 'flex',
	},
	filterContainer: {
		width: '20%',
		position: 'fixed',
		paddingTop: '14px',
		'&  *': {
			'margin-right': 0,
		},
	},
	tab: {
		width: '100%',
		display: 'block',
		margin: '0 !important',
		minWidth: '100%',
	},
	paper: {
		width: '100%',
		height: '100px',
	},
	filter: {
		textAlign: 'left',
	},
});

export default function ProductsPage(props) {
	const classes = useStyles();

	const [products, setProducts] = React.useState([]);

	React.useEffect(() => {
		axios
			.get('http://localhost:7000/products')
			.then((res) => {
				setProducts([...res.data.products]);
			})
			.catch((err) => {
				console.log(err.response);
			});
	}, []);

	const [state, setState] = React.useState({
		Black: {
			filter: false,
			type: 'color',
		},
		Blue: {
			filter: false,
			type: 'color',
		},
		Green: {
			filter: false,
			type: 'color',
		},
		White: {
			filter: false,
			type: 'color',
		},
		Silver: {
			filter: false,
			type: 'color',
		},
		Pink: {
			filter: false,
			type: 'color',
		},
		'Rose Gold': {
			filter: false,
			type: 'color',
		},
		'128 GB': {
			filter: false,
			type: 'storage',
		},
		'256 GB': {
			filter: false,
			type: 'storage',
		},
		'512 GB': {
			filter: false,
			type: 'storage',
		},
	});

	let filterCheckboxes = [];
	let filterKeys = Object.keys(state);

	const handleChange = (event) => {
		setState({
			...state,
			[event.target.name]: {
				...state[event.target.name],
				filter: event.target.checked,
			},
		});
	};
	let filter = false;
	let filteredValues = {
		color: [],
		storage: [],
	};
	filterKeys.forEach((fKey) => {
		if (state[fKey].filter) {
			filter = true;
			filteredValues[state[fKey].type].push(fKey);
		}
	});

	const [manufacturer, setManufacturer] = React.useState({
		filter: false,
		title: '',
	});

	const showAllBrands = () => {
		setManufacturer({
			filter: false,
			title: '',
		});
	};

	const handleManufacturerFilter = (mfcr) => {
		setManufacturer({
			filter: true,
			title: mfcr,
		});
	};

	filterKeys.forEach((key) => {
		filterCheckboxes.push(
			<FormControlLabel
				key={key}
				control={<Checkbox checked={state[key].filter} onChange={handleChange} color="primary" name={key} />}
				label={key}
			/>
		);
	});

	const shouldFilterProduct = (product) => {
		let result = false;
		let mfcrFilter = manufacturer.filter;
		let hardFilter = null;
		if (filter && mfcrFilter) {
			hardFilter = false;
		}
		if (filter) {
			if (filteredValues.color.length > 0) {
				if (filteredValues.color.indexOf(product.Color) > -1) {
					result = true;
				}
			}
			if (filteredValues.storage.length > 0) {
				let strg = product.Storage + ' GB';
				if (filteredValues.storage.indexOf(strg) > -1) {
					result = true;
				}
			}
		} else {
			result = true;
		}
		if (mfcrFilter && filter && result) {
			if (manufacturer.title === product.Manufacturer) {
				result = true;
			} else {
				result = false;
			}
		} else if (mfcrFilter && !filter) {
			if (manufacturer.title === product.Manufacturer) {
				result = true;
			} else {
				result = false;
			}
		}

		return result;
	};

	return (
		<Box component="div" className={classes.flexBox}>
			<Box component="div" className={classes.filterContainer}>
				<Tab onClick={showAllBrands} label="All Products" className={classes.tab} />
				<Tab onClick={() => handleManufacturerFilter('Apple')} label="Apple" className={classes.tab} />
				<Tab onClick={() => handleManufacturerFilter('Samsung')} label="Samsung" className={classes.tab} />
				<Tab onClick={() => handleManufacturerFilter('Google')} label="Google" className={classes.tab} />
				<Container maxWidth="lg">
					<Divider />
					<Typography className={classes.filter} variant="h6" component="h6" color="primary" gutterBottom>
						Filter
					</Typography>
					<FormGroup>{filterCheckboxes}</FormGroup>
				</Container>
			</Box>
			<Grid container spacing={5} className={classes.card}>
				{products.map((product) => {
					return shouldFilterProduct(product) ? (
						<Grid key={product._id} item xs={12} sm={6} lg={4}>
							<ProductCard
								id={product._id}
								model={product.Model}
								color={product.Color}
								storage={product.Storage}
								price={product.Price}
								imageUrl={product.ImageURL}
								addToCart={props.addToCart}
								cartId={props.cartId ? props.cartId : product._id}
								showDetails={() => props.showDetails(product._id)}
							/>
						</Grid>
					) : null;
				})}
			</Grid>
		</Box>
	);
}
