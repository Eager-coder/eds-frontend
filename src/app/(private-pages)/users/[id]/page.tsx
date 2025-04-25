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
			<div className="space-y-3 p-6">
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
			</div>
		);
	}

	const createUserDeclaration = async () => {
		const result = await createUID(userId);

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
		<div className="w-full flex-1 bg-white p-6">
			<div className="max-w-5xl">
				<button
					onClick={() => router.back()}
					className="mb-8 inline-flex cursor-pointer items-center text-[#DDAF53] hover:underline"
				>
					<ArrowLeft className="mr-1 h-5 w-5" />
					Back to users
				</button>

				<div className="mb-6 border-b border-gray-200 pb-4">
					<h1 className="text-3xl font-semibold text-gray-900">User Profile</h1>
				</div>

				<div className="flex flex-col gap-6 md:flex-row">
					<div className="border border-gray-200 bg-white p-6 shadow-sm md:w-2/3">
						<h2 className="mb-6 text-2xl font-semibold text-gray-800">
							{userData.firstname} {userData.middlename && `${userData.middlename} `} {userData.lastname}
						</h2>

						<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">ID</div>
								<div className="mt-1 text-gray-700">{userData.id}</div>
							</div>

							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">Email</div>
								<div className="mt-1 text-gray-700">{userData.email}</div>
							</div>

							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">Department</div>
								<div className="mt-1 text-gray-700">{userData.department}</div>
							</div>

							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">Position</div>
								<div className="mt-1 text-gray-700">{userData.position}</div>
							</div>

							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">Role</div>
								<div className="mt-1">
									<span className="inline-block rounded border border-gray-300 bg-gray-50 px-3 py-1 text-gray-700">
										{userData.role}
									</span>
								</div>
							</div>

							<div>
								<div className="text-sm font-medium text-gray-500 uppercase">Status</div>
								<div className="mt-1 flex items-center space-x-4">
									<div>
										<span className="text-sm text-gray-700">Active:</span>{' '}
										<span className={userData.isActive ? 'text-green-600' : 'text-red-600'}>
											{userData.isActive ? 'Yes' : 'No'}
										</span>
									</div>
									<div>
										<span className="text-sm text-gray-700">Deleted:</span>{' '}
										<span className={userData.isDeleted ? 'text-red-600' : 'text-green-600'}>
											{userData.isDeleted ? 'Yes' : 'No'}
										</span>
									</div>
								</div>
							</div>

							<div className="col-span-2">
								<div className="text-sm font-medium text-gray-500 uppercase">Registered on</div>
								<div className="mt-1 text-gray-700">
									{new Date(userData.registrationDate).toLocaleDateString()}
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col space-y-4 md:w-1/3">
						<div className="border border-gray-200 bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-xl font-medium text-gray-800">Declaration Status</h3>

							{userDeclarationLoading ? (
								<div className="flex h-12 items-center justify-center">
									<div className="h-5 w-5 animate-spin rounded-full border-t-2 border-b-2 border-[#DDAF53]"></div>
									<span className="ml-2 text-gray-600">Loading...</span>
								</div>
							) : (
								<div className="mt-2">
									{userDeclaration ? (
										<Button
											className="w-full border-0 bg-[#DDAF53] px-6 py-3 text-white hover:bg-[#C79D48]"
											style={{ borderRadius: 0 }}
										>
											<Link href={`/manager/initial-declarations/${userData.id}`}>
												View Initial Declaration
											</Link>
										</Button>
									) : (
										<Button
											onClick={createUserDeclaration}
											className="w-full border-0 bg-[#DDAF53] px-6 py-3 text-white hover:bg-gray-800"
											style={{ borderRadius: 0 }}
										>
											Create Initial Declaration
										</Button>
									)}
								</div>
							)}
						</div>

						<div className="border border-gray-200 bg-white p-6 shadow-sm">
							<h3 className="mb-4 text-xl font-medium text-gray-800">Quick Actions</h3>
							<div className="flex flex-col space-y-2">
								<Button
									className="w-full border border-[#DDAF53] bg-white px-4 py-2 text-[#DDAF53] hover:bg-gray-50"
									style={{ borderRadius: 0 }}
								>
									Edit User
								</Button>
								<Button
									className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
									style={{ borderRadius: 0 }}
								>
									Reset Password
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
