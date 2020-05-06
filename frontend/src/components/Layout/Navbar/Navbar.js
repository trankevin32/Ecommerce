import axios from 'axios';
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AuthContext from '../../../contexts/AuthContext';

const AntTabs = withStyles({
	root: {
		borderBottom: '1px solid #e8e8e8',
		position: 'fixed',
		width: '100vw',
		zIndex: '1000',
		backgroundColor: '#fff',
	},
	indicator: {
		backgroundColor: '#1890ff',
	},
})(Tabs);

const AntTab = withStyles((theme) => ({
	root: {
		textTransform: 'none',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(4),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: '#40a9ff',
			opacity: 1,
		},
		'&$selected': {
			color: '#1890ff',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: '#40a9ff',
		},
	},
	selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	padding: {
		padding: theme.spacing(3),
	},
	brand: {
		position: 'fixed',
		left: '24px',
		top: '7px'
	},
	demo1: {
		backgroundColor: theme.palette.background.paper,
		textAlign: 'right',
		display: 'flex',
		justifyContent: 'space-between',
	},
	floatRight: {
		direction: 'rtl',
	},
	button: {
		backgroundColor: '#4285f4',
		color: '#fff !important',
	},
	demo2: {
		backgroundColor: '#2e1534',
	},
}));

export default function Navbar(props) {
	const classes = useStyles();

	const handleChange = (event, newValue) => {
		props.handleChange(newValue);
	};

	const isAuth = React.useContext(AuthContext);

	const routeCart = () => {
		props.handleChange(2);
		props.handleClick();
		props.history.push('/cart');
	};
	const routeHome = () => {
		props.handleChange(4);
		props.handleClick();
		props.history.push('/');
	};
	const routeProducts = () => {
		props.handleChange(3);
		props.handleClick();
		props.history.push('/');
	};

	const routeSignin = () => {
		props.handleChange(1);
		props.handleClick();
		props.history.push('/signin');
	};

	const routeSignup = () => {
		props.handleClick();
		props.handleChange(0);
		props.history.push('/signup');
	};

	const handleLogout = () => {
		window.localStorage.removeItem('token');
		props.handleChange(4);
		props.handleClick();
		props.history.push('/');
	};

	const routeProfile = () => {
		props.handleClick();
		props.handleChange(1);
		props.history.push('/profile');
	};

	return (
		<div className={classes.root}>
			<div className={classes.demo1}>
				<div>
					<AntTabs
						className={classes.floatRight}
						value={props.activeTab}
						onChange={handleChange}
						aria-label="ant example"
					>
							{!isAuth ? (
								<AntTab onClick={routeSignup} className={classes.button} label="Signup" />
							) : (
								<AntTab onClick={handleLogout} className={classes.button} label="Logout" />
							)}
							{!isAuth ? (
								<AntTab onClick={routeSignin} label="Signin" />
							) : (
								<AntTab onClick={routeProfile} label="My Profile" />
							)}

							<AntTab onClick={routeCart} label="My Cart" />
							<AntTab onClick={routeProducts} label="Products" />
							<AntTab onClick={routeHome} label="Home" />
							<Typography className={classes.brand} variant="h6">CheapPhones</Typography>
					</AntTabs>
					<Typography className={classes.padding} />
				</div>
			</div>
		</div>
	);
}
