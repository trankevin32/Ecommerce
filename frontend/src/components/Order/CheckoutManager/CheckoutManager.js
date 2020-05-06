import 'date-fns';
import axios from 'axios';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { FormControl, Menu, Divider } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import FormHelperText from '@material-ui/core/FormHelperText';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import CreditCardInput from 'react-credit-card-input';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

import { updateUser } from '../../../actions/user-actions';
import { shippingConfig } from './formsConfig';
import { billingConfig } from './formsConfig';
import { paymentConfig } from './formsConfig';
import AuthContext from '../../../contexts/AuthContext';
import SimpleSnackbar from '../../../components/UI/Snackbar';

const useStyles = makeStyles((theme) => ({
	formRoot: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: 200,
		},
	},
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	halfWidth: {
		width: '47% !important',
	},
	fullWidth: {
		width: '97% !important',
		textAlign: 'left',
	},
	formPad: {
		padding: '25px',
		width: '100%',
	},
	gutterBottom: {
		marginBottom: '20px',
	},
	alignLeft: {
		textAlign: 'left',
	},
	marginBottom: {
		marginBottom: '25px',
	},
}));

function getSteps() {
	return ['Shipping Address', 'Billing Address', 'Payment Details', 'Review Order'];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return 'Please provide the shipping address for this order.';
		case 1:
			return 'Please provide the billing address for this order.';
		case 2:
			return 'Please provide the payment details.';
		case 3:
			return 'Review and confirm to place your order.';
		default:
			return 'Unknown step';
	}
}

