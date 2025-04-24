'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { getInitialDeclarations, GetInitialDeclarationsResponse } from '@/api-client/admin/getInitialDeclarations';
import { CreateInitialDeclarationDialog } from './CreateInitialDeclarationDialog';

export default function Page() {
	const router = useRouter();
	const { isLoading: authLoading, user } = useUser();

	// ─── ALL HOOKS ABOVE ──────────────────────────────────────────────────
	const [allDecls, setAllDecls] = useState<GetInitialDeclarationsResponse[]>([]);
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [deprecationSort, setDeprecationSort] = useState<'asc' | 'desc' | ''>('');
	const [creationSort, setCreationSort] = useState<'asc' | 'desc' | ''>('');

	useEffect(() => {
		getInitialDeclarations().then(setAllDecls);
	}, []);

	const activeDecls = useMemo(() => allDecls.filter((d) => d.isActive), [allDecls]);
	const historyDecls = useMemo(() => allDecls.filter((d) => !d.isActive), [allDecls]);
	const types = useMemo(() => Array.from(new Set(allDecls.map((d) => d.name))), [allDecls]);
	const filteredHistory = useMemo(() => {
		let arr = historyDecls;
		if (search) {
			const lc = search.toLowerCase();
			arr = arr.filter((d) => d.name.toLowerCase().includes(lc));
		}
		if (typeFilter) arr = arr.filter((d) => d.name === typeFilter);
		if (deprecationSort) {
			arr = [...arr].sort((a, b) =>
				deprecationSort === 'asc'
					? Date.parse(a.activationDate) - Date.parse(b.activationDate)
					: Date.parse(b.activationDate) - Date.parse(a.activationDate)
			);
		}
		if (creationSort) {
			arr = [...arr].sort((a, b) =>
				creationSort === 'asc'
					? Date.parse(a.creationDate) - Date.parse(b.creationDate)
					: Date.parse(b.creationDate) - Date.parse(a.creationDate)
			);
		}
		return arr;
	}, [historyDecls, search, typeFilter, deprecationSort, creationSort]);

	if (authLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) {
		router.push('/login');
		return null;
	}

	return (
		<div className="w-full flex-1 space-y-8 p-6">
			<div className="flex w-full justify-between">
				<h1 className="text-2xl font-semibold">Initial Declarations</h1>
				<CreateInitialDeclarationDialog onSubmit={() => getInitialDeclarations().then(setAllDecls)} />
			</div>

			{/* Active Declarations */}
			<section>
				<h2 className="mb-4 text-xl font-medium">Active Declarations</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full border-collapse border border-zinc-300">
						<thead className="bg-zinc-50">
							<tr className="border-zinc-300">
								{['ID', 'Type', 'Creation Date', 'Created by', 'Edit Link'].map((h) => (
									<th
										key={h}
										className="border-b border-zinc-300 px-4 py-2 text-left text-sm font-medium"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{activeDecls.length === 0 && (
								<tr className="border-zinc-300">
									<td colSpan={5} className="py-6 text-center text-gray-500 italic">
										No active declarations.
									</td>
								</tr>
							)}
							{activeDecls.map((d) => (
								<tr key={d.id} className="border-zinc-300 hover:bg-gray-50">
									<td className="border-b border-zinc-300 px-4 py-3">{d.id}</td>
									<td className="border-b border-zinc-300 px-4 py-3">{d.name}</td>
									<td className="border-b border-zinc-300 px-4 py-3">
										{new Date(d.creationDate).toLocaleDateString()}
									</td>
									<td className="border-b border-zinc-300 px-4 py-3">{`${d.createdBy.firstname} ${d.createdBy.lastname}`}</td>
									<td className="border-b border-zinc-300 px-4 py-3">
										<Link href={`/admin/initial-declarations/${d.id}`}>
											<ArrowUpRight className="h-5 w-5 hover:text-blue-600" />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Declarations history */}
			<section>
				<h2 className="mb-4 text-xl font-medium">Declarations history</h2>
				<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
					<input
						type="text"
						placeholder="Search…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full rounded border border-zinc-300 px-3 py-1.5 focus:ring focus:outline-none sm:w-1/4"
					/>
					<div className="mt-2 flex space-x-2 sm:mt-0">
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className="rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none"
						>
							<option value="">All Types</option>
							{types.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
						<select
							value={deprecationSort}
							onChange={(e) => setDeprecationSort(e.target.value as 'asc' | 'desc' | '')}
							className="rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none"
						>
							<option value="">Deprecation date</option>
							<option value="asc">Oldest first</option>
							<option value="desc">Newest first</option>
						</select>
						<select
							value={creationSort}
							onChange={(e) => setCreationSort(e.target.value as 'asc' | 'desc' | '')}
							className="rounded border border-zinc-300 px-3 py-2 focus:ring focus:outline-none"
						>
							<option value="">Creation date</option>
							<option value="asc">Oldest first</option>
							<option value="desc">Newest first</option>
						</select>
					</div>
				</div>

				<div className="max-h-96 overflow-x-auto overflow-y-auto">
					<table className="min-w-full border-collapse border border-zinc-200">
						<thead className="border-zinc-300 bg-gray-50">
							<tr className="border-zinc-300">
								{['ID', 'Type', 'Creation Date', 'Created by', 'Link'].map((h) => (
									<th
										key={h}
										className="border-b border-zinc-300 px-4 py-2 text-left text-sm font-medium"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filteredHistory.length === 0 && (
								<tr className="border-zinc-300">
									<td colSpan={7} className="py-6 text-center text-gray-500 italic">
										No declarations found.
									</td>
								</tr>
							)}
							{filteredHistory.map((d) => (
								<tr key={d.id} className="border-zinc-300 hover:bg-gray-50">
									<td className="border-b border-zinc-300 px-4 py-3">{d.id}</td>
									<td className="border-b border-zinc-300 px-4 py-3">{d.name}</td>
									<td className="border-b border-zinc-300 px-4 py-3">
										{new Date(d.creationDate).toLocaleDateString()}
									</td>
									<td className="border-b border-zinc-300 px-4 py-3">{`${d.createdBy.firstname} ${d.createdBy.lastname}`}</td>

									<td className="border-b border-zinc-300 px-4 py-3">
										<Link href={`/admin/initial-declarations/${d.id}`}>
											<ArrowUpRight className="h-5 w-5 hover:text-blue-600" />
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
