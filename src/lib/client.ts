'use client';

import axios from 'axios';

export const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: typeof window !== 'undefined' ? `Bearer ${localStorage?.getItem('access_token')}` : ''
	}
});

export async function fetchClient(url: string, init: RequestInit = {}): Promise<Response> {
	const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
	const fullUrl = `${API_BASE}${url}`;

	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('access_token');
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
	}

	let response = await fetch(fullUrl, { ...init, headers });

	if (response.status === 401 || response.status === 403) {
		const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

		if (!refreshToken) {
			window.location.href = '/login';
			return response;
		}

		const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ refresh_token: refreshToken })
		});
		console.log('here   ');
		if (!refreshRes.ok) {
			window.location.href = '/login';
			return response;
		}

		const { access_token: newAccess, refresh_token: newRefresh } = await refreshRes.json();

		localStorage.setItem('access_token', newAccess);
		if (newRefresh) {
			localStorage.setItem('refresh_token', newRefresh);
		}

		headers.set('Authorization', `Bearer ${newAccess}`);
		response = await fetch(fullUrl, { ...init, headers });
	}

	return response;
}
