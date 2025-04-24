'use client';

import React, { useState, FormEvent } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { useGetManagementActions } from '@/api-client/admin/management-actions/getManagementActions';
import { createManagementAction } from '@/api-client/admin/management-actions/createManagementAction';
import { deleteManagementAction } from '@/api-client/admin/management-actions/deleteManagementAction';
import type { ManagementActionDto } from '@/api-client/admin/management-actions/getManagementActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
	const { user, isLoading: isUserLoading } = useUser();
	const { data: actions = [], isLoading: isActionsLoading, isError: isActionsError } = useGetManagementActions();

	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: createManagementAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['managementActions'] });
			setForm({ en: '', ru: '', kz: '' });
		}
	});

	const deleteMutation = useMutation({
		mutationFn: deleteManagementAction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['managementActions'] });
		}
	});

	const [form, setForm] = useState({ en: '', ru: '', kz: '' });

	if (isUserLoading || isActionsLoading) {
		return <div className="p-4 text-center">Loading…</div>;
	}

	if (!user) {
		// Redirect or show unauthorized message
		return <div className="p-4 text-center text-red-500">Unauthorized</div>;
	}

	if (isActionsError) {
		return <div className="p-4 text-center text-red-500">Failed to load actions.</div>;
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}

	function handleCreate(e: FormEvent) {
		e.preventDefault();
		createMutation.mutate({
			description: {
				en: form.en,
				ru: form.ru,
				kz: form.kz
			}
		});
	}

	function handleDelete(id: number) {
		if (confirm('Are you sure you want to delete this action?')) {
			deleteMutation.mutate(id);
		}
	}

	return (
		<div className="w-full flex-1 space-y-6 p-6">
			<h1 className="text-2xl font-semibold">Management Plan Actions</h1>

			{/* Create Form */}
			<form onSubmit={handleCreate} className="space-y-4 rounded-sm border border-zinc-200 p-4">
				<h2 className="text-lg font-medium">New Action</h2>

				<div className="">
					<div>
						<Label className="text-sm text-zinc-500">English</Label>
						<Input
							type="text"
							name="en"
							value={form.en}
							onChange={handleChange}
							className="mt-1 w-full rounded border border-zinc-300 px-2 py-1"
							required
						/>
					</div>
					<div>
						<Label className="text-sm text-zinc-500">Russian</Label>
						<Input
							type="text"
							name="ru"
							value={form.ru}
							onChange={handleChange}
							className="mt-1 w-full rounded border border-zinc-300 px-2 py-1"
							required
						/>
					</div>
					<div>
						<Label className="text-sm text-zinc-500">Kazakh</Label>
						<Input
							type="text"
							name="kz"
							value={form.kz}
							onChange={handleChange}
							className="mt-1 w-full rounded border border-zinc-300 px-2 py-1"
							required
						/>
					</div>
				</div>

				<Button
					type="submit"
					disabled={createMutation.isPending}
					className="cursor-pointer rounded bg-[#DDAF53] px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
				>
					{createMutation.isPending ? 'Creating…' : 'Create Action'}
				</Button>
				{createMutation.isError && (
					<p className="mt-2 text-sm text-red-500">{(createMutation.error as Error).message}</p>
				)}
			</form>

			{/* Actions List */}
			<div className="space-y-2">
				{actions.map((action: ManagementActionDto) => (
					<div
						key={action.id}
						className="flex items-center justify-between rounded-sm border border-zinc-300 px-4 py-2"
					>
						<div>
							<p className="mb-2">ID: {action.id}</p>
							<p className="text-zinc-700">EN: {action.description.en}</p>
							<p className="text-zinc-700">RU: {action.description.ru}</p>
							<p className="text-zinc-700">KZ: {action.description.kz}</p>
						</div>
						<button
							onClick={() => handleDelete(action.id)}
							disabled={deleteMutation.isPending}
							className="cursor-pointer rounded-sm bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:opacity-50"
						>
							Delete
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
