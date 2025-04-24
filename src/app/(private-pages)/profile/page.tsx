'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useUser as useAuth, useUser } from '@/context/UserContext';
import { useUser as useUserQuery } from '@/api-client/admin/getUser';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserInitialDeclaration } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createUID } from '@/api-client/manager/createUID';
import { log } from 'console';

export default function Page() {
	const { user, isLoading } = useUser();
	const { logout } = useUser();

	const router = useRouter();
	const params = useParams();
	const userId = Number(user?.id);

	// authentication state
	const { user: me, isLoading: authLoading } = useAuth();

	// fetch the target user only once we're sure "me" exists

	const { data: userDeclaration, isLoading: userDeclarationLoading } = useUserInitialDeclaration({
		userId,
		enabled: !!me
	});
	// redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !me) {
			router.push('/login');
		}
	}, [authLoading, me, router]);

	// show skeleton when auth or data is loading
	// if (authLoading || userLoading) {
	// 	return (
	// 		<div className="space-y-3 p-6 text-center">
	// 			<Skeleton className="w-full" />
	// 			<Skeleton className="w-full" />
	// 			<Skeleton className="w-full" />
	// 			<Skeleton className="w-full" />
	// 		</div>
	// 	);
	// }

	return (
		<div className="max-w-2xl p-6">
			<div className="mb-6 flex items-center justify-between"></div>
			<div className="flex flex-col rounded-lg bg-white p-6 shadow">
				<h1 className="mb-3 text-3xl font-semibold">My Profile</h1>
				<h2 className="mb-4 text-xl font-semibold">
					{user?.firstname} {user?.middlename && `${user?.middlename} `} {user?.lastname}
				</h2>

				<dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-gray-700 sm:grid-cols-2">
					<div>
						<dt className="text-sm text-gray-500">ID</dt>
						<dd className="mt-1">{user?.id}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Email</dt>
						<dd className="mt-1">{user?.email}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Department</dt>
						<dd className="mt-1">{user?.department}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Position</dt>
						<dd className="mt-1">{user?.position}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Role</dt>
						<dd className="mt-1">
							<span className="inline-block rounded-full border px-2 py-1 text-sm">{user?.role}</span>
						</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Active</dt>
						<dd className="mt-1">{user?.isActive ? 'Yes' : 'No'}</dd>
					</div>

					<div>
						<dt className="text-sm text-gray-500">Deleted</dt>
						<dd className="mt-1">{user?.isDeleted ? 'Yes' : 'No'}</dd>
					</div>

					<div className="sm:col-span-2">
						<dt className="text-sm text-gray-500">Registered on</dt>
						<dd className="mt-1">
							{user?.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}
						</dd>
					</div>
				</dl>
				<div className="mt-auto flex justify-end">
					<Button
						className="cursor-pointer rounded-sm bg-[#DDAF53] text-white hover:bg-amber-600"
						onClick={logout}
					>
						Logout
					</Button>
				</div>
			</div>
		</div>
	);
}
