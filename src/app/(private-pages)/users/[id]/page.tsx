'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useUser as useAuth } from '@/context/UserContext';
import { useUser as useUserQuery } from '@/api-client/admin/getUser';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserInitialDeclaration } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createUID } from '@/api-client/manager/createUID';

export default function Page() {
	const router = useRouter();
	const params = useParams();
	const userId = Number(params.id);

	// authentication state
	const { user: me, isLoading: authLoading } = useAuth();

	// fetch the target user only once we're sure "me" exists
	const {
		data: userData,
		isLoading: userLoading,
		isError
	} = useUserQuery(userId, { enabled: !!me, queryKey: ['user', userId] });

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
	if (authLoading || userLoading) {
		return (
			<div className="space-y-3 p-6 text-center">
				<Skeleton className="w-full" />
				<Skeleton className="w-full" />
				<Skeleton className="w-full" />
				<Skeleton className="w-full" />
			</div>
		);
	}

	const createUserDeclaration = async () => {
		await createUID(userId);
		router.push(`/manager/initial-declarations/${userData?.id}`);
	};

	// guard while redirecting
	if (!me) {
		return null;
	}

	// handle missing user
	if (isError || !userData) {
		return <div className="p-6 text-center text-red-500">User not found.</div>;
	}

	return (
		<div className="max-w-2xl p-6">
			<button
				onClick={() => router.back()}
				className="mb-6 inline-flex items-center text-blue-600 hover:underline"
			>
				<ArrowLeft className="mr-1 h-5 w-5" />
				Back to users
			</button>
			<div className="flex gap-4">
				<div className="rounded-lg bg-white p-6 shadow">
					<h2 className="mb-4 text-2xl font-semibold">
						{userData.firstname} {userData.middlename && `${userData.middlename} `} {userData.lastname}
					</h2>

					<dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-gray-700 sm:grid-cols-2">
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
								<span className="inline-block rounded-full border px-2 py-1 text-sm">
									{userData.role}
								</span>
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

				<div>
					{userDeclarationLoading ? (
						<>Loading...</>
					) : (
						<>
							{userDeclaration ? (
								<Button className="cursor-pointer bg-[#DDAF53] p-[-100px] hover:bg-green-500">
									<Link className="p-[10px]" href={`/manager/initial-declarations/${userData.id}`}>
										Initial Declaration
									</Link>
								</Button>
							) : (
								<Button onClick={createUserDeclaration} className="bg-[#000000] hover:bg-green-400">
									Create Initial Declaration
								</Button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
