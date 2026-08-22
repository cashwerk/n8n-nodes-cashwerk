import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import {
	cashwerkApiRequest,
	cashwerkApiUploadFile,
	cleanCollection,
	encodeParam,
	getOrganizationId,
	parseJsonParam,
	requireId,
} from '../GenericFunctions';

export async function executeDrive(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'get') {
		return cashwerkApiRequest.call(this, 'GET', `/drive/${requireId(this, 'driveId', i)}`);
	}

	if (operation === 'getAll') {
		const orgId = await getOrganizationId.call(this);
		const drives = await cashwerkApiRequest.call(
			this,
			'GET',
			'/drive/organization-possessed',
			{},
			{ organizationId: orgId },
		);
		if (!Array.isArray(drives)) return drives;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) return drives;
		const limit = this.getNodeParameter('limit', i) as number;
		return drives.slice(0, limit);
	}

	if (operation === 'search') {
		const driveId = requireId(this, 'driveId', i);
		const searchQuery = this.getNodeParameter('searchQuery', i) as string;
		return cashwerkApiRequest.call(this, 'GET', `/drive/${driveId}/search`, {}, { q: searchQuery });
	}

	if (operation === 'clear') {
		const driveId = requireId(this, 'driveId', i);
		await cashwerkApiRequest.call(this, 'DELETE', `/drive/${driveId}/trash/clear`);
		return { success: true, cleared: true, driveId: Number(driveId) };
	}

	if (operation === 'createFolder') {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = {
			name: this.getNodeParameter('name', i),
			...additionalFields,
		};
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/${requireId(this, 'driveId', i)}/create-folder`,
			body,
		);
	}

	if (operation === 'getContents') {
		const qs: IDataObject = {};
		const folderIdVal = this.getNodeParameter('folderId', i, 0) as number;
		if (folderIdVal) qs['folderId'] = folderIdVal;
		const limitVal = this.getNodeParameter('contentsLimit', i, 50) as number;
		if (limitVal) qs['limit'] = limitVal;
		const offsetVal = this.getNodeParameter('offset', i, 0) as number;
		if (offsetVal) qs['offset'] = offsetVal;
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/${requireId(this, 'driveId', i)}/contents`,
			{},
			qs,
		);
	}

	if (operation === 'getFolders') {
		return cashwerkApiRequest.call(this, 'GET', `/drive/${requireId(this, 'driveId', i)}/folders`);
	}

	if (operation === 'getTrash') {
		return cashwerkApiRequest.call(this, 'GET', `/drive/${requireId(this, 'driveId', i)}/trash`);
	}

	if (operation === 'getView') {
		const qs: IDataObject = {};
		const folderIdVal = this.getNodeParameter('folderId', i, '') as string;
		if (folderIdVal) qs['folderId'] = folderIdVal;
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/${requireId(this, 'driveId', i)}/view`,
			{},
			qs,
		);
	}

	if (operation === 'init') {
		const initOptions = this.getNodeParameter('initOptions', i, {}) as IDataObject;
		const body: IDataObject = {
			filename: this.getNodeParameter('filename', i) as string,
			fileSize: this.getNodeParameter('fileSize', i) as number,
			mimeType: this.getNodeParameter('mimeType', i) as string,
			...initOptions,
		};
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/${requireId(this, 'driveId', i)}/upload/chunked/init`,
			body,
		);
	}

	if (operation === 'uploadDirect') {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		const parentFolderId = this.getNodeParameter('parentFolderId', i, 0) as number;
		const formFields: IDataObject = {};
		if (parentFolderId) formFields.parentFolderId = parentFolderId;
		return cashwerkApiUploadFile.call(
			this,
			`/drive/${requireId(this, 'driveId', i)}/upload/direct`,
			i,
			binaryPropertyName,
			formFields,
			'file',
		);
	}
	if (operation === 'createFolder') {
		// POST /drive/{id}/create-folder
		const body: IDataObject = {
			color: this.getNodeParameter('color', i),
			name: this.getNodeParameter('name', i),
			parentFolderId: this.getNodeParameter('parentFolderId', i),
			...cleanCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
		};
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/${encodeParam(requireId(this, 'id', i))}/create-folder`,
			body,
		);
	}

	if (operation === 'uploadBatch') {
		// POST /drive/{id}/upload/batch
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		return cashwerkApiUploadFile.call(
			this,
			`/drive/${encodeParam(requireId(this, 'id', i))}/upload/batch`,
			i,
			binaryPropertyName,
		);
	}
}

export async function executeDriveFolder(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	const folderId = requireId(this, 'driveFolderId', i);

	if (operation === 'get') {
		return cashwerkApiRequest.call(this, 'GET', `/drive-folders/${folderId}`);
	}

	if (operation === 'update') {
		const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-folders/${folderId}`, body);
	}

	if (operation === 'delete') {
		await cashwerkApiRequest.call(this, 'DELETE', `/drive-folders/${folderId}`);
		return { success: true, deleted: true, folderId: Number(folderId) };
	}

	if (operation === 'getDetails') {
		return cashwerkApiRequest.call(this, 'GET', `/drive-folders/${folderId}/details`);
	}

	if (operation === 'getSize') {
		return cashwerkApiRequest.call(this, 'GET', `/drive-folders/${folderId}/size`);
	}

	if (operation === 'getSubfolders') {
		return cashwerkApiRequest.call(this, 'GET', `/drive-folders/${folderId}/subfolders`);
	}

	if (operation === 'move') {
		const moveOptions = this.getNodeParameter('moveOptions', i, {}) as IDataObject;
		const body: IDataObject = {
			currentDriveId: Number(requireId(this, 'currentDriveId', i)),
		};
		if (moveOptions.parentFolderId) body.parentFolderId = moveOptions.parentFolderId;
		if (moveOptions.destinationDriveId) body.destinationDriveId = moveOptions.destinationDriveId;
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-folders/${folderId}/move`, body);
	}

	if (operation === 'moveToTrash') {
		await cashwerkApiRequest.call(this, 'POST', `/drive-folders/${folderId}/trash`);
		return { success: true, trashed: true, folderId: Number(folderId) };
	}

	if (operation === 'restore') {
		await cashwerkApiRequest.call(this, 'POST', `/drive-folders/${folderId}/restore`);
		return { success: true, restored: true, folderId: Number(folderId) };
	}

	if (operation === 'updateTags') {
		const body: IDataObject = {
			tagIds: parseJsonParam(this.getNodeParameter('tagIds', i, '[]')),
		};
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-folders/${folderId}/tags`, body);
	}

	if (operation === 'zip') {
		return cashwerkApiRequest.call(this, 'POST', `/drive-folders/${folderId}/zip`);
	}
}

