'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { getUsers, GetUsersResponse } from '@/api-client/admin/getUsers';
import { Input } from '@/components/ui/input';

export default function Page() {
	const router = useRouter();
	const { isLoading, user: me } = useUser();

	const [users, setUsers] = useState<GetUsersResponse[]>([]);
	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState('');
	const [deptFilter, setDeptFilter] = useState('');

	useEffect(() => {
		getUsers().then(setUsers);
	}, []);

	// **Move all hooks above these returns!**
	const roles = useMemo(() => Array.from(new Set(users.map((u) => u.role))), [users]);
	const depts = useMemo(() => Array.from(new Set(users.map((u) => u.department))), [users]);
	const filtered = useMemo(
		() =>
			users.filter((u) => {
				const hay = (
					u.firstname +
					' ' +
					u.lastname +
					' ' +
					u.email +
					' ' +
					u.department +
					' ' +
					u.position
				).toLowerCase();

				if (search && !hay.includes(search.toLowerCase())) return false;
				if (roleFilter && u.role !== roleFilter) return false;
				if (deptFilter && u.department !== deptFilter) return false;
				return true;
			}),
		[users, search, roleFilter, deptFilter]
	);

	if (isLoading) {
		return <div>Loading…</div>;
	}
	if (!me) {
		router.push('/login');
		return null;
	}

	return (
		<div className="w-full flex-1 p-6">
			<h1 className="mb-4 text-2xl font-semibold">Users</h1>

			{/* search + filters */}
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
				<Input
					type="text"
					placeholder="Search…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none sm:w-1/3"
				/>

				<div className="mt-3 flex space-x-2 sm:mt-0">
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none"
					>
						<option value="">All Roles</option>
						{roles.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>

					<select
						value={deptFilter}
						onChange={(e) => setDeptFilter(e.target.value)}
						className="rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none"
					>
						<option value="">All Departments</option>
						{depts.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* table */}
			<div className="overflow-x-auto">
				<table className="min-w-full border-collapse border border-gray-300">
					<thead>
						<tr className="bg-gray-50">
							{['ID', 'Full name', 'Email', 'Department', 'Position', 'Role', 'Reg. date'].map((h) => (
								<th
									key={h}
									className="border-b border-gray-200 px-4 py-2 text-left text-sm font-medium"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filtered.map((u) => (
							<tr
								key={u.id}
								onClick={() => router.push(`/users/${u.id}`)}
								className="cursor-pointer text-zinc-700 hover:bg-gray-50"
							>
								<td className="border-b px-4 py-3">{u.id}</td>
								<td className="border-b px-4 py-3">
									{u.firstname} {u.lastname}
								</td>
								<td className="border-b px-4 py-3">{u.email}</td>
								<td className="border-b px-4 py-3">{u.department}</td>
								<td className="border-b px-4 py-3">{u.position}</td>
								<td className="border-b px-4 py-3">
									<span className="inline-block rounded-full border px-2 py-1 text-sm">{u.role}</span>
								</td>
								<td className="border-b px-4 py-3">
									{new Date(u.registrationDate).toLocaleDateString()}
								</td>
							</tr>
						))}
						{filtered.length === 0 && (
							<tr>
								<td colSpan={9} className="py-6 text-center text-gray-500 italic">
									No users to display.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
