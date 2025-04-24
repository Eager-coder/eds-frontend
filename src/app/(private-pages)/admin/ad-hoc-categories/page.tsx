'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
	useGetAdHocCategories,
	AD_HOC_CATEGORIES,
	AdHocCategoryDto
} from '@/api-client/admin/ad-hoc-categories/getAdHocCategories';
import { createAdHocCategory } from '@/api-client/admin/ad-hoc-categories/createAdHocCategory';
import { deleteAdHocCategory } from '@/api-client/admin/ad-hoc-categories/deleteAdHocCategory';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	AD_HOC_STATEMENTS,
	AdHocStatementDto,
	useGetAdHocStatements
} from '@/api-client/admin/ad-hoc-statements/getAdHocStatements';
import { creaetAdHocStatement } from '@/api-client/admin/ad-hoc-statements/createAdHocStatement';
import { deleteAdHocStatement } from '@/api-client/admin/ad-hoc-statements/deleteAdHocStatement';

export default function AdHocCategoriesPage() {
	const router = useRouter();
	const { user, isLoading: authLoading } = useUser();

	// --- Categories ---
	const {
		data: categories = [],
		isLoading: catLoading,
		isError: catError,
		error: catErrorObj
	} = useGetAdHocCategories({ enabled: !!user, queryKey: ['AD_HOC_CATEGORIES'] });
	const createCatMut = useMutation<AdHocCategoryDto, Error, { description: { en: string; ru: string; kz: string } }>({
		mutationFn: createAdHocCategory,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: AD_HOC_CATEGORIES });
			setCatForm({ en: '', ru: '', kz: '' });
		}
	});
	const deleteCatMut = useMutation<void, Error, number>({
		mutationFn: deleteAdHocCategory,
		onSuccess: () => qc.invalidateQueries({ queryKey: AD_HOC_CATEGORIES })
	});
	const [catForm, setCatForm] = useState({ en: '', ru: '', kz: '' });

	// --- Statements ---
	const {
		data: stmts = [],
		isLoading: stmtLoading,
		isError: stmtError,
		error: stmtErrorObj
	} = useGetAdHocStatements({ enabled: !!user, queryKey: ['AD_HOC_STATEMENTS'] });
	const createStmtMut = useMutation<
		AdHocStatementDto,
		Error,
		{ description: { en: string; ru: string; kz: string } }
	>({
		mutationFn: creaetAdHocStatement,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: AD_HOC_STATEMENTS });
			setStmtForm({ en: '', ru: '', kz: '' });
		}
	});
	const deleteStmtMut = useMutation<void, Error, number>({
		mutationFn: deleteAdHocStatement,
		onSuccess: () => qc.invalidateQueries({ queryKey: AD_HOC_STATEMENTS })
	});
	const [stmtForm, setStmtForm] = useState({ en: '', ru: '', kz: '' });

	const qc = useQueryClient();

	// redirect if not auth’d
	useEffect(() => {
		if (!authLoading && !user) router.push('/login');
	}, [authLoading, user, router]);

	if (authLoading || catLoading || stmtLoading) {
		return <div className="p-6 text-center">Loading…</div>;
	}
	if (!user) return null;

	function handleCatChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCatForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	}
	function handleStmtChange(e: React.ChangeEvent<HTMLInputElement>) {
		setStmtForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	}
	function submitCategory(e: FormEvent) {
		e.preventDefault();
		createCatMut.mutate({ description: { en: catForm.en, ru: catForm.ru, kz: catForm.kz } });
	}
	function submitStatement(e: FormEvent) {
		e.preventDefault();
		createStmtMut.mutate({ description: { en: stmtForm.en, ru: stmtForm.ru, kz: stmtForm.kz } });
	}

	return (
		<div className="w-full max-w-3xl flex-1 space-y-8 p-6">
			<h1 className="text-2xl font-semibold">Ad Hoc Categories & Statements</h1>

			{/* --- CATEGORY SECTION --- */}
			<section className="space-y-4">
				<h2 className="text-xl font-medium">Categories</h2>

				{/* Create Category */}
				<form onSubmit={submitCategory} className="space-y-3 border border-zinc-200 p-4">
					<h2 className="text-lg font-medium">Create a new Category</h2>

					{['en', 'ru', 'kz'].map((lang) => (
						<div key={lang} className="flex flex-col gap-1">
							<Label className="text-sm text-zinc-500" htmlFor={`cat-${lang}`}>
								{lang.toUpperCase()}
							</Label>
							<Input
								id={`cat-${lang}`}
								name={lang}
								value={catForm[lang as keyof typeof catForm]}
								onChange={handleCatChange}
								className="rounded-sm border border-zinc-300"
								required
							/>
						</div>
					))}
					<Button
						type="submit"
						disabled={createCatMut.isPending}
						className="mt-2 cursor-pointer rounded-sm bg-[#DDAF53] text-white hover:bg-amber-600"
					>
						{createCatMut.isPending ? 'Creating…' : 'Create Category'}
					</Button>
					{createCatMut.isError && <p className="text-red-500">{createCatMut.error.message}</p>}
				</form>

				{/* List Categories */}
				<h2 className="mt-8 text-xl font-medium">Existing categories</h2>
				<div className="max-h-64 space-y-2 overflow-y-auto">
					{catError ? (
						<p className="text-red-500">Failed: {catErrorObj?.message}</p>
					) : categories.length === 0 ? (
						<p>No categories found.</p>
					) : (
						categories.map((c) => (
							<div
								key={c.id}
								className="flex items-center justify-between rounded border border-zinc-200 bg-white p-4"
							>
								<div>
									<p className="font-medium">ID: {c.id}</p>
									<p>EN: {c.description.en}</p>
									<p>RU: {c.description.ru}</p>
									<p>KZ: {c.description.kz}</p>
								</div>
								<Button
									variant="destructive"
									size="sm"
									disabled={deleteCatMut.isPending}
									onClick={() => deleteCatMut.mutate(c.id)}
								>
									Delete
								</Button>
							</div>
						))
					)}
				</div>
			</section>

			{/* --- STATEMENT SECTION --- */}
			<section className="space-y-4">
				<h2 className="text-xl font-medium">Agreement Statements</h2>

				{/* Create Statement */}
				<form onSubmit={submitStatement} className="space-y-3 border border-zinc-200 bg-white p-4">
					{['en', 'ru', 'kz'].map((lang) => (
						<div key={lang} className="flex flex-col gap-1">
							<Label className="text-sm text-zinc-500" htmlFor={`stmt-${lang}`}>
								{lang.toUpperCase()}
							</Label>
							<Input
								id={`stmt-${lang}`}
								name={lang}
								value={stmtForm[lang as keyof typeof stmtForm]}
								onChange={handleStmtChange}
								className="rounded-sm border border-zinc-300"
								required
							/>
						</div>
					))}
					<Button
						type="submit"
						disabled={createStmtMut.isPending}
						className="mt-2 cursor-pointer rounded-sm bg-[#DDAF53] text-white hover:bg-amber-600"
					>
						{createStmtMut.isPending ? 'Creating…' : 'Create Statement'}
					</Button>
					{createStmtMut.isError && <p className="text-red-500">{createStmtMut.error.message}</p>}
				</form>

				{/* List Statements */}
				<h2 className="mt-8 text-xl font-medium">Existing Statements</h2>

				<div className="max-h-64 space-y-2 overflow-y-auto">
					{stmtError ? (
						<p className="text-red-500">Failed: {stmtErrorObj?.message}</p>
					) : stmts.length === 0 ? (
						<p>No statements found.</p>
					) : (
						stmts.map((s) => (
							<div
								key={s.id}
								className="flex items-center justify-between rounded border border-zinc-200 bg-white p-4"
							>
								<div>
									<p className="font-medium">ID: {s.id}</p>
									<p>EN: {s.description.en}</p>
									<p>RU: {s.description.ru}</p>
									<p>KZ: {s.description.kz}</p>
								</div>
								<Button
									variant="destructive"
									size="sm"
									disabled={deleteStmtMut.isPending}
									onClick={() => deleteStmtMut.mutate(s.id)}
								>
									Delete
								</Button>
							</div>
						))
					)}
				</div>
			</section>
		</div>
	);
}
