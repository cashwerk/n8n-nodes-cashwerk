import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
	NodeConnectionTypes,
} from 'n8n-workflow';

import { createHmac } from 'crypto';
import { cashwerkApiRequest } from './GenericFunctions';

export class CashwerkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'cashwerk Trigger',
		name: 'cashwerkTrigger',
		subtitle: '={{$parameter["events"]}}',
		icon: { light: 'file:cashwerk.svg', dark: 'file:cashwerk.dark.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Starts a workflow when a cashwerk event occurs',
		defaults: { name: 'cashwerk Trigger' },
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'cashwerkApi',
				required: true,
				displayOptions: { show: { authentication: ['apiKey'] } },
			},
			{
				name: 'cashwerkOAuth2Api',
				required: true,
				displayOptions: { show: { authentication: ['oAuth2'] } },
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{ name: 'API Key', value: 'apiKey' },
					{ name: 'OAuth2', value: 'oAuth2' },
				],
				default: 'apiKey',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'Which events to listen for',
				options: [
                    // <generated:webhook-events> — DO NOT EDIT BY HAND.
                    // Generated from @cashwerk/shared-types EXTERNAL_WEBHOOK_EVENT_CATALOG.
                    // Regenerate with `npm run n8n:generate-triggers` (from the workspace root).
                    { name: 'Absence Created', value: 'absence.create' },
                    { name: 'Absence Deleted', value: 'absence.delete' },
                    { name: 'Absence Updated', value: 'absence.update' },
                    { name: 'All Events', value: '*' },
                    { name: 'Asset Group Created', value: 'asset_group.create' },
                    { name: 'Asset Group Deleted', value: 'asset_group.delete' },
                    { name: 'Asset Group Updated', value: 'asset_group.update' },
                    { name: 'Asset Machine Created', value: 'asset_machine.create' },
                    { name: 'Asset Machine Deleted', value: 'asset_machine.delete' },
                    { name: 'Asset Machine Updated', value: 'asset_machine.update' },
                    { name: 'Asset Material Created', value: 'asset_material.create' },
                    { name: 'Asset Material Deleted', value: 'asset_material.delete' },
                    { name: 'Asset Material Updated', value: 'asset_material.update' },
                    { name: 'Asset Service Created', value: 'asset_service.create' },
                    { name: 'Asset Service Deleted', value: 'asset_service.delete' },
                    { name: 'Asset Service Updated', value: 'asset_service.update' },
                    { name: 'Asset Subcontract Created', value: 'asset_subcontract.create' },
                    { name: 'Asset Subcontract Deleted', value: 'asset_subcontract.delete' },
                    { name: 'Asset Subcontract Updated', value: 'asset_subcontract.update' },
                    { name: 'Asset Unit Created', value: 'asset_unit.create' },
                    { name: 'Asset Unit Deleted', value: 'asset_unit.delete' },
                    { name: 'Asset Unit Updated', value: 'asset_unit.update' },
                    { name: 'Booking Created', value: 'booking.create' },
                    { name: 'Booking Event Type Created', value: 'booking_event_type.create' },
                    { name: 'Booking Event Type Deleted', value: 'booking_event_type.delete' },
                    { name: 'Booking Event Type Updated', value: 'booking_event_type.update' },
                    { name: 'Booking Page Created', value: 'booking_page.create' },
                    { name: 'Booking Page Deleted', value: 'booking_page.delete' },
                    { name: 'Booking Page Updated', value: 'booking_page.update' },
                    { name: 'Booking Updated', value: 'booking.update' },
                    { name: 'Calendar Created', value: 'calendar.create' },
                    { name: 'Calendar Deleted', value: 'calendar.delete' },
                    { name: 'Calendar Event Created', value: 'calendar_event.create' },
                    { name: 'Calendar Event Deleted', value: 'calendar_event.delete' },
                    { name: 'Calendar Event Updated', value: 'calendar_event.update' },
                    { name: 'Calendar Updated', value: 'calendar.update' },
                    { name: 'Cancellation Invoice Archived', value: 'cancellation_invoice.archive' },
                    { name: 'Cancellation Invoice Created', value: 'cancellation_invoice.create' },
                    { name: 'Cancellation Invoice Restored', value: 'cancellation_invoice.restore' },
                    { name: 'Cancellation Invoice Updated', value: 'cancellation_invoice.update' },
                    { name: 'Comment Created', value: 'comment.create' },
                    { name: 'Comment Deleted', value: 'comment.delete' },
                    { name: 'Comment Updated', value: 'comment.update' },
                    { name: 'Company Archived', value: 'company.archive' },
                    { name: 'Company Created', value: 'company.create' },
                    { name: 'Company Deleted', value: 'company.delete' },
                    { name: 'Company Restored', value: 'company.restore' },
                    { name: 'Company Updated', value: 'company.update' },
                    { name: 'Contact Archived', value: 'contact.archive' },
                    { name: 'Contact Created', value: 'contact.create' },
                    { name: 'Contact Deleted', value: 'contact.delete' },
                    { name: 'Contact Restored', value: 'contact.restore' },
                    { name: 'Contact Updated', value: 'contact.update' },
                    { name: 'Deal Created', value: 'deal.create' },
                    { name: 'Deal Deleted', value: 'deal.delete' },
                    { name: 'Deal Updated', value: 'deal.update' },
                    { name: 'Drive Share Created', value: 'drive_share.create' },
                    { name: 'Drive Share Deleted', value: 'drive_share.delete' },
                    { name: 'Drive Share Updated', value: 'drive_share.update' },
                    { name: 'File Created', value: 'file.create' },
                    { name: 'File Deleted', value: 'file.delete' },
                    { name: 'File Updated', value: 'file.update' },
                    { name: 'Folder Created', value: 'folder.create' },
                    { name: 'Folder Deleted', value: 'folder.delete' },
                    { name: 'Folder Updated', value: 'folder.update' },
                    { name: 'Import Completed', value: 'import.completed' },
                    { name: 'Incoming Payment Created', value: 'incoming_payment.create' },
                    { name: 'Invoice Archived', value: 'invoice.archive' },
                    { name: 'Invoice Created', value: 'invoice.create' },
                    { name: 'Invoice Deleted', value: 'invoice.delete' },
                    { name: 'Invoice Restored', value: 'invoice.restore' },
                    { name: 'Invoice Updated', value: 'invoice.update' },
                    { name: 'Offer Archived', value: 'offer.archive' },
                    { name: 'Offer Created', value: 'offer.create' },
                    { name: 'Offer Deleted', value: 'offer.delete' },
                    { name: 'Offer Restored', value: 'offer.restore' },
                    { name: 'Offer Updated', value: 'offer.update' },
                    { name: 'Organization Branch Created', value: 'organization_branch.create' },
                    { name: 'Organization Branch Deleted', value: 'organization_branch.delete' },
                    { name: 'Organization Branch Updated', value: 'organization_branch.update' },
                    { name: 'Organization Created', value: 'organization.create' },
                    { name: 'Organization Sector Created', value: 'organization_sector.create' },
                    { name: 'Organization Sector Deleted', value: 'organization_sector.delete' },
                    { name: 'Organization Sector Updated', value: 'organization_sector.update' },
                    { name: 'Organization Updated', value: 'organization.update' },
                    { name: 'Pipeline Created', value: 'pipeline.create' },
                    { name: 'Pipeline Deleted', value: 'pipeline.delete' },
                    { name: 'Pipeline Restored', value: 'pipeline.restore' },
                    { name: 'Pipeline Updated', value: 'pipeline.update' },
                    { name: 'Portfolio Created', value: 'portfolio.create' },
                    { name: 'Portfolio Deleted', value: 'portfolio.delete' },
                    { name: 'Portfolio Updated', value: 'portfolio.update' },
                    { name: 'Project Archived', value: 'project.archive' },
                    { name: 'Project Created', value: 'project.create' },
                    { name: 'Project Deleted', value: 'project.delete' },
                    { name: 'Project Restored', value: 'project.restore' },
                    { name: 'Project Updated', value: 'project.update' },
                    { name: 'Sales Tax Regulation Created', value: 'sales_tax_regulation.create' },
                    { name: 'Sales Tax Regulation Deleted', value: 'sales_tax_regulation.delete' },
                    { name: 'Sales Tax Regulation Updated', value: 'sales_tax_regulation.update' },
                    { name: 'Shift Plan Created', value: 'shift_plan.create' },
                    { name: 'Shift Plan Deleted', value: 'shift_plan.delete' },
                    { name: 'Shift Plan Updated', value: 'shift_plan.update' },
                    { name: 'Task Board Archived', value: 'task_board.archive' },
                    { name: 'Task Board Column Created', value: 'task_board_column.create' },
                    { name: 'Task Board Column Deleted', value: 'task_board_column.delete' },
                    { name: 'Task Board Column Updated', value: 'task_board_column.update' },
                    { name: 'Task Board Created', value: 'task_board.create' },
                    { name: 'Task Board Deleted', value: 'task_board.delete' },
                    { name: 'Task Board Restored', value: 'task_board.restore' },
                    { name: 'Task Board Updated', value: 'task_board.update' },
                    { name: 'Task Created', value: 'task.create' },
                    { name: 'Task Deleted', value: 'task.delete' },
                    { name: 'Task Updated', value: 'task.update' },
                    { name: 'Tax Rate Created', value: 'tax_rate.create' },
                    { name: 'Tax Rate Deleted', value: 'tax_rate.delete' },
                    { name: 'Tax Rate Updated', value: 'tax_rate.update' },
                    { name: 'Time Entry Created', value: 'time_entry.create' },
                    { name: 'Time Entry Deleted', value: 'time_entry.delete' },
                    { name: 'Time Entry Updated', value: 'time_entry.update' },
                    { name: 'User Archived', value: 'user.archive' },
                    { name: 'User Created', value: 'user.create' },
                    { name: 'User Deleted', value: 'user.delete' },
                    { name: 'User Updated', value: 'user.update' },
                    { name: 'Work Time Created', value: 'work_time.create' },
                    { name: 'Work Time Deleted', value: 'work_time.delete' },
                    { name: 'Work Time Updated', value: 'work_time.update' },
                    // </generated:webhook-events>
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (staticData.webhookId) {
					try {
						const webhooks = await cashwerkApiRequest.call(this, 'GET', '/api-platform/webhooks');
						const list = Array.isArray(webhooks) ? webhooks : (webhooks?.result ?? []);
						const exists = list.some(
							(w: IDataObject) => String(w.id) === String(staticData.webhookId),
						);
						if (exists) {
							return true;
						}
					} catch (error) {
						this.logger.warn(
							`cashwerk Trigger: could not verify webhook ${String(staticData.webhookId)}: ${(error as Error).message}`,
						);
					}
					delete staticData.webhookId;
					delete staticData.webhookSecret;
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events') as string[];

				const response = await cashwerkApiRequest.call(this, 'POST', '/api-platform/webhooks', {
					url: webhookUrl,
					events,
					description: `n8n trigger (workflow ${this.getWorkflow().id})`,
				});

				const staticData = this.getWorkflowStaticData('node');
				staticData.webhookId = response.id;
				staticData.webhookSecret = response.secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				const webhookId = staticData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				try {
					await cashwerkApiRequest.call(this, 'DELETE', `/api-platform/webhooks/${webhookId}`);
				} catch (error) {
					this.logger.warn(
						`cashwerk Trigger: could not delete webhook ${String(webhookId)}: ${(error as Error).message}`,
					);
				}

				delete staticData.webhookId;
				delete staticData.webhookSecret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;

		const staticData = this.getWorkflowStaticData('node');
		const secret = staticData.webhookSecret as string;

		if (secret) {
			const signatureHeader = req.headers['x-webhook-signature'] as string | undefined;

			if (signatureHeader) {
				const expectedSignature = createHmac('sha256', secret)
					.update(JSON.stringify(body))
					.digest('hex');
				const receivedSignature = signatureHeader.replace('sha256=', '');

				if (receivedSignature !== expectedSignature) {
					return { webhookResponse: 'Signature mismatch' };
				}
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
