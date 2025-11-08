import axios from 'axios';
import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';

export const api = axios.create({
	baseURL: browser ? PUBLIC_API_URL : PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const status = error.response.status;

			switch (status) {
				case 401:
					console.error('Unauthorized access - please login');
					break;
				case 400:
					console.error('Bad request:', error.response.data);
					break;
				case 500:
					console.error('Server error');
					break;
			}
		} else if (error.request) {
			console.error('Network error - no response from server');
		}

		return Promise.reject(error);
	}
);
