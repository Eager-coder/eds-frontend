'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import {
	getInitialDeclarationById,
	GetInitialDeclarationByIdResponse,
	useGetInitialDeclarationById
} from '@/api-client/admin/initial-declarations/getInitialDeclarationById';

function formatDeclId(id: number) {
	return id.toString().padStart(5, '0');
}

function formatDate(iso: string) {
	const d = new Date(iso);
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const year = d.getFullYear();
	const hour = d.getHours();
	const min = d.getMinutes().toString().padStart(2, '0');
	return `${month}/${day}/${year} ${hour}:${min}`;
}

import { CreateQuestionDialog } from './CreateQuestionDialog';
import { Question } from './Question';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { activateInitialDeclaration } from '@/api-client/admin/initial-declarations/activateInitialDeclaration';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
export default function QuestionCreatePage() {
	const router = useRouter();
	const params = useParams();
	const declarationId = Number(params.id);

	const { isLoading: authLoading, user } = useUser();
	const { isLoading, data: declaration, refetch } = useGetInitialDeclarationById(Number(params.id));
	// questions state
	const [questions, setQuestions] = useState<GetInitialDeclarationByIdResponse['questions']>([]);
	const [loading, setLoading] = useState(true);

	const getInidtialDeclaration = useCallback(async () => {
		setLoading(true);
		const response = await getInitialDeclarationById(declarationId);
		setQuestions(response.questions);
		setLoading(false);
	}, [declarationId]);

	// fetch questions
	useEffect(() => {
		getInidtialDeclaration();
	}, [getInidtialDeclaration]);

	const handleActivate = async () => {
		await activateInitialDeclaration(declarationId);
		await refetch();
	};

	// auth guard
	if (authLoading) {
		return <div className="p-4 text-center">Loading...</div>;
	}
	if (isLoading) {
		return <div className="p-4 text-center">Loading...</div>;
	}
	if (!user) {
		router.push('/login');
		return null;
	}

	return (
		<div className="w-full flex-1 space-y-6 bg-zinc-50 p-6">
			<div>
				<Link className="flex" href="/admin/initial-declarations">
					<ChevronLeft />
					Back
				</Link>
			</div>
			<div className="space-y-3 border border-zinc-300 bg-white p-4">
				<h1 className="text-xl font-bold text-zinc-700">Initial declaration #{declaration?.id}</h1>
				<h2 className="text-lg font-bold text-zinc-700">Declaration name: {declaration?.name}</h2>
				<h2 className="text-lg font-bold text-zinc-700">
					Created on: {declaration ? formatDate(declaration.creationDate) : '—'}
				</h2>
				<h2 className="text-lg font-bold text-zinc-700">
					Created by: {declaration?.createdBy.firstname + ' ' + declaration?.createdBy.lastname}
				</h2>
				<h2 className="text-lg font-bold text-zinc-700">
					Status:{' '}
					{declaration?.isActive ? (
						<Badge className="rounded-md bg-[#DDAF53] px-2 py-0 text-base text-white">Active </Badge>
					) : (
						<Badge className="rounded-md bg-gray-500 px-2 py-0 text-base text-white">Inactive </Badge>
					)}
				</h2>
				{declaration?.isActive === false && <Button onClick={handleActivate}>Activate</Button>}
			</div>
			<div className="space-y-4 border border-zinc-300 p-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Questions</h2>
				</div>

				{/* Questions List */}
				<div className="space-y-5 bg-white">
					{loading ? (
						<div className="py-4 text-center">Loading questions...</div>
					) : questions.length ? (
						<div className="space-y-4">
							{questions.map((q, index) => (
								<Question key={index} q={q} onUpdate={getInidtialDeclaration} />
							))}
						</div>
					) : (
						<div className="text-gray-500">No questions yet.</div>
					)}
					<CreateQuestionDialog onAdded={getInidtialDeclaration} orderNumber={questions.length + 1 || 1} />
				</div>
			</div>
		</div>
	);
}
