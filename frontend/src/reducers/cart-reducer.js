import axios from 'axios';

import { ITEM_ADDED } from '../actions/cart-actions';

export default function cartReducer(cart = '', { type, payload }) {
	switch (type) {
		case ITEM_ADDED:
			return payload.newCart;
		default:
			return cart;
	}
}
