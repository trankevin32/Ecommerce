import axios from 'axios';

export const ITEM_ADDED = 'cart:itemAdded';

export function addItemToCart(cart) {

	window.localStorage.setItem('cartId', cart._id);
	return {
		type: ITEM_ADDED,
		payload: {
			newCart: cart,
		},
	};
}
export function addToCart(product, quantity, cartId) {
	return (dispatch) => {
		axios
			.get('http://localhost:7000/products')
			.then((res) => {
				window.localStorage.setItem('cartId', res.data.cart._id);
			})
			.catch((err) => {
				console.log(err.response);
			});
	};
}
