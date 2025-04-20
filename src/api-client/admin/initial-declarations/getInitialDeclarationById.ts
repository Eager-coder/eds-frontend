'use client';

import { client } from '@/lib/client';
import { QuestionType } from './questions/createQuestion';
import { GetUsersResponse } from '../getUsers';
import { useEffect, useState } from 'react';

export type InitialDeclarationAdditionalOptionDto = {
	id: number;
	optionId: number;
	description: {
		en: string;
		ru: string;
		kz: string;
	};
	isRequired: boolean;
	isDeleted: boolean;
};

export type InitialDeclarationQuestionOptionDto = {
	id: number;
	questionId: number;
	description: {
		ru: string;
		en: string;
		kz: string;
	};
	additionalAnswerDescription: string | null;
	multipleAdditionalAnswers: boolean;
	isConflict: boolean;
	isDeleted: boolean;
	additionalOption: InitialDeclarationAdditionalOptionDto[];
};

export type InitialDeclarationQuestionDto = {
	id: number;
	orderNumber: number;
	declarationId: number;
	description: {
		ru: string;
		en: string;
		kz: string;
	};
	questionType: QuestionType;
	note: {
		ru: string;
		en: string;
		kz: string;
	} | null;
	isRequired: boolean;
	isDeleted: boolean;
	options: InitialDeclarationQuestionOptionDto[];
};
export type InitialDeclarationDto = {
	id: number;
	name: string;
	creationDate: string;
	activationDate: string | null;
	isActive: boolean;
	isDeleted: boolean;
	createdBy: GetUsersResponse;
	questions: InitialDeclarationQuestionDto[];
};
export type GetInitialDeclarationByIdResponse = InitialDeclarationDto;

export const getInitialDeclarationById = async (id: number) => {
	const response = await client.get<GetInitialDeclarationByIdResponse>(`/initial-declarations/${id}`);
	return response.data;
};

export function useGetInitialDeclarationById(id: number) {
	const [data, setData] = useState<GetInitialDeclarationByIdResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		getInitialDeclarationById(id)
			.then((res) => {
				if (!cancelled) setData(res);
			})
			.catch((err) => {
				console.error('Failed to load declaration:', err);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [id]);

	return { data, isLoading };
}
