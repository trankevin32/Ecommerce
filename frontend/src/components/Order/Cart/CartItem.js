import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default function CartItem(props) {
	return (
		<React.Fragment>
			<Grid item xs={6}>
				{props.product.Manufacturer +
					' ' +
					props.product.Model +
					' ' +
					props.product.Color +
					' ' +
					props.product.Storage +
					'GB'}
			</Grid>
			<Grid item xs={1}>
				{props.quantity}
			</Grid>
			<Grid item xs={2}>
				${props.product.Price}
			</Grid>
			<Grid item xs={3}>
				<IconButton aria-label="delete" onClick={props.deleteItemFromCart}>
					<DeleteIcon />
				</IconButton>
			</Grid>
		</React.Fragment>
	);
}
