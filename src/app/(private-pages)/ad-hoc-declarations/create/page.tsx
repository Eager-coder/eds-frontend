'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useGetAdHocCategories } from '@/api-client/admin/ad-hoc-categories/getAdHocCategories';
import { useGetAdHocStatements } from '@/api-client/admin/ad-hoc-statements/getAdHocStatements';
import {
	createAdHocDeclare,
	CreateAdHocDeclareRequest
} from '@/api-client/user/ad-hoc-declarations/createAdHocDeclare';
import {
	createAdHocExclude,
	CreateAdHocExcludeRequest
} from '@/api-client/user/ad-hoc-declarations/createAdHocExclude';
import { useUser } from '@/context/UserContext';
import { X } from 'lucide-react';
import { useGetAdHocDeclares } from '@/api-client/user/ad-hoc-declarations/getAdHocDeclares';
import { useUserInitialDeclaration } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { formatDeclId } from '../../manager/initial-declarations/[id]/page';

type DecType = 'ad-hoc' | 'initial';

export default function AdHocDeclarationForm() {
	const router = useRouter();
	const { user } = useUser();

	// Mode: declare or exclude
	const [mode, setMode] = useState<'declare' | 'exclude' | null>(null);

	// Declare state
	const [conflicts, setConflicts] = useState<{ categoryId: number; detail: string }[]>([
		{ categoryId: 0, detail: '' }
	]);

	// Exclude state
	const [excludedId, setExcludedId] = useState<number | ''>('');
	const [excludeReason, setExcludeReason] = useState<string>('');

	// Agreements
	const [agreements, setAgreements] = useState<boolean[]>([]);

	// Data fetching
	const { data: categories, isPending, isError } = useGetAdHocCategories();
	const { data: statements } = useGetAdHocStatements();
	const { data: adHocDeclares } = useGetAdHocDeclares(user?.id);
	const { data: initialDeclaration } = useUserInitialDeclaration({
		userId: user?.id,
		enabled: !!user
	});

	// Determine availability of previous declarations
	const hasInitial = (initialDeclaration?.userDeclarationId || 0) > 0;
	const hasAdHoc = (adHocDeclares ?? []).length > 0;
	const hasPreviousDeclarations = hasInitial || hasAdHoc;

	// Initialize agreements once statements load
	useEffect(() => {
		if (statements) {
			setAgreements(statements.map(() => false));
		}
	}, [statements]);

	// Helpers: add/remove conflict blocks
	function addConflict() {
		setConflicts((prev) => [...prev, { categoryId: 0, detail: '' }]);
	}
	function removeConflict(idx: number) {
		setConflicts((prev) => prev.filter((_, i) => i !== idx));
	}

	// Build list of previous declarations
	const previousDeclarations: { type: DecType; id: number; name: string }[] = [
		...(hasInitial
			? [
					{
						type: 'initial' as DecType,
						id: initialDeclaration!.userDeclarationId,
						name: `DEC-${formatDeclId(initialDeclaration!.userDeclarationId)}`
					}
				]
			: []),
		...(hasAdHoc
			? adHocDeclares!.map((d) => ({
					type: 'ad-hoc' as DecType,
					id: d.id,
					name: `AD-HOC-${formatDeclId(d.id)}`
				}))
			: [])
	];

	// Form submission
	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!user) return;

		try {
			if (mode === 'declare') {
				const payload: CreateAdHocDeclareRequest = {
					hasAgreedWithStatements: true,
					answers: conflicts.map((c) => ({
						categoryId: c.categoryId,
						conflictDescription: c.detail,
						otherCategory: null
					}))
				};
				await createAdHocDeclare(user.id, payload);
				router.push('/ad-hoc-declarations');
			} else if (mode === 'exclude') {
				if (!hasPreviousDeclarations) return;
				const entry = previousDeclarations.find((d) => d.id === Number(excludedId))!;
				const payload: CreateAdHocExcludeRequest = {
					userId: user.id,
					initialDeclarationId: entry.type === 'initial' ? entry.id : null,
					userAdHocDeclareId: entry.type === 'ad-hoc' ? entry.id : null,
					excludeReason,
					hasAgreedWithStatements: true
				};
				await createAdHocExclude(payload);
				router.push('/ad-hoc-declarations');
			}
		} catch (err) {
			console.error('Submission error', err);
			// TODO: show a toast or error message
		}
	}

	// Validation
	const allAgreed = agreements.every((v) => v);
	const declareValid =
		mode === 'declare' &&
		conflicts.every((c) => c.categoryId > 0 && c.detail.trim() !== '') &&
		new Set(conflicts.map((c) => c.categoryId)).size === conflicts.length;
	const excludeValid =
		mode === 'exclude' && hasPreviousDeclarations && excludedId !== '' && excludeReason.trim() !== '';
	const canSubmit = allAgreed && (declareValid || excludeValid);

	if (isPending) return <div>Loading categories...</div>;
	if (isError) return <div>Error loading categories</div>;

	return (
		<div className="w-full max-w-2xl flex-1 space-y-6 p-6">
			<h1 className="text-2xl font-semibold">Ad Hoc Declaration</h1>
			<form onSubmit={handleSubmit} className="space-y-6 rounded border border-zinc-200 p-4">
				{/* Mode selection */}
				<div className="space-y-2 border-b border-zinc-200 pb-4">
					<div>
						<input
							type="radio"
							id="mode-declare"
							name="mode"
							checked={mode === 'declare'}
							onChange={() => setMode('declare')}
						/>{' '}
						<Label htmlFor="mode-declare" className="cursor-pointer text-base">
							I have conflict(s) of interest to declare
						</Label>
					</div>
					<div>
						<input
							type="radio"
							id="mode-exclude"
							name="mode"
							checked={mode === 'exclude'}
							onChange={() => setMode('exclude')}
							disabled={!hasPreviousDeclarations}
						/>{' '}
						<Label
							htmlFor="mode-exclude"
							className={`cursor-pointer text-base ${!hasPreviousDeclarations ? 'text-gray-400' : ''}`}
						>
							I want to exclude a previous declaration
						</Label>
						{!hasPreviousDeclarations && (
							<p className="mt-1 text-sm text-gray-500">No previous declarations available to exclude.</p>
						)}
					</div>
				</div>

				{/* Declare mode UI */}
				{mode === 'declare' && (
					<div className="space-y-4">
						{conflicts.map((conf, idx) => {
							const used = conflicts.map((c, i) => (i !== idx ? c.categoryId : -1));
							return (
								<div key={idx} className="relative rounded border border-zinc-200 p-4">
									{conflicts.length > 1 && (
										<button
											type="button"
											onClick={() => removeConflict(idx)}
											className="absolute top-2 right-2 text-red-500"
										>
											<X size={20} />
										</button>
									)}
									<Label>Conflict Category</Label>
									<select
										value={conf.categoryId}
										onChange={(e) => {
											const v = Number(e.target.value);
											setConflicts((prev) =>
												prev.map((c, i) => (i === idx ? { ...c, categoryId: v } : c))
											);
										}}
										className="mt-1 block w-full rounded border border-zinc-200 p-2"
									>
										<option value={0} disabled>
											Select category…
										</option>
										{categories!.map((cat) => (
											<option key={cat.id} value={cat.id} disabled={used.includes(cat.id)}>
												{cat.description.en}
											</option>
										))}
									</select>

									<Label className="mt-4">Describe the conflict</Label>
									<Textarea
										value={conf.detail}
										onChange={(e) => {
											const v = e.target.value;
											setConflicts((prev) =>
												prev.map((c, i) => (i === idx ? { ...c, detail: v } : c))
											);
										}}
										className="mt-1 w-full rounded border border-zinc-200 p-2"
										placeholder="Describe the conflict…"
									/>

									{idx === conflicts.length - 1 && (
										<Button variant="link" onClick={addConflict} className="mt-2">
											+ Add another conflict
										</Button>
									)}
								</div>
							);
						})}
					</div>
				)}

				{/* Exclude mode UI */}
				{mode === 'exclude' && (
					<div className="space-y-4">
						<Label>Select declaration to exclude</Label>
						<select
							value={excludedId}
							onChange={(e) => setExcludedId(Number(e.target.value) || '')}
							className="mt-1 block w-full rounded border border-zinc-200 p-2"
						>
							<option value="" disabled>
								Select declaration…
							</option>
							{previousDeclarations.map((d, i) => (
								<option key={i} value={d.id}>
									{d.name}
								</option>
							))}
						</select>

						<Label>Reason for exclusion</Label>
						<Textarea
							value={excludeReason}
							onChange={(e) => setExcludeReason(e.target.value)}
							className="mt-1 w-full rounded border border-zinc-200 p-2"
							placeholder="Explain why you want to exclude this declaration…"
						/>
					</div>
				)}

				{/* Agreements */}
				<div className="space-y-4 border-t border-zinc-200 pt-4">
					{statements?.map((st, i) => (
						<div key={i} className="flex items-start gap-4">
							<Checkbox
								id={`agreement-${i}`}
								checked={agreements[i]}
								className="relative top-2"
								onCheckedChange={(v) =>
									setAgreements((prev) => prev.map((a, j) => (j === i ? !!v : a)))
								}
							/>
							<Label htmlFor={`agreement-${i}`} className="text-base text-gray-700">
								{st.description.en}
							</Label>
						</div>
					))}
				</div>

				<Button type="submit" disabled={!canSubmit} className="bg-[#DDAF53] text-white hover:bg-amber-600">
					Submit Declaration
				</Button>
			</form>
		</div>
	);
}
