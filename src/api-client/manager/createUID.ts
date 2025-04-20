// hooks/useCreateUID.ts

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { fetchClient } from '@/lib/client';

/**
 * The shape of whatever the server returns when you create a UID.
 * Adjust fields to match your API response.
 */
export type CreateUIDResponse = {
	id: number;
	userId: number;
	createdAt: string;
	// …other fields…
};

/**
 * POST /initial-declarations/answers
 */
export async function createUID(userId: number): Promise<CreateUIDResponse> {
	const response = await fetchClient('/initial-declarations/answers', {
		method: 'POST',
		body: JSON.stringify({ userId })
	});

	if (!response.ok) {
		throw new Error('Failed to create initial declaration UID');
	}

	return response.json();
}