export async function executeDriveFile(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	const fileId = requireId(this, 'driveFileId', i);

	if (operation === 'update') {
		const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-files/${fileId}`, body);
	}

	if (operation === 'delete') {
		await cashwerkApiRequest.call(this, 'DELETE', `/drive-files/${fileId}`);
		return { success: true, deleted: true, fileId: Number(fileId) };
	}

	if (operation === 'getDetails') {
		return cashwerkApiRequest.call(this, 'GET', `/drive-files/${fileId}/details`);
	}

	if (operation === 'move') {
		const moveOptions = this.getNodeParameter('moveOptions', i, {}) as IDataObject;
		const body: IDataObject = {
			currentDriveId: Number(requireId(this, 'currentDriveId', i)),
		};
		if (moveOptions.parentFolderId) body.parentFolderId = moveOptions.parentFolderId;
		if (moveOptions.destinationDriveId) body.destinationDriveId = moveOptions.destinationDriveId;
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-files/${fileId}/move`, body);
	}

	if (operation === 'moveToTrash') {
		await cashwerkApiRequest.call(this, 'POST', `/drive-files/${fileId}/trash`);
		return { success: true, trashed: true, fileId: Number(fileId) };
	}

	if (operation === 'restore') {
		await cashwerkApiRequest.call(this, 'POST', `/drive-files/${fileId}/restore`);
		return { success: true, restored: true, fileId: Number(fileId) };
	}

	if (operation === 'updateTags') {
		const body: IDataObject = {
			tagIds: parseJsonParam(this.getNodeParameter('tagIds', i, '[]')),
		};
		return cashwerkApiRequest.call(this, 'PATCH', `/drive-files/${fileId}/tags`, body);
	}
}

