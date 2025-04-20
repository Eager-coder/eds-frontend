'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { getUsers, GetUsersResponse } from '@/api-client/admin/getUsers';

export default function Page() {
	const router = useRouter();
	const params = useParams(); // { id: string }
	const userId = Number(params.id);

	const { isLoading: authLoading, user: me } = useUser();
	console.log('me', me);
	const [userData, setUserData] = useState<GetUsersResponse | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUsers()
			.then((all) => {
				const found = all.find((u) => u.id === userId) ?? null;
				if (!found) {
					// not found → go back to list
					router.back();
				} else {
					setUserData(found);
				}
			})
			.finally(() => setLoading(false));
	}, [userId, router]);

	if (authLoading || loading) {
		return <div className="p-6 text-center">Loading…</div>;
	}

	if (!me) {
		router.push('/login');
		return null;
	}

	if (!userData) {
		return <div className="p-6 text-center text-red-500">User not found.</div>;
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<button
				onClick={() => router.back()}
				className="inline-flex items-center text-blue-600 hover:underline mb-6"
			>
				<ArrowLeft className="w-5 h-5 mr-1" />
				Back to users
			</button>

			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-2xl font-semibold mb-4">
					{userData.firstname} {userData.middlename && `${userData.middlename} `}
					{userData.lastname}
				</h2>

				<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
					<div>
						<dt className="text-sm text-gray-500">ID</dt>
						<dd className="mt-1">{userData.id}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Email</dt>
						<dd className="mt-1">{userData.email}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Department</dt>
						<dd className="mt-1">{userData.department}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Position</dt>
						<dd className="mt-1">{userData.position}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Role</dt>
						<dd className="mt-1">
							<span className="inline-block px-2 py-1 text-sm border rounded-full">{userData.role}</span>
						</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Active</dt>
						<dd className="mt-1">{userData.isActive ? 'Yes' : 'No'}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Deleted</dt>
						<dd className="mt-1">{userData.isDeleted ? 'Yes' : 'No'}</dd>
					</div>

					<div className="sm:col-span-2">
						<dt className="text-sm text-gray-500">Registered on</dt>
						<dd className="mt-1">{new Date(userData.registrationDate).toLocaleDateString()}</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
