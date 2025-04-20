import { client } from '@/lib/client';

export enum QuestionType {
	'YES_NO' = 'YES_NO',
	'AGREE' = 'AGREE',
	'OPEN_ENDED' = 'OPEN_ENDED'
}
export type CreateInitialDeclarationQuestionRequest = {
	orderNumber: number;
	declarationId: number;
	description: {
		en: string;
		ru: string;
		kz: string;
	};
	questionType: QuestionType;
	note: {
		en: string;
		ru: string;
		kz: string;
	} | null;
	isRequired: boolean;
};

export type CreateInitialDeclarationQuestionResponse = {
	id: number;
	orderNumber: number;
	declarationId: number;
	description: {
		en: string;
		ru: string;
		kz: string;
	};
	questionType: QuestionType;
	note?: {
		en: string;
		ru: string;
		kz: string;
	};
	isRequired: boolean;
	isDeleted: boolean;
};

export const createInitialDeclarationQuestion = async (
	question: CreateInitialDeclarationQuestionRequest
): Promise<CreateInitialDeclarationQuestionResponse> => {
	const response = await client.post<CreateInitialDeclarationQuestionResponse>(
		'/initial-declarations/questions',
		question
	);
	return response.data;
};
