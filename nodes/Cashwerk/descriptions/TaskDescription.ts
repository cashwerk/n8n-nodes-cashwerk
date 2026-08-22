import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['task'] } },
		options: [
			{
				name: 'Add Collaborator',
				value: 'addCollaborator',
				action: 'Add task collaborator',
				description: 'Add collaborator to task',
			},
			{
				name: 'Add Companies',
				value: 'addCompanies',
				action: 'Add companies to task',
				description: 'Add companies to task',
			},
			{
				name: 'Add Contacts',
				value: 'addContacts',
				action: 'Add contacts to task',
				description: 'Add contacts to task',
			},
			{
				name: 'Add Tag',
				value: 'addTag',
				action: 'Add task tag',
				description: 'Add tag to task',
			},
			{
				name: 'Assign To Column',
				value: 'assignToColumn',
				action: 'Assign to column a task',
				description: 'Assign an unassigned task to a board column',
			},
			{
				name: 'Clone',
				value: 'clone',
				action: 'Clone a task',
				description: 'Clone a task',
			},
			{
				name: 'Clone Subtask',
				value: 'cloneSubtask',
				action: 'Clone subtask a task',
				description: 'Clone a subtask',
			},
			{
				name: 'Convert To Subtask',
				value: 'convertToSubtask',
				action: 'Convert to subtask a task',
				description: 'Convert a top-level task into a subtask of another task',
			},
			{
				name: 'Create Comment',
				value: 'createComment',
				action: 'Create task comment',
				description: 'Create comment on task',
			},
			{
				name: 'Create Subtask',
				value: 'createSubtask',
				action: 'Create task subtask',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a task',
				description: 'Delete a task',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task',
				description: 'Get a single task by ID',
			},
			{
				name: 'Get Drive Folder',
				value: 'driveFolder',
				action: 'Get or create the drive folder of a task',
				description:
					'Get or create the drive folder for a task — upload task documents into this folder (not the drive root)',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tasks',
				description: 'Search and list tasks with filters',
			},
			{
				name: 'Mark As Completed',
				value: 'markAsCompleted',
				action: 'Mark task as completed',
				description: 'Mark task as completed',
			},
			{
				name: 'Mark As Incomplete',
				value: 'markAsIncomplete',
				action: 'Mark task as incomplete',
				description: 'Mark task as incomplete',
			},
			{
				name: 'Move To Board',
				value: 'moveToBoard',
				action: 'Move to board a task',
				description: 'Move a task to another board',
			},
			{
				name: 'Remove Collaborator',
				value: 'removeCollaborator',
				action: 'Remove task collaborator',
				description: 'Remove collaborator from task',
			},
			{
				name: 'Remove Subtask',
				value: 'removeSubtask',
				action: 'Remove task subtask',
			},
			{
				name: 'Remove Tag',
				value: 'removeTag',
				action: 'Remove task tag',
				description: 'Remove tag from task',
			},
			{
				name: 'Update Assignee',
				value: 'updateAssignee',
				action: 'Update task assignee',
				description: 'Update task assignee',
			},
			{
				name: 'Update Description',
				value: 'updateDescription',
				action: 'Update task description',
				description: 'Update task description',
			},
			{
				name: 'Update Due Date',
				value: 'updateDueDate',
				action: 'Update task due date',
				description: 'Update task due date',
			},
			{
				name: 'Update Position',
				value: 'updatePosition',
				action: 'Update position a task',
				description: 'Update task position on board',
			},
			{
				name: 'Update Subtask Position',
				value: 'updateSubtaskPosition',
				action: 'Update subtask position a task',
			},
			{
				name: 'Update Title',
				value: 'updateTitle',
				action: 'Update task title',
				description: 'Update task title',
			},
		],
		default: 'get',
	},
];

