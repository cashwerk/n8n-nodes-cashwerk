import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import {
	cashwerkApiRequest,
	cashwerkApiRequestAllItems,
	cashwerkApiUploadFile,
	cleanCollection,
	encodeParam,
	getOrganizationId,
	parseJsonParam,
	requireId,
} from '../GenericFunctions';

const SENSITIVE_USER_KEYS = [
	'password',
	'salt',
	'sessionId',
	'salary',
	'bank',
	'taxData',
	'privatePhones',
	'note',
	'isOhRoot',
	'workTimeHistory',
];

const SENSITIVE_ROLE_KEYS = ['permissions'];

function sanitizeUser(user: IDataObject): IDataObject {
	for (const key of SENSITIVE_USER_KEYS) {
		delete user[key];
	}
	if (user.role && typeof user.role === 'object') {
		const role = user.role as IDataObject;
		for (const key of SENSITIVE_ROLE_KEYS) {
			delete role[key];
		}
	}
	if (user.license && typeof user.license === 'object') {
		const license = user.license as IDataObject;
		delete license.product;
	}
	return user;
}

function sanitizeUserResponse(data: unknown): unknown {
	if (Array.isArray(data)) {
		return data.map((item) => sanitizeUser(item as IDataObject));
	}
	if (data && typeof data === 'object') {
		const obj = data as IDataObject;
		if (Array.isArray(obj.result)) {
			obj.result = obj.result.map((item: unknown) => sanitizeUser(item as IDataObject));
			return obj;
		}
		return sanitizeUser(obj);
	}
	return data;
}

export async function executeUser(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		const result = await cashwerkApiRequest.call(
			this,
			'GET',
			`/users/${requireId(this, 'userId', i)}`,
		);
		return sanitizeUserResponse(result);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
		const result = await cashwerkApiRequestAllItems.call(
			this,
			'GET',
			'/users/search',
			{},
			{},
			limit,
		);
		return sanitizeUserResponse(result);
	}

	if (operation === 'getActive') {
		const orgId = await getOrganizationId.call(this);
		const result = await cashwerkApiRequest.call(
			this,
			'GET',
			'/users/active',
			{},
			{ organizationId: orgId },
		);
		return sanitizeUserResponse(result);
	}
	if (operation === 'create') {
		// POST /users/create
		const body: IDataObject = {
			address: parseJsonParam(this.getNodeParameter('address', i)),
			email: this.getNodeParameter('email', i),
			emailRepeat: this.getNodeParameter('emailRepeat', i),
			firstName: this.getNodeParameter('firstName', i),
			lastName: this.getNodeParameter('lastName', i),
			password: this.getNodeParameter('password', i),
			passwordRepeat: this.getNodeParameter('passwordRepeat', i),
			...cleanCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject, [
				'address',
			]),
		};
		return cashwerkApiRequest.call(this, 'POST', `/users/create`, body);
	}

	if (operation === 'delete') {
		// DELETE /users/{id}/delete
		return cashwerkApiRequest.call(
			this,
			'DELETE',
			`/users/${encodeParam(requireId(this, 'id', i))}/delete`,
		);
	}

	if (operation === 'activate') {
		// POST /users/{id}/activate
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/activate`,
		);
	}

	if (operation === 'archive') {
		// POST /users/{id}/archive
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/archive`,
		);
	}

	if (operation === 'updateAddress') {
		// POST /users/{id}/update-address
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'address',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-address`,
			body,
		);
	}

	if (operation === 'updateBirthPlace') {
		// POST /users/{id}/update-birth-place
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'birthPlace',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-birth-place`,
			body,
		);
	}

	if (operation === 'updateBirthdate') {
		// POST /users/{id}/update-birthdate
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-birthdate`,
			body,
		);
	}

	if (operation === 'updateBranch') {
		// POST /users/{id}/update-branch
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-branch`,
		);
	}

	if (operation === 'updateNationality') {
		// POST /users/{id}/update-nationality
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-nationality`,
		);
	}

	if (operation === 'updatePosition') {
		// POST /users/{id}/update-position
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-position`,
		);
	}

	if (operation === 'updateProfileData') {
		// PATCH /users/{id}/update-profile-data
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'branch',
			'phone',
			'sector',
		]);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-profile-data`,
			body,
		);
	}

	if (operation === 'updatePublicPhone') {
		// POST /users/{id}/update-public-phone
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, ['phone']);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-public-phone`,
			body,
		);
	}

	if (operation === 'updateSector') {
		// POST /users/{id}/update-sector
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-sector`,
		);
	}

	if (operation === 'updateSocialMedia') {
		// POST /users/{id}/update-social-media
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'socialMedia',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-social-media`,
			body,
		);
	}

	if (operation === 'updateTimezone') {
		// POST /users/{id}/update-timezone
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/users/${encodeParam(requireId(this, 'id', i))}/update-timezone`,
		);
	}

	if (operation === 'uploadAvatar') {
		// POST /users/avatar
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		return cashwerkApiUploadFile.call(this, `/users/avatar`, i, binaryPropertyName);
	}

	if (operation === 'uploadHeader') {
		// POST /users/header
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		return cashwerkApiUploadFile.call(this, `/users/header`, i, binaryPropertyName);
	}
}

export async function executeWorkTime(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/work-time/latest/by-user/${requireId(this, 'userId', i)}`,
		);
	}

	if (operation === 'forUser') {
		const body = this.getNodeParameter('options', i, {}) as IDataObject;
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/work-time/for-user/${requireId(this, 'workTimeId', i)}`,
			body,
		);
	}
	if (operation === 'update') {
		// PATCH /work-time/{workTimeId}/by-user/{id}
		const body = cleanCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject, [
			'workDays',
		]);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/work-time/${encodeParam(requireId(this, 'workTimeId', i))}/by-user/${encodeParam(requireId(this, 'id', i))}`,
			body,
		);
	}

	if (operation === 'delete') {
		// DELETE /work-time/{workTimeId}/by-user/{id}
		return cashwerkApiRequest.call(
			this,
			'DELETE',
			`/work-time/${encodeParam(requireId(this, 'workTimeId', i))}/by-user/${encodeParam(requireId(this, 'id', i))}`,
		);
	}

	if (operation === 'bulkAssign') {
		// POST /work-time/bulk-assign
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'userIds',
			'workDays',
		]);
		return cashwerkApiRequest.call(this, 'POST', `/work-time/bulk-assign`, body);
	}

	if (operation === 'updateVacationDays') {
		// PATCH /work-time/by-user/{id}/vacation-days
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'workDays',
		]);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/work-time/by-user/${encodeParam(requireId(this, 'id', i))}/vacation-days`,
			body,
		);
	}

	if (operation === 'updateWorkDays') {
		// PATCH /work-time/by-user/{id}/work-days
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'workDays',
		]);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/work-time/by-user/${encodeParam(requireId(this, 'id', i))}/work-days`,
			body,
		);
	}
}
