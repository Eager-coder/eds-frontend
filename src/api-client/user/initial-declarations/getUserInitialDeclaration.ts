'use client';

import { QuestionType } from '@/api-client/admin/initial-declarations/questions/createQuestion';
import { DeclarationUserDto, UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';
import { fetchClient } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

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
	user: DeclarationUserDto;
	createdBy: DeclarationUserDto;
	responsible: DeclarationUserDto;
	userName: string;
	declarationId: number;
	declarationName: string;
	creationDate: string;
	status: UIDStatus;
	message: string;
	questionsWithAnswers: UIDQuestoinWithAnswresDto[];
};

export const getUserInitialDeclaration = async (userId: number): Promise<UIDResponse | null> => {
	const response = await fetchClient(`/declaration-answers/${userId}`);

	if (response.status === 404) return null;
	if (!response.ok) {
		throw new Error(await response.json());
	}
	return await response.json();
};

export function useUserInitialDeclaration({ userId, enabled = false }: { userId?: number; enabled: boolean }) {
	return useQuery({
		queryKey: ['userInitialDeclaration', userId],
		queryFn: () => getUserInitialDeclaration(userId!),
		enabled: enabled && !!userId
	});
}
