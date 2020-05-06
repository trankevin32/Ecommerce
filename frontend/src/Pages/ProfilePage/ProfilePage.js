import axios from 'axios';
import React from 'react';

import Signup from '../../components/Auth/Signup';

export default function ProfilePage(props) {
	const [user, setUser] = React.useState({});

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
	return <Signup user={{ ...user }} />;
}