export const taskFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: { show: { resource: ['task'], operation: ['get'] } },
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['task'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['task'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	// ── delete ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: { show: { resource: ['task'], operation: ['delete'] } },
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── addCollaborator ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['addCollaborator'] },
		},
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['task'], operation: ['addCollaborator'] },
		},
		description:
			'The ID of the user to add as collaborator. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── addCompanies ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['addCompanies'] },
		},
	},
	{
		displayName: 'CompanyIds',
		name: 'companyIds',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['task'], operation: ['addCompanies'] },
		},
	},
	// ── addContacts ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['addContacts'] },
		},
	},
	{
		displayName: 'ContactIds',
		name: 'contactIds',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['task'], operation: ['addContacts'] },
		},
	},
	// ── addTag ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: { show: { resource: ['task'], operation: ['addTag'] } },
	},
	{
		displayName: 'TagId',
		name: 'tagId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['addTag'] } },
	},
	// ── createComment ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['createComment'] },
		},
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['task'], operation: ['createComment'] },
		},
		description: 'The comment content',
	},
	// ── createSubtask ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['createSubtask'] },
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['task'], operation: ['createSubtask'] },
		},
	},
	// ── markAsCompleted ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['markAsCompleted'] },
		},
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── markAsIncomplete ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['markAsIncomplete'] },
		},
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── removeCollaborator ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['removeCollaborator'] },
		},
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['task'], operation: ['removeCollaborator'] },
		},
		description:
			'The ID of the user to remove as collaborator. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── removeSubtask ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['removeSubtask'] },
		},
	},
	{
		displayName: 'SubtaskId',
		name: 'subtaskId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['removeSubtask'] },
		},
	},
	// ── removeTag ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: { show: { resource: ['task'], operation: ['removeTag'] } },
	},
	{
		displayName: 'TagId',
		name: 'tagId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['removeTag'] } },
	},
	// ── updateAssignee ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['updateAssignee'] },
		},
	},
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['updateAssignee'] },
		},
	},
	// ── updateDescription ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['updateDescription'] },
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['task'], operation: ['updateDescription'] },
		},
	},
	// ── updateDueDate ──
	{
		displayName: 'TaskId Name or ID',
		name: 'taskId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['updateDueDate'] },
		},
	},
	{
		displayName: 'DueDate',
		name: 'dueDate',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['task'], operation: ['updateDueDate'] },
		},
	},
	// ── updateTitle ──
	{
		displayName: 'Task Name or ID',
		name: 'taskId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTasks' },
		displayOptions: {
			show: { resource: ['task'], operation: ['updateTitle'] },
		},
		description:
			'The ID of the task. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['task'], operation: ['updateTitle'] },
		},
		description: 'The new title',
	},
	// ── assignToColumn ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['assignToColumn'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['task'], operation: ['assignToColumn'] },
		},
		options: [
			{
				displayName: 'ColumnId',
				name: 'columnId',
				type: 'number',
				default: 0,
				description: 'ColumnId value',
			},
			{
				displayName: 'Index',
				name: 'index',
				type: 'number',
				default: 0,
				description: 'Index value',
			},
		],
	},
	// ── clone ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['clone'] } },
		description: 'ID value',
	},
	// ── cloneSubtask ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['cloneSubtask'] },
		},
		description: 'ID value',
	},
	// ── updatePosition ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['updatePosition'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['task'], operation: ['updatePosition'] },
		},
		options: [
			{
				displayName: 'ColumnId',
				name: 'columnId',
				type: 'number',
				default: 0,
				description: 'ColumnId value',
			},
			{
				displayName: 'Index',
				name: 'index',
				type: 'number',
				default: 0,
				description: 'Index value',
			},
			{
				displayName: 'PreviousColumnId',
				name: 'previousColumnId',
				type: 'number',
				default: 0,
				description: 'PreviousColumnId value',
			},
			{
				displayName: 'PreviousIndex',
				name: 'previousIndex',
				type: 'number',
				default: 0,
				description: 'PreviousIndex value',
			},
		],
	},
	// ── updateSubtaskPosition ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['task'], operation: ['updateSubtaskPosition'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['task'], operation: ['updateSubtaskPosition'] },
		},
		options: [
			{
				displayName: 'Index',
				name: 'index',
				type: 'number',
				default: 0,
				description: 'Index value',
			},
			{
				displayName: 'PreviousIndex',
				name: 'previousIndex',
				type: 'number',
				default: 0,
				description: 'PreviousIndex value',
			},
		],
	},
	// ── convertToSubtask ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['convertToSubtask'] } },
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['convertToSubtask'] } },
		options: [
			{
				displayName: 'ParentTaskId',
				name: 'parentTaskId',
				type: 'number',
				default: 0,
				description: 'ParentTaskId value',
			},
		],
	},
	// ── driveFolder ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['driveFolder'] } },
		description: 'Task ID',
	},
	// ── moveToBoard ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['task'], operation: ['moveToBoard'] } },
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['task'], operation: ['moveToBoard'] } },
		options: [
			{
				displayName: 'BoardId',
				name: 'boardId',
				type: 'number',
				default: 0,
				description: 'BoardId value',
			},
			{
				displayName: 'ColumnId',
				name: 'columnId',
				type: 'number',
				default: 0,
				description: 'ColumnId value',
			},
		],
	},
];
