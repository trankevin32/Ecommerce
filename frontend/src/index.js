import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import productsReducer from './reducers/products-reducer';
import userReducer from './reducers/user-reducer';
import cartReducer from './reducers/cart-reducer';
import AuthContext from './contexts/AuthContext';

const allStoreEnhancers = compose(applyMiddleware(thunk), window.devToolsExtension && window.devToolsExtension());

const allReducers = combineReducers({
	cart: cartReducer,
	products: productsReducer,
	user: userReducer,
});

const store = createStore(
	allReducers,
	{
		cart: {
			_id: window.localStorage.getItem('cartId') ? window.localStorage.getItem('cartId') : null
		},
		products: [{ name: 'iphone' }],
		user: 'Michael',
	},
	allStoreEnhancers
);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<AuthContext.Provider>
					<App />
				</AuthContext.Provider>
			</Router>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
