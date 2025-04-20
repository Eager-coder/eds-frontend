// src/components/declaration/QuestionDisplay.tsx
import React from 'react';
import { UIDQuestoinWithAnswresDto } from '@/api-client/user/initial-declarations/getUserInitialDeclaration';
import { YesNoQuestion } from './YesNoQuestion';
import { AgreeQuestion } from './AgreeQuestion';
import { OpenEndedQuestion } from './OpenEndedQuestion';

interface Props {
	question: UIDQuestoinWithAnswresDto;
	questionIndex: number;
}

export function QuestionDisplay({ question, questionIndex }: Props) {
	switch (question.questionType) {
		case 'YES_NO':
			return <YesNoQuestion question={question} questionIndex={questionIndex} />;
		case 'AGREE':
			return <AgreeQuestion question={question} questionIndex={questionIndex} />;
		case 'OPEN_ENDED':
			return <OpenEndedQuestion question={question} questionIndex={questionIndex} />;
		default:
			console.warn(`Unsupported question type: ${question.questionType}`);
			return <div className="text-red-500">Unsupported question type: {question.questionType}</div>;
	}
}
