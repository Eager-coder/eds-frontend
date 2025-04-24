'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useManagementPlans } from '@/api-client/manager/management-plans/getManegementPlans';

export default function Page() {
	const router = useRouter();
	const { user, isLoading: authLoading } = useUser();
	const {
		data: plans = [],
		isLoading: plansLoading,
		isError,
		error
	} = useManagementPlans({ enabled: !!user, queryKey: ['managementPlans'] });

	// redirect if not logged in
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [authLoading, user, router]);

	if (authLoading || plansLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) {
		return null; // redirecting
	}
	if (isError) {
		return <div className="p-6 text-center text-red-500">Error loading plans: {(error as Error).message}</div>;
	}

	return (
		<div className="w-full max-w-3xl flex-1 space-y-6 p-6">
			<h1 className="text-2xl font-semibold">Management Plans</h1>

			{plans.length === 0 ? (
				<p className="text-gray-600">You have no management plans.</p>
			) : (
				<ul className="space-y-4">
					{plans.map((plan) => (
						<li
							key={plan.id}
							className="rounded-sm border border-zinc-200 bg-white p-4 transition hover:bg-zinc-50"
						>
							<Link href={`/manager/management-plans/view/${plan.id}`} className="block space-y-1">
								<p>
									<span className="font-medium">Plan ID:</span> {plan.id}
								</p>
								<p>
									<span className="font-medium">Status:</span> {plan.status.toLowerCase()}
								</p>
								<p>
									<span className="font-medium">Created on:</span>{' '}
									{new Date(plan.creationDate).toLocaleString()}
								</p>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
