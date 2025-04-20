'use client';

import { QuestionType } from '@/api-client/admin/initial-declarations/questions/createQuestion';
import { fetchClient } from '@/lib/client';
import { useEffect, useState } from 'react';

export type UIDAdditionalAnswerDto = {
	additionalAnswerId: number;
	answer: string;
};

export type UIDAdditionalAnswerGroupDto = {
	orderIndex: number;
	answers: UIDAdditionalAnswerDto[];
};

export type UIDAdditionalAnswerQuestionDto = {
	id: number;
	description: {
		en: string;
		kz: string;
		ru: string;
	};
	isRequired: boolean;
};

export type UIDAdditionalAnswersDto = {
	questions: UIDAdditionalAnswerQuestionDto[];
	answers: UIDAdditionalAnswerGroupDto[];
};

export type UIDOptionWithAnswersDto = {
	id: number;
	description: {
		ru: string;
		en: string;
		kz: string;
	};
	additionalAnswerDescription: {
		ru: string;
		en: string;
		kz: string;
	};
	multipleAdditionalAnswers: true;
	isConflict: true;
	isAnswered: true;
	answer: string | null;
	hasConflict: true;
	additionalAnswers: UIDAdditionalAnswersDto;
};

export type UIDQuestoinWithAnswresDto = {
	id: number;
	orderNumber: number;
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
	};
	isRequired: true;
	optionsWithAnswers: UIDOptionWithAnswersDto[];
};

export type UIDResponse = {
	userDeclarationId: number;
	userId: number;
	userName: string;
	declarationId: number;
	declarationName: string;
	creationDate: string;
	status: string;
	message: string;
	questionsWithAnswers: UIDQuestoinWithAnswresDto[];
};

export const getUserInitialDeclaration = async (userId: number): Promise<UIDResponse> => {
	const response = await fetchClient(`/declaration-answers/${userId}`);

	if (!response.ok) {
		throw new Error(await response.json());
	}
	return await response.json();
};

export function useUserInitialDeclaration({ userId, enabled }: { userId: number; enabled: boolean }) {
	const [data, setData] = useState<UIDResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(enabled);

	useEffect(() => {
		let canceled = false;

		if (!enabled) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		getUserInitialDeclaration(userId)
			.then((res) => {
				if (!canceled) setData(res);
			})
			.catch((err) => {
				console.error('Failed to fetch user declaration:', err);
			})
			.finally(() => {
				if (!canceled) setIsLoading(false);
			});

		return () => {
			canceled = true;
		};
	}, [enabled, userId]);

	return { data, isLoading };
}
