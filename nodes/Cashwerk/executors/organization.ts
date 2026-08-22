import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import {
	cashwerkApiRequest,
	cashwerkApiUploadFile,
	cleanCollection,
	encodeParam,
	getOrganizationId,
	requireId,
} from '../GenericFunctions';

const SENSITIVE_ORG_KEYS = [
	'members',
	'roles',
	'licenses',
	'founder',
	'bankAccounts',
	'stripeCustomerId',
	'leitwegId',
	'taxNumber',
	'vatId',
	'note',
];

function sanitizeOrganization(org: IDataObject): IDataObject {
	for (const key of SENSITIVE_ORG_KEYS) {
		delete org[key];
	}
	return org;
}

export async function executeOrganization(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	const orgId = await getOrganizationId.call(this);

	if (operation === 'get') {
		const result = await cashwerkApiRequest.call(
			this,
			'GET',
			`/organization/${encodeParam(orgId)}`,
		);
		return sanitizeOrganization(result as IDataObject);
	}
	if (operation === 'createSector') {
		// POST /organization/{orgId}/sector/create
		const body: IDataObject = {
			color: this.getNodeParameter('color', i),
			name: this.getNodeParameter('name', i),
			...cleanCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
		};
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/organization/${encodeParam(orgId)}/sector/create`,
			body,
		);
	}

	if (operation === 'updateSector') {
		// PATCH /organization/{orgId}/sector/{id}/update
		const body = cleanCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/organization/${encodeParam(orgId)}/sector/${encodeParam(requireId(this, 'id', i))}/update`,
			body,
		);
	}

	if (operation === 'deleteBranch') {
		// DELETE /organization/{orgId}/delete/branch/{branchId}
		return cashwerkApiRequest.call(
			this,
			'DELETE',
			`/organization/${encodeParam(orgId)}/delete/branch/${encodeParam(requireId(this, 'branchId', i))}`,
		);
	}

	if (operation === 'createBranch') {
		// POST /organization/{orgId}/create/branch
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'address',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/organization/${encodeParam(orgId)}/create/branch`,
			body,
		);
	}

	if (operation === 'inviteUser') {
		// POST /organization/{orgId}/invite
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'address',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/organization/${encodeParam(orgId)}/invite`,
			body,
		);
	}

	if (operation === 'setSectorMembers') {
		// POST /organization/{orgId}/sector/{id}/members
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'userIds',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/organization/${encodeParam(orgId)}/sector/${encodeParam(requireId(this, 'id', i))}/members`,
			body,
		);
	}

	if (operation === 'updateHeadquarters') {
		// PATCH /organization/{orgId}/update/headquarters
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/organization/${encodeParam(orgId)}/update/headquarters`,
			body,
		);
	}

	if (operation === 'uploadLogo') {
		// POST /organization/{orgId}/logo
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		return cashwerkApiUploadFile.call(
			this,
			`/organization/${encodeParam(orgId)}/logo`,
			i,
			binaryPropertyName,
		);
	}
}
