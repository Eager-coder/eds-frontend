// src/schemas/declarationAnswersSchema.ts
import { z } from 'zod';

// Schema for a single answer within an additional answer group
const additionalAnswerSchema = z.object({
	additionalAnswerId: z.number(),
	answer: z.string().min(1, 'This field is required') // Assuming all additional answers are required text
});

// Schema for a group of additional answers (potentially repeatable)
const additionalAnswerGroupSchema = z.object({
	answers: z.array(additionalAnswerSchema)
});

// Schema for the answer to a single option within a main question
export const answerSchema = z.object({
	optionId: z.number(),
	// We'll handle isAnswered/answer based on question type logic,
	// so make them optional here and refine later if needed, or handle in transform
	isAnswered: z.boolean().nullable().optional(),
	answer: z.string().nullable().optional(),
	additionalAnswers: z.array(additionalAnswerGroupSchema).optional() // Array of groups
});

// Main schema for the entire form submission
export const declarationAnswersSchema = z.object({
	// We'll structure the form state differently, so the top-level 'answers'
	// array will be constructed during submission.
	// Instead, we'll validate individual question answers within the form structure.
	// Let's define a structure closer to how RHF will manage it:
	questions: z.array(
		z.object({
			questionId: z.number(),
			questionType: z.enum(['YES_NO', 'AGREE', 'OPEN_ENDED']),
			// For YES_NO: store the selected optionId or null
			selectedOptionId: z.number().nullable().optional(),
			// For AGREE: store the boolean state
			isAgreed: z.boolean().nullable().optional(),
			// For OPEN_ENDED: store answers per option
			openEndedAnswers: z
				.array(
					z.object({
						optionId: z.number(),
						answer: z.string().optional() // Make optional initially, validate conditionally if needed
					})
				)
				.optional(),
			// Store additional answers nested under the specific option that triggered them
			options: z.array(
				z.object({
					optionId: z.number(),
					additionalAnswers: z.array(additionalAnswerGroupSchema).optional()
				})
			)
		})
	)
});

export type DeclarationAnswersFormValues = z.infer<typeof declarationAnswersSchema>;

// Helper type for a single question in the form values
export type QuestionFormValue = DeclarationAnswersFormValues['questions'][number];
