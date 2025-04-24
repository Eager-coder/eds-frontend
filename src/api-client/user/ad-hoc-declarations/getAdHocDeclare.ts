import { DeclarationUserDto } from '@/api-client/manager/getUserInitialDeclarations';
import { fetchClient } from '@/lib/client';
import { useQuery, QueryKey } from '@tanstack/react-query';

export enum AdHocStatus {
	'CREATED' = 'CREATED',
	'SENT_FOR_APPROVAL' = 'SENT_FOR_APPROVAL',
	'ACTUAL_CONFLICT' = 'ACTUAL_CONFLICT',
	'PERCEIVED_CONFLICT' = 'PERCEIVED_CONFLICT',
	'NO_CONFLICT' = 'NO_CONFLICT',
	'APPROVED' = 'APPROVED'
}

export type AdHocDeclareDto = {
	id: number;
	user: DeclarationUserDto;
	createAt: string;
	isDeleted: boolean;
	responsible: DeclarationUserDto;
	createdBy: DeclarationUserDto;
	status: AdHocStatus;
	hasAgreedWithStatements: true;
	statementAgreementStatuses: {
		ru: string;
		en: string;
		kz: string;
	}[];
	answers: {
		categoryId: number;
		categoryDescription: {
			ru: string;
			en: string;
			kz: string;
		};
		otherCategory: string | null;
		conflictDescription: string;
	}[];
};

export async function getAdHocDeclare(id: number): Promise<AdHocDeclareDto> {
	const response = await fetchClient(`/adhoc-declarations/declare/declarations/${id}`);
	if (!response.ok) {
		throw new Error(await response.json());
	}
	return await response.json();
}

export const adHocDeclareKeys = {
	all: ['adHocDeclare'] as const,
	detail: (id: number) => [...adHocDeclareKeys.all, id] as const
};

export function useGetAdHocDeclare(id: number) {
	return useQuery({
		queryKey: adHocDeclareKeys.detail(id),
		queryFn: () => getAdHocDeclare(id),
		enabled: !!id
	});
}