export async function executeDriveSharing(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<unknown> {
	if (operation === 'getSharedItems') {
		return cashwerkApiRequest.call(this, 'GET', '/drive/shared/items');
	}

	if (operation === 'getSharedFile') {
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/shared/files/${requireId(this, 'fileId', i)}`,
		);
	}

	if (operation === 'getSharedFolder') {
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/shared/folders/${requireId(this, 'folderId', i)}`,
		);
	}

	if (operation === 'getFolderContents') {
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/shared/folders/${requireId(this, 'folderId', i)}/items`,
		);
	}

	if (operation === 'shareFolder') {
		const notify = this.getNodeParameter('notify', i, true) as boolean;
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/folders/${requireId(this, 'folderId', i)}/users/${requireId(this, 'userId', i)}/share`,
			{ notify },
		);
	}

	if (operation === 'shareFile') {
		const notify = this.getNodeParameter('notify', i, true) as boolean;
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/files/${requireId(this, 'fileId', i)}/users/${requireId(this, 'userId', i)}/share`,
			{ notify },
		);
	}

	if (operation === 'unshareFolder') {
		const folderId = requireId(this, 'folderId', i);
		const userId = requireId(this, 'userId', i);
		await cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/folders/${folderId}/users/${userId}/unshare`,
		);
		return {
			success: true,
			unshared: true,
			folderId: Number(folderId),
			userId: Number(userId),
		};
	}

	if (operation === 'unshareFile') {
		const fileId = requireId(this, 'fileId', i);
		const userId = requireId(this, 'userId', i);
		await cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/files/${fileId}/users/${userId}/unshare`,
		);
		return {
			success: true,
			unshared: true,
			fileId: Number(fileId),
			userId: Number(userId),
		};
	}

	if (operation === 'updateAccess') {
		const readonly = this.getNodeParameter('readonly', i, false) as boolean;
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/drive/shared/${requireId(this, 'shareId', i)}/access/${requireId(this, 'accessId', i)}/update`,
			{ readonly },
		);
	}

	if (operation === 'deleteAccess') {
		const shareId = requireId(this, 'shareId', i);
		const accessId = requireId(this, 'accessId', i);
		const recursive = this.getNodeParameter('recursive', i, false) as boolean;
		await cashwerkApiRequest.call(
			this,
			'DELETE',
			`/drive/shared/${shareId}/access/${accessId}`,
			{},
			{ recursive: String(recursive) },
		);
		return {
			success: true,
			deleted: true,
			shareId: Number(shareId),
			accessId: Number(accessId),
		};
	}

	if (operation === 'updateShare') {
		const shareId = requireId(this, 'shareId', i);
		const isPublic = this.getNodeParameter('isPublic', i, false) as boolean;
		const shareOptions = this.getNodeParameter('shareOptions', i, {}) as IDataObject;
		const body: IDataObject = { isPublic };
		if (shareOptions.notifyUsers !== undefined) body.notifyUsers = shareOptions.notifyUsers;
		if (shareOptions.password) body.password = shareOptions.password;
		if (shareOptions.expiryDate) body.expiryDate = shareOptions.expiryDate;
		if (shareOptions.addUserIds) body.addUserIds = parseJsonParam(shareOptions.addUserIds, []);
		return cashwerkApiRequest.call(this, 'PATCH', `/drive/shared/${shareId}/update`, body);
	}
	if (operation === 'get') {
		// GET /drive/shared/files/{id}
		return cashwerkApiRequest.call(
			this,
			'GET',
			`/drive/shared/files/${encodeParam(requireId(this, 'id', i))}`,
		);
	}

	if (operation === 'update') {
		// PATCH /drive/shared/{id}/access/{accessId}/update
		const body = cleanCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject);
		return cashwerkApiRequest.call(
			this,
			'PATCH',
			`/drive/shared/${encodeParam(requireId(this, 'id', i))}/access/${encodeParam(requireId(this, 'accessId', i))}/update`,
			body,
		);
	}

	if (operation === 'delete') {
		// DELETE /drive/shared/{id}/access/{accessId}
		const qs = cleanCollection(this.getNodeParameter('filters', i, {}) as IDataObject);
		return cashwerkApiRequest.call(
			this,
			'DELETE',
			`/drive/shared/${encodeParam(requireId(this, 'id', i))}/access/${encodeParam(requireId(this, 'accessId', i))}`,
			{},
			qs,
		);
	}

	if (operation === 'share') {
		// POST /drive/shared/files/{fileId}/users/{userId}/share
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/files/${encodeParam(requireId(this, 'fileId', i))}/users/${encodeParam(requireId(this, 'userId', i))}/share`,
		);
	}

	if (operation === 'unshare') {
		// POST /drive/shared/files/{fileId}/users/{userId}/unshare
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/drive/shared/files/${encodeParam(requireId(this, 'fileId', i))}/users/${encodeParam(requireId(this, 'userId', i))}/unshare`,
		);
	}
}