function CheckoutManager(props) {
	const classes = useStyles();
	const [message, setMessage] = React.useState('');
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const nameRef = React.useRef();

	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const steps = getSteps();
	const getDeliveryDate = () => {
		let _date = new Date();
		let numberOfDaysToAdd = 2;
		_date.setDate(_date.getDate() + numberOfDaysToAdd);
		// var dd = _date.getDate();
		// var mm = _date.getMonth() + 1;
		// var y = _date.getFullYear();

		// let estimatedDate = dd + '/' + mm + '/' + y;

		let estimatedDate;
		let tempDate = _date.toString();
		let splitDate = tempDate.split(' ');
		estimatedDate = splitDate[1] + ' ' + splitDate[2] + ', ' + splitDate[3];

		return estimatedDate;
	};
	const [forms, setForms] = React.useState(['shipping', 'billing', 'payment']);
	const [formConfigs, setFormConfigs] = React.useState({
		shipping: [...shippingConfig],
		billing: [...billingConfig],
		payment: [...paymentConfig],
	});
	const [errors, setErrors] = React.useState({
		shipping: [],
		billing: [],
		payment: [],
	});
	const [formsData, setFormsData] = React.useState({
		user: '',
		cartId: props.cart._id,
		shipping: {
			firstname: '',
			lastname: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipcode: '',
		},
		billing: {
			firstname: '',
			lastname: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			zipcode: '',
		},
		payment: {
			name: '',
			cardnumber: '',
			expirationdate: '',
			cvv: '',
		},
		items: [...props.cart.items],
		totalamount: '',
		estimateddelivery: getDeliveryDate(),
	});

	const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

	const handleDateChange = (date, formTitle, inputId) => {
		helpSetFormsData(formTitle, inputId, date);
		setSelectedDate(date);
	};
	const [state, setState] = React.useState({
		shipping: {
			value: '',
		},
		billing: {
			value: '',
		},
	});

	const helpSetFormsData = (formTitle, inputId, value) => {
		setFormsData({
			...formsData,
			[formTitle]: {
				...formsData[formTitle],
				[inputId]: value,
			},
		});
	};
	const handleSelectChange = (event, formTitle, inputId) => {
		const stateVal = event.target.value;
		helpSetFormsData(formTitle, inputId, stateVal);
		setState({
			...state,
			[formTitle]: {
				value: stateVal,
			},
		});
	};
	const handleFormValueChange = (event, formTitle, inputId) => {
		const value = event.target.value;
		helpSetFormsData(formTitle, inputId, value);
	};

	const [user, setUser] = React.useState(null);
	React.useEffect(() => {
		axios
			.get('http://localhost:7000/auth/user-profile', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				},
			})
			.then((res) => {
				setUser(res.data.user);
			})
			.catch((err) => {
				console.log(err.response);
			});
	}, []);

	React.useEffect(() => {
		if (user) {
			let keys = Object.keys(user);
			let shippingData = {};
			console.log(user);
			keys.forEach((key) => {
				if (key.toLowerCase() !== 'password') shippingData[key.toLowerCase()] = user[key];
			});
			setFormsData({
				...formsData,
				user: user._id,
				shipping: {
					...formsData['shipping'],
					...shippingData,
				},
			});
			setState({
				...state,
				shipping: {
					value: shippingData.state,
				},
			});
		}
	}, [user]);

	const [card, setCard] = React.useState({
		cvc: '',
		expiry: '',
		focus: '',
		name: '',
		number: '',
	});

	const populateForm = (formTitle) => {
		return formConfigs[formTitle].map((input) => {
			if (!input.inputType) {
				return (
					<TextField
						key={input.id}
						className={classes[input.class]}
						id={input.id}
						label={input.label}
						value={formsData[formTitle][input.id]}
						onChange={(event) => handleFormValueChange(event, formTitle, input.id)}
						error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
						helperText={
							errors[formTitle].indexOf(input.id) > -1 ? 'Please fill out this field correctly' : ''
						}
						ref={input.id === 'name' ? nameRef : null}
						{...input.validatorsAndAppearance}
					/>
				);
			} else {
				if (input.inputType === 'select') {
					let menuItemsKeys = Object.keys(input.menuItems);

					return (
						<FormControl
							key={input.id}
							className={[classes.formControl, classes[input.class]].join(' ')}
							error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
							{...input.validatorsAndAppearance}
						>
							<InputLabel id="demo-simple-select-label">{input.label}</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={state[formTitle].value}
								onChange={(event) => handleSelectChange(event, formTitle, input.id)}
								helpertext={
									errors[formTitle].indexOf(input.id) > -1
										? 'Please fill out this field correctly'
										: ''
								}
							>
								{menuItemsKeys.map((mnKey) => (
									<MenuItem value={mnKey} key={mnKey}>
										{input.menuItems[mnKey]}
									</MenuItem>
								))}
							</Select>
							{errors[formTitle].indexOf(input.id) > -1 ? (
								<FormHelperText id="component-error-text">
									Please fill out this field correctly
								</FormHelperText>
							) : null}
						</FormControl>
					);
				} else if (input.inputType === 'date') {
					return (
						<MuiPickersUtilsProvider key={input.id} utils={DateFnsUtils}>
							<KeyboardDatePicker
								className={classes[input.class]}
								margin="normal"
								id="date-picker-dialog"
								label="Date picker dialog"
								format="MM/dd/yyyy"
								value={selectedDate}
								onChange={(date) => handleDateChange(date, formTitle, input.id)}
								error={errors[formTitle].indexOf(input.id) > -1 ? true : false}
								helperText={
									errors[formTitle].indexOf(input.id) > -1
										? 'Please fill out this field correctly'
										: ''
								}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
					);
				} else if (input.inputType === 'card') {
					return (
						<div id="PeymentForm">
							<Cards
								cvc={card.cvc}
								expiry={card.expiry}
								focus={card.focus}
								name={card.name}
								number={card.number}
							/>
							<form>
								<TextField
									key={'number'}
									className={classes['fullWidth']}
									id={'cardnumber'}
									label="Card Number"
									value={formsData[formTitle]['cardnumber']}
									onChange={(e) => {
										if (e.target.value.length <= 16) {
											setCard({
												...card,
												number: e.target.value.length <= 16 ? e.target.value : card.number,
											});
											handleFormValueChange(e, formTitle, 'cardnumber');
										}
									}}
									onFocus={() => setCard({ ...card, focus: 'number' })}
									error={errors[formTitle].indexOf('cardnumber') > -1 ? true : false}
									helperText={
										errors[formTitle].indexOf('cardnumber') > -1
											? 'Please fill out this field correctly'
											: ''
									}
									required
								/>
								<TextField
									key={'number'}
									className={classes['fullWidth']}
									id={'name'}
									label="Name"
									value={formsData[formTitle]['name']}
									onChange={(e) => {
										if (e.target.value.length <= 28) {
											setCard({
												...card,
												name: e.target.value,
											});
											handleFormValueChange(e, formTitle, 'name');
										}
									}}
									onFocus={() => setCard({ ...card, focus: 'name' })}
									error={errors[formTitle].indexOf('name') > -1 ? true : false}
									helperText={
										errors[formTitle].indexOf('name') > -1
											? 'Please fill out this field correctly'
											: ''
									}
									required
								/>
								<TextField
									key={'expiry'}
									className={classes['halfWidth']}
									id={'expiry'}
									type="number"
									label="Valid Thru"
									value={formsData[formTitle]['expirationdate']}
									onChange={(e) => {
										if (e.target.value.length >= 2) {
											let month = e.target.value[0] + e.target.value[1];
											if (month >= 1 && month <= 12) {
												if (e.target.value.length <= 4) {
													setCard({
														...card,
														expiry: e.target.value,
													});
													handleFormValueChange(e, formTitle, 'expirationdate');
												}
											} else {
												setCard({
													...card,
													expiry: '',
												});
											}
										} else {
											if (e.target.value.length <= 4) {
												setCard({
													...card,
													expiry: e.target.value,
												});
												handleFormValueChange(e, formTitle, 'expirationdate');
											}
										}
									}}
									onFocus={() => setCard({ ...card, focus: 'expiry' })}
									error={errors[formTitle].indexOf('expirationdate') > -1 ? true : false}
									helperText={
										errors[formTitle].indexOf('expirationdate') > -1
											? 'Please fill out this field correctly'
											: ''
									}
									required
								/>
								<TextField
									key={'cvv'}
									className={classes['halfWidth']}
									id={'cvv'}
									label="CVV"
									value={formsData[formTitle]['cvv']}
									onChange={(e) => {
										if (e.target.value.length <= 3) {
											setCard({
												...card,
												cvc: e.target.value,
											});
											handleFormValueChange(e, formTitle, 'cvv');
										}
									}}
									onFocus={() => setCard({ ...card, focus: 'cvv' })}
									error={errors[formTitle].indexOf('cvv') > -1 ? true : false}
									helperText={
										errors[formTitle].indexOf('cvv') > -1
											? 'Please fill out this field correctly'
											: ''
									}
									required
								/>
							</form>
						</div>
					);
				}
			}
		});
	};
	let formsJSX = forms.map((formTitle) => (
		<Container key={formTitle} className={classes.gutterBottom} maxWidth="sm">
			<Paper className={classes.formPad} variant="outlined">
				<form className={classes.formRoot} noValidate autoComplete="off">
					{populateForm(formTitle)}
				</form>
			</Paper>
		</Container>
	));
	const getAddress = (formTitle) => {
		return formsData[formTitle].address1 + ' ' + formsData[formTitle].state + ' ' + formsData[formTitle].zipcode;
	};
	const convert = (str) => {
		var date = new Date(str),
			mnth = ('0' + (date.getMonth() + 1)).slice(-2),
			day = ('0' + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join('-');
	};
	let shippingAddress = getAddress('shipping');
	let billingAddress = getAddress('billing');

	let orderSumamry = (
		<Container key="orderSummary" className={classes.gutterBottom} maxWidth="sm">
			<Paper className={classes.formPad} variant="outlined">
				<Typography className={classes.alignLeft} variant="h5" gutterBottom>
					Order Summary
				</Typography>
				{user ? (
					<div className={classes.alignLeft}>
						<Typography variant="button" gutterBottom>
							{user.Firstname + ' ' + user.Lastname}
						</Typography>
					</div>
				) : null}

				{formsData.items.map((item) => {
					return (
						<Typography key={item._id} className={classes.alignLeft} variant="body2">
							{item.product.productDescription + ' Qty:' + item.quantity + ' $' + item.product.price}
						</Typography>
					);
				})}
				<Typography className={classes.alignLeft} variant="body2">
					Free Shipping
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					Tax Free
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					Total Amount: ${formsData.totalamount}
				</Typography>
				<Divider gutterBottom />
				<Typography className={classes.alignLeft} variant="h6">
					Shipping Address
				</Typography>
				<Typography className={classes.alignLeft} variant="body2" gutterBottom>
					{shippingAddress}
				</Typography>
				<Divider gutterBottom />
				<Typography className={classes.alignLeft} variant="h6">
					Billing Address
				</Typography>
				<Typography className={classes.alignLeft} variant="body2" gutterBottom>
					{billingAddress}
				</Typography>
				<Divider gutterBottom />
				<Typography className={classes.alignLeft} variant="h6">
					Payment Details
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					{formsData['payment'].name}
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					{formsData['payment'].cardnumber}
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					{convert(formsData['payment'].expirationdate)}
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					{formsData['payment'].cvv}
				</Typography>
				<Divider gutterBottom />
				<Typography className={classes.alignLeft} variant="h6">
					Estimated Delivery
				</Typography>
				<Typography className={classes.alignLeft} variant="body2">
					{formsData.estimateddelivery}
				</Typography>
			</Paper>
		</Container>
	);
	formsJSX.push(orderSumamry);
	const getActiveForm = (activeStep) => {
		return formsJSX[activeStep];
	};

	const isStepOptional = (step) => {
		return false;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const isFormValidated = (activeStep) => {
		const formTitle = forms[activeStep];
		const errorInputs = [];
		let result = true;
		formConfigs[formTitle].forEach((input) => {
			if (input.validatorsAndAppearance.required) {
				if (formsData[formTitle][input.id]) {
					if (formsData[formTitle][input.id] === '') {
						result = false;
						errorInputs.push(input.id);
					}
				} else {
					result = false;
					errorInputs.push(input.id);
				}
			}
		});
		setErrors({
			...errors,
			[formTitle]: [...errorInputs],
		});
		return result;
	};
	const [orderPlaced, setOrderPlaced] = React.useState(false);
	const handleNext = () => {
		if (activeStep === 3) {
			axios
				.post(
					'http://localhost:7000/order/place-order',
					{
						...formsData,
					},
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + window.localStorage.getItem('token'),
						},
					}
				)
				.then((res) => {
					setOpen(true);
					setMessage('Order Placed');
					setOrderPlaced(true);
				})
				.catch((err) => {
					setOpen(true);
					setMessage('Order Places');
					setOrderPlaced(true);
				});
		} else if (isFormValidated(activeStep)) {
			if (activeStep === 1 || activeStep === 0) {
				let newSkipped = skipped;
				if (isStepSkipped(activeStep)) {
					newSkipped = new Set(newSkipped.values());
					newSkipped.delete(activeStep);
				}

				let _formTitle = forms[activeStep];
				let address2Verify = formsData[_formTitle].address1;
				let city2Verify = formsData[_formTitle].city;
				let state2Verify = formsData[_formTitle].state;
				let zipcode2Verify = formsData[_formTitle].zipcode;
				axios
					.get(
						'https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=<AddressValidateRequest USERID="021COMPA3753"><Revision>1</Revision><Address ID="0"><Address1>' +
							address2Verify +
							'</Address1><Address2></Address2><City>' +
							city2Verify +
							'</City><State>' +
							state2Verify +
							'</State><Zip5>' +
							zipcode2Verify +
							'</Zip5><Zip4/></Address></AddressValidateRequest>'
					)
					.then((res) => {
						let resultXML = res.data;
						let parser = new DOMParser();
						let xmlDoc = parser.parseFromString(resultXML, 'text/xml');
						let error = xmlDoc.getElementsByTagName('Error')[0];
						let description;
						let formTitle = _formTitle;
						if (error) {
							description = error.childNodes[2].innerHTML;
							if (description === 'Invalid City.  ') {
								setErrors({
									...errors,
									[formTitle]: ['city'],
								});
							} else {
								setErrors({
									...errors,
									[formTitle]: ['address1'],
								});
							}
							return Promise.reject(new Error('fail'));
						}

						return res;
					})
					.then((res) => {
						let resultXML = res.data;
						let parser = new DOMParser();
						let xmlDoc = parser.parseFromString(resultXML, 'text/xml');

						let updatedAddress = xmlDoc.getElementsByTagName('Address2')[0].innerHTML;
						let updatedZipcode = xmlDoc.getElementsByTagName('Zip5')[0].innerHTML;

						setFormsData({
							...formsData,
							[_formTitle]: {
								...formsData[_formTitle],
								address1: updatedAddress,
								zipcode: updatedZipcode,
							},
						});
						setActiveStep((prevActiveStep) => prevActiveStep + 1);
						setSkipped(newSkipped);
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				axios
					.get('http://localhost:7000/cart/get-total-price/' + props.cart._id)
					.then((res) => {
						setFormsData({
							...formsData,
							totalamount: res.data.totalAmount,
						});
					})
					.catch((err) => {
						console.log(err);
					});

				let newSkipped = skipped;
				if (isStepSkipped(activeStep)) {
					newSkipped = new Set(newSkipped.values());
					newSkipped.delete(activeStep);
				}
				setActiveStep((prevActiveStep) => prevActiveStep + 1);
				setSkipped(newSkipped);
			}
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};
	const routeHome = () => {
		props.history.push('/');
	};

	return (
		<div className={classes.root}>
			<SimpleSnackbar handleClose={handleClose} open={open} message={message} />
			<Container maxWidth="lg">
				<Stepper activeStep={activeStep}>
					{steps.map((label, index) => {
						const stepProps = {};
						const labelProps = {};
						if (isStepOptional(index)) {
							labelProps.optional = <Typography variant="caption">Optional</Typography>;
						}
						if (isStepSkipped(index)) {
							stepProps.completed = false;
						}
						return (
							<Step key={label} {...stepProps}>
								<StepLabel {...labelProps}>{label}</StepLabel>
							</Step>
						);
					})}
				</Stepper>
			</Container>
			<div>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed - you&apos;re finished
						</Typography>
						{getActiveForm(activeStep)}
						<Button onClick={handleReset} className={classes.button}>
							Reset
						</Button>
					</div>
				) : (
					<div>
						{!orderPlaced ? (
							<Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
						) : (
							<Typography variant="button">Order Successful</Typography>
						)}

						{getActiveForm(activeStep)}
						<div className={classes.marginBottom}>
							<Button
								disabled={activeStep === 0 || orderPlaced}
								onClick={handleBack}
								className={classes.button}
							>
								Back
							</Button>
							{isStepOptional(activeStep) && (
								<Button
									variant="contained"
									color="primary"
									onClick={handleSkip}
									className={classes.button}
								>
									Skip
								</Button>
							)}
							{!orderPlaced ? (
								<Button
									variant="contained"
									color="primary"
									onClick={handleNext}
									className={classes.button}
								>
									{activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={routeHome}
									className={classes.button}
								>
									Continue Shopping
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
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

const mapStateToProps = createSelector(productsSelector, userSelector, (products, user) => ({
	products,
	user,
}));

const mapActionsToProps = {
	onUpdateUser: updateUser,
};

export default connect(mapStateToProps, mapActionsToProps)(CheckoutManager);
