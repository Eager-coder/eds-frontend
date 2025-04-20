'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { getUsers, GetUsersResponse } from '@/api-client/admin/getUsers';

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
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Users</h1>

			{/* search + filters */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
				<input
					type="text"
					placeholder="Search…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-1/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
				/>

				<div className="flex space-x-2 mt-3 sm:mt-0">
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"
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
						className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"
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
							{[
								'ID',
								'First name',
								'Last name',
								'Email',
								'Department',
								'Position',
								'Role',
								'Reg. date',
								'Profile link'
							].map((h) => (
								<th
									key={h}
									className="px-4 py-2 text-left border-b border-gray-200 text-sm font-medium"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filtered.map((u) => (
							<tr key={u.id} className="hover:bg-gray-50">
								<td className="px-4 py-3 border-b">{u.id}</td>
								<td className="px-4 py-3 border-b">{u.firstname}</td>
								<td className="px-4 py-3 border-b">{u.lastname}</td>
								<td className="px-4 py-3 border-b">{u.email}</td>
								<td className="px-4 py-3 border-b">{u.department}</td>
								<td className="px-4 py-3 border-b">{u.position}</td>
								<td className="px-4 py-3 border-b">
									<span className="inline-block px-2 py-1 text-sm border rounded-full">{u.role}</span>
								</td>
								<td className="px-4 py-3 border-b">
									{new Date(u.registrationDate).toLocaleDateString()}
								</td>
								<td className="px-4 py-3 border-b">
									<Link href={`/users/${u.id}`} passHref>
										<ArrowUpRight className="w-5 h-5 hover:text-blue-600" />
									</Link>
								</td>
							</tr>
						))}
						{filtered.length === 0 && (
							<tr>
								<td colSpan={9} className="text-center py-6 text-gray-500 italic">
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
