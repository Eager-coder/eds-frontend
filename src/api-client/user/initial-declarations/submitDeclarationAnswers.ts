import { client, fetchClient } from '@/lib/client';

export type SubmitAdditionalAnswerDto = {
	additionalAnswerId: number;
	answer: string;
};

export type SubmitAdditionalAnswerGroupDto = {
	answers: SubmitAdditionalAnswerDto[];
};

export type SubmitAnswerDto = {
	optionId: number;
	isAnswered?: boolean | null;
	answer?: string | null;
	additionalAnswers?: SubmitAdditionalAnswerGroupDto[];
};

export type SubmitDeclarationAnswersRequest = {
	answers: SubmitAnswerDto[];
};

export const submitDeclarationAnswers = async (data: SubmitDeclarationAnswersRequest): Promise<void> => {
	const response = await fetchClient(`/declaration-answers`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error('Failed to submit answers');
	}
};
