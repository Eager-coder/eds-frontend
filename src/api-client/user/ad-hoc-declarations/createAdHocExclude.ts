import { DeclarationUserDto, UIDStatus } from '@/api-client/manager/getUserInitialDeclarations';
import { fetchClient } from '@/lib/client';
import { AdHocDeclareDto, AdHocStatus } from './getAdHocDeclare';

export type CreateAdHocExcludeRequest = {
	userId: number;
	initialDeclarationId: number | null;
	userAdHocDeclareId: number | null;
	excludeReason: string;
	hasAgreedWithStatements: boolean;
};

export type AdHocExcludeDto = {
	id: number;
	user: DeclarationUserDto;
	createdBy: DeclarationUserDto;
	responsible: DeclarationUserDto;
	userInitialDeclaration: {
		id: number;
		user: DeclarationUserDto;
		declarationId: number;
		declarationTitle: string;
		creationDate: string;
		status: UIDStatus;
		responsible: DeclarationUserDto;
		createdBy: DeclarationUserDto;
		responsibleName: string;
		isDeleted: boolean;
	} | null;
	userAdHocDeclare: AdHocDeclareDto | null;
	excludeReason: string;
	createdAt: string;
	status: AdHocStatus;
	isDeleted: boolean;
	isConfirmed: boolean;
	hasAgreedWithStatements: boolean;
	agreedStatements: {
		ru: string;
		en: string;
		kz: string;
	}[];
};

export const createAdHocExclude = async (data: CreateAdHocExcludeRequest): Promise<AdHocExcludeDto> => {
	const { excludeReason, hasAgreedWithStatements, initialDeclarationId, userAdHocDeclareId } = data;
	const body = {
		initialDeclarationId,
		userAdHocDeclareId,
		excludeReason,
		hasAgreedWithStatements
	};
	const response = await fetchClient(`/adhoc-declarations/exclude/${data.userId}`, {
		body: JSON.stringify(body),
		method: 'POST'
	});

	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
};
