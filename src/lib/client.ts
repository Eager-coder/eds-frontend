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

	// Build headers
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('access_token');
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
	}

	// First attempt
	let response = await fetch(fullUrl, { ...init, headers });

	// If unauthorized, try refresh + retry once
	if (response.status === 401) {
		// grab refresh token
		const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

		if (!refreshToken) {
			window.location.href = '/login';
			return response;
		}

		// Refresh call (no auth header here)
		const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ refresh_token: refreshToken })
		});

		if (!refreshRes.ok) {
			// refresh failed
			window.location.href = '/login';
			return response;
		}

		const { access_token: newAccess, refresh_token: newRefresh } = await refreshRes.json();

		// store new tokens
		localStorage.setItem('access_token', newAccess);
		if (newRefresh) {
			localStorage.setItem('refresh_token', newRefresh);
		}

		// retry original with new access token
		headers.set('Authorization', `Bearer ${newAccess}`);
		response = await fetch(fullUrl, { ...init, headers });
	}

	return response;
}
