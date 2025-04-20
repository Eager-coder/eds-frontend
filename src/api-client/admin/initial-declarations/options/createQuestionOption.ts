import { client } from '@/lib/client';
import { InitialDeclarationQuestionOptionDto } from '../getInitialDeclarationById';

export type CreateQuestionOptionRequest = {
	questionId: number;
	description: {
		en: string;
		ru: string;
		kz: string;
	};
	additionalAnswerDescription: {
		en: string;
		ru: string;
		kz: string;
	} | null;
	multipleAdditionalAnswers: boolean;
	isConflict: boolean;
};

export const createQuestionOption = async (
	data: CreateQuestionOptionRequest
): Promise<InitialDeclarationQuestionOptionDto> => {
	const response = await client.post('/initial-declarations/options', data);
	return response.data;
};
