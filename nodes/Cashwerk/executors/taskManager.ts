import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId, parseJsonParam, requireId } from '../GenericFunctions';


export async function executeTaskBoard(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        const qs: IDataObject = {};
        const titleVal = this.getNodeParameter('title', i, '') as string;
        if (titleVal) qs['title'] = titleVal;
        const completedVal = this.getNodeParameter('completed', i, '') as string;
        if (completedVal) qs['completed'] = completedVal;
        const dueDateStartVal = this.getNodeParameter('dueDateStart', i, '') as string;
        if (dueDateStartVal) qs['dueDateStart'] = dueDateStartVal;
        const dueDateEndVal = this.getNodeParameter('dueDateEnd', i, '') as string;
        if (dueDateEndVal) qs['dueDateEnd'] = dueDateEndVal;
        const sortFieldVal = this.getNodeParameter('sortField', i, '') as string;
        if (sortFieldVal) qs['sortField'] = sortFieldVal;
        const sortDirectionVal = this.getNodeParameter('sortDirection', i, '') as string;
        if (sortDirectionVal) qs['sortDirection'] = sortDirectionVal;
        const assigneeIdsVal = this.getNodeParameter('assigneeIds', i, '') as string;
        if (assigneeIdsVal) qs['assigneeIds'] = assigneeIdsVal;
        const createdByIdsVal = this.getNodeParameter('createdByIds', i, '') as string;
        if (createdByIdsVal) qs['createdByIds'] = createdByIdsVal;
        const tagIdsVal = this.getNodeParameter('tagIds', i, '') as string;
        if (tagIdsVal) qs['tagIds'] = tagIdsVal;
        return cashwerkApiRequest.call(this, 'GET', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}`, {}, qs);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', '/task-manager/boards/search', {}, {}, limit);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/task-manager/boards/create', body);
    }

    if (operation === 'activate') {
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/activate`);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/archive`);
    }

    if (operation === 'createColumn') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/create-column`, body);
    }

    if (operation === 'inviteUser') {
        const body: IDataObject = {
            userId: Number(this.getNodeParameter('userId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/invite-user`, body);
    }

    if (operation === 'removeUser') {
        const body: IDataObject = {
            userId: Number(this.getNodeParameter('userId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/remove-user`, body);
    }

    if (operation === 'updateDueDate') {
        const body: IDataObject = {
            dueDate: this.getNodeParameter('dueDate', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/update-due-date`, body);
    }

    if (operation === 'updateProject') {
        const body: IDataObject = {
            projectId: Number(this.getNodeParameter('projectId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/update-project`, body);
    }

    if (operation === 'updateTitle') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/boards/${requireId(this, 'taskBoardId', i)}/update-title`, body);
    }

}

export async function executeTaskBoardColumn(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/task-manager/columns/${requireId(this, 'taskBoardColumnId', i)}`);
    }

    if (operation === 'createTask') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i),
            columnId: this.getNodeParameter('columnId', i),
            boardName: this.getNodeParameter('boardName', i),
            columnName: this.getNodeParameter('columnName', i),
            isFirstPosition: this.getNodeParameter('isFirstPosition', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/columns/${requireId(this, 'taskBoardColumnId', i)}/create-task`, body);
    }

    if (operation === 'updateName') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/columns/${requireId(this, 'taskBoardColumnId', i)}/update-name`, body);
    }

}

export async function executeTask(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/task-manager/tasks/${requireId(this, 'taskId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', '/task-manager/tasks/search', {}, {}, limit);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/task-manager/tasks/${requireId(this, 'taskId', i)}`);
    }

    if (operation === 'addCollaborator') {
        const body: IDataObject = {
            userId: Number(this.getNodeParameter('userId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/add-collaborator`, body);
    }

    if (operation === 'addCompanies') {
        const body: IDataObject = {
            companyIds: parseJsonParam(this.getNodeParameter('companyIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/companies`, body);
    }

    if (operation === 'addContacts') {
        const body: IDataObject = {
            contactIds: parseJsonParam(this.getNodeParameter('contactIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/contacts`, body);
    }

    if (operation === 'addTag') {
        const body: IDataObject = {
            tagId: Number(this.getNodeParameter('tagId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/add-tag`, body);
    }

    if (operation === 'createComment') {
        const body: IDataObject = {
            taskId: this.getNodeParameter('taskId', i),
            content: this.getNodeParameter('content', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/create-comment`, body);
    }

    if (operation === 'createSubtask') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/create-subtask`, body);
    }

    if (operation === 'markAsCompleted') {
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/mark-as-completed`);
    }

    if (operation === 'markAsIncomplete') {
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/mark-as-incompleted`);
    }

    if (operation === 'removeCollaborator') {
        const body: IDataObject = {
            userId: Number(this.getNodeParameter('userId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/remove-collaborator`, body);
    }

    if (operation === 'removeSubtask') {
        const subtaskId = Number(this.getNodeParameter('subtaskId', i));
        return cashwerkApiRequest.call(this, 'DELETE', `/task-manager/tasks/${requireId(this, 'taskId', i)}/remove-subtask`, {}, { subtaskId });
    }

    if (operation === 'removeTag') {
        const tagId = Number(this.getNodeParameter('tagId', i));
        return cashwerkApiRequest.call(this, 'DELETE', `/task-manager/tasks/${requireId(this, 'taskId', i)}/remove-tag`, {}, { tagId });
    }

    if (operation === 'updateAssignee') {
        const body: IDataObject = {
            userId: Number(this.getNodeParameter('userId', i)),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/update-assignee`, body);
    }

    if (operation === 'updateDescription') {
        const body: IDataObject = {
            description: this.getNodeParameter('description', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/update-description`, body);
    }

    if (operation === 'updateDueDate') {
        const body: IDataObject = {
            dueDate: this.getNodeParameter('dueDate', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/update-due-date`, body);
    }

    if (operation === 'updateTitle') {
        const body: IDataObject = {
            taskId: this.getNodeParameter('taskId', i),
            title: this.getNodeParameter('title', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/tasks/${requireId(this, 'taskId', i)}/update-title`, body);
    }

}

export async function executeTaskComment(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/task-manager/comments/${requireId(this, 'taskCommentId', i)}/update`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/task-manager/comments/${requireId(this, 'taskCommentId', i)}/delete`);
    }

}
