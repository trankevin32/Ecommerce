
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { updateUser } from './actions/user-actions';
import { addToCart } from './actions/cart-actions';
import { addItemToCart } from './actions/cart-actions';
import ProductsPage from './Pages/ProductsPage';
import CheckoutPage from './Pages/CheckoutPage';
import Signup from './components/Auth/Signup';
import Signin from './components/Auth/Signin';
import AuthContext from './contexts/AuthContext';
import ProfilePage from './Pages/ProfilePage';

import './App.css';
import Cart from './components/Order/Cart/Cart';
import Navbar from './components/Layout/Navbar';
import ProductDetails from './components/Products/ProductDetails';

function App(props) {
	const onUpdateUser = () => {
		props.onUpdateUser('Sammy');
	};
	const [cart, setCart] = React.useState({});
	const handleCheckout = (cart) => {
		setCart({
			...cart,
		});
	};
	const [isAuth, setIsAuth] = React.useState(false);

	const [tab, setTab] = React.useState(4);
	const setTabVal = (val) => {
		setTab(val);
	};

	const [clicks, setClicks] = React.useState(0);
	const setClicksVal = () => {
		setClicks((prevState) => prevState + 1);
	};

	React.useEffect(() => {
		axios
			.get('http://localhost:7000/auth/user-profile', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				},
			})
			.then((res) => {
				setIsAuth(true);
			})
			.catch((err) => {
				console.log(err.response);
				setIsAuth(false);
			});
	}, [clicks]);

	const handleAddtoCart = () => {
		if (!isAuth) {
			props.onAddToCart();
		} else {
		}
	};

	const [showIndexPage, setShowIndexPage] = React.useState(false);

	const routeProduct = (prodId) => {
		props.history.push('/product/'+prodId);
	};

	return (
		<AuthContext.Provider value={isAuth}>
			<div className="App">
				<Navbar {...props} activeTab={tab} handleClick={setClicksVal} handleChange={(val) => setTabVal(val)} />

				<Route
					path="/"
					exact
					render={() => {
						setShowIndexPage(true);
					}}
				/>
				{showIndexPage ? (
					<ProductsPage showDetails={prodId => routeProduct(prodId)} addToCart={handleAddtoCart} cartId={props.cart._id ? props.cart._id : null} />
				) : null}
				<Route
					path="/cart"
					exact
					render={(props) => {
						setShowIndexPage(false);
						return <Cart {...props} handleCheckout={(cart) => handleCheckout(cart)} />;
					}}
				/>
				<Route
					path="/checkout"
					exact
					render={(props) => {
						setShowIndexPage(false);
						return (
							<AuthContext.Provider value={isAuth}>
								<CheckoutPage cart={cart} {...props} />
							</AuthContext.Provider>
						);
					}}
				/>
				<Route
					path="/product/:id"
					render={(props) => {
						setShowIndexPage(false);
						return (
							<AuthContext.Provider value={isAuth}>
								<ProductDetails {...props} />
							</AuthContext.Provider>
						);
					}}
				/>
				<Route
					path="/signup"
					exact
					render={(props) => {
						setShowIndexPage(false);
						return <Signup {...props} signup />;
					}}
				/>
				<Route
					path="/signin"
					exact
					render={(props) => {
						setShowIndexPage(false);
						return <Signin {...props} handleClick={setClicksVal} handleChange={(val) => setTabVal(val)} />;
					}}
				/>
				<Route
					path="/profile"
					exact
					render={(props) => {
						setShowIndexPage(false);
						return <ProfilePage {...props} />;
					}}
				/>
			</div>
		</AuthContext.Provider>
	);
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

export default connect(mapStateToProps, mapActionsToProps)(withRouter(App));
