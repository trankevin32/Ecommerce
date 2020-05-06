import React from 'react';

import CheckoutManager from '../../components/Order/CheckoutManager';
import AuthContext from '../../contexts/AuthContext';
import { Redirect } from 'react-router-dom';

export default function CheckoutPage(props) {
	let isAuth = React.useContext(AuthContext);
	//return isAuth ? <CheckoutManager {...props} cart={props.cart} /> : <Redirect to="/signin" />;
	return <CheckoutManager {...props} cart={props.cart} /> ;
}
