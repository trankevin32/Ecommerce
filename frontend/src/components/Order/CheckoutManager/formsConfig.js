export const shippingConfig = [
	{
		id: 'firstname',
		label: 'First Name',
		class: 'halfWidth',
		validatorsAndAppearance: {
			required: true,
			disabled: false,
		},
	},
	{
		id: 'lastname',
		label: 'Last Name',
		class: 'halfWidth',
		validatorsAndAppearance: {
			required: true,
			disabled: false,
		},
	},
	{
		id: 'address1',
		label: 'Address 1',
		class: 'fullWidth',
		validatorsAndAppearance: {
			required: true,
			multiline: true,
			disabled: false,
		},
	},
	{
		id: 'address2',
		label: 'Address 2',
		class: 'fullWidth',
		validatorsAndAppearance: {
			multiline: true,
			disabled: false,
		},
	},
	{
		id: 'city',
		label: 'City',
		class: 'fullWidth',
		validatorsAndAppearance: {
			required: true,
			multiline: true,
			disabled: false,
		},
	},
	{
		id: 'state',
		label: 'State',
		class: 'fullWidth',
		inputType: 'select',
		menuItems: {
			AL: 'Alabama',
			AK: 'Alaska',
			AS: 'American Samoa',
			AZ: 'Arizona',
			AR: 'Arkansas',
			CA: 'California',
			CO: 'Colorado',
			CT: 'Connecticut',
			DE: 'Delaware',
			DC: 'District Of Columbia',
			FM: 'Federated States Of Micronesia',
			FL: 'Florida',
			GA: 'Georgia',
			GU: 'Guam',
			HI: 'Hawaii',
			ID: 'Idaho',
			IL: 'Illinois',
			IN: 'Indiana',
			IA: 'Iowa',
			KS: 'Kansas',
			KY: 'Kentucky',
			LA: 'Louisiana',
			ME: 'Maine',
			MH: 'Marshall Islands',
			MD: 'Maryland',
			MA: 'Massachusetts',
			MI: 'Michigan',
			MN: 'Minnesota',
			MS: 'Mississippi',
			MO: 'Missouri',
			MT: 'Montana',
			NE: 'Nebraska',
			NV: 'Nevada',
			NH: 'New Hampshire',
			NJ: 'New Jersey',
			NM: 'New Mexico',
			NY: 'New York',
			NC: 'North Carolina',
			ND: 'North Dakota',
			MP: 'Northern Mariana Islands',
			OH: 'Ohio',
			OK: 'Oklahoma',
			OR: 'Oregon',
			PW: 'Palau',
			PA: 'Pennsylvania',
			PR: 'Puerto Rico',
			RI: 'Rhode Island',
			SC: 'South Carolina',
			SD: 'South Dakota',
			TN: 'Tennessee',
			TX: 'Texas',
			UT: 'Utah',
			VT: 'Vermont',
			VI: 'Virgin Islands',
			VA: 'Virginia',
			WA: 'Washington',
			WV: 'West Virginia',
			WI: 'Wisconsin',
			WY: 'Wyoming',
		},
		validatorsAndAppearance: {
			required: true,
			disabled: false,
		},
	},
	{
		id: 'zipcode',
		label: 'Zipcode',
		class: 'fullWidth',
		validatorsAndAppearance: {
			disabled: false,
		},
	},
];

export const billingConfig = [
	{
		id: 'firstname',
		label: 'First Name',
		class: 'halfWidth',
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		id: 'lastname',
		label: 'Last Name',
		class: 'halfWidth',
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		id: 'address1',
		label: 'Address 1',
		class: 'fullWidth',
		validatorsAndAppearance: {
			required: true,
			multiline: true,
		},
	},
	{
		id: 'address2',
		label: 'Address 2',
		class: 'fullWidth',
		validatorsAndAppearance: {
			multiline: true,
		},
	},
	{
		id: 'city',
		label: 'City',
		class: 'fullWidth',
		validatorsAndAppearance: {
			required: true,
			multiline: true,
		},
	},
	{
		id: 'state',
		label: 'State',
		class: 'fullWidth',
		inputType: 'select',
		menuItems: {
			AL: 'Alabama',
			AK: 'Alaska',
			AS: 'American Samoa',
			AZ: 'Arizona',
			AR: 'Arkansas',
			CA: 'California',
			CO: 'Colorado',
			CT: 'Connecticut',
			DE: 'Delaware',
			DC: 'District Of Columbia',
			FM: 'Federated States Of Micronesia',
			FL: 'Florida',
			GA: 'Georgia',
			GU: 'Guam',
			HI: 'Hawaii',
			ID: 'Idaho',
			IL: 'Illinois',
			IN: 'Indiana',
			IA: 'Iowa',
			KS: 'Kansas',
			KY: 'Kentucky',
			LA: 'Louisiana',
			ME: 'Maine',
			MH: 'Marshall Islands',
			MD: 'Maryland',
			MA: 'Massachusetts',
			MI: 'Michigan',
			MN: 'Minnesota',
			MS: 'Mississippi',
			MO: 'Missouri',
			MT: 'Montana',
			NE: 'Nebraska',
			NV: 'Nevada',
			NH: 'New Hampshire',
			NJ: 'New Jersey',
			NM: 'New Mexico',
			NY: 'New York',
			NC: 'North Carolina',
			ND: 'North Dakota',
			MP: 'Northern Mariana Islands',
			OH: 'Ohio',
			OK: 'Oklahoma',
			OR: 'Oregon',
			PW: 'Palau',
			PA: 'Pennsylvania',
			PR: 'Puerto Rico',
			RI: 'Rhode Island',
			SC: 'South Carolina',
			SD: 'South Dakota',
			TN: 'Tennessee',
			TX: 'Texas',
			UT: 'Utah',
			VT: 'Vermont',
			VI: 'Virgin Islands',
			VA: 'Virginia',
			WA: 'Washington',
			WV: 'West Virginia',
			WI: 'Wisconsin',
			WY: 'Wyoming',
		},
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		id: 'zipcode',
		label: 'Zipcode',
		class: 'fullWidth',
		validatorsAndAppearance: {},
	},
];

export const paymentConfig = [
	{
		id: 'name',
		label: 'Name on Card',
		class: 'fullWidth',
		inputType: 'none',
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		id: 'cardnumber',
		label: 'Card Number',
		class: 'fullWidth',
		inputType: 'none',
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		id: 'expirationdate',
		label: 'Expiration Date',
		class: 'halfWidth',
		inputType: 'date',
		inputType: 'none',
		validatorsAndAppearance: {
			required: true,
		},
	},
	{
		inputType: 'card',
		validatorsAndAppearance: {},
	},
	{
		id: 'cvv',
		label: 'Security Code',
		class: 'halfWidth',
		inputType: 'none',
		validatorsAndAppearance: {
			required: true,
		},
	},
];
