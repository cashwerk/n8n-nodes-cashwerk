import {
    IHookFunctions,
    IWebhookFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookResponseData,
    IDataObject,
} from 'n8n-workflow';

import { createHmac } from 'crypto';
import { cashwerkApiRequest } from './GenericFunctions';

export class CashwerkTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'cashwerk Trigger',
        name: 'cashwerkTrigger',
        icon: 'file:cashwerk.png',
        group: ['trigger'],
        version: 1,
        description: 'Starts a workflow when a cashwerk event occurs',
        defaults: { name: 'cashwerk Trigger' },
        inputs: [],
        outputs: ['main'],
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
                    { name: 'All Events', value: '*' },
                    // Absence Planner
                    { name: 'Absence Created', value: 'absence.create' },
                    { name: 'Absence Updated', value: 'absence.update' },
                    { name: 'Absence Deleted', value: 'absence.delete' },
                    { name: 'Absence Approved', value: 'absence.approve' },
                    { name: 'Absence Rejected', value: 'absence.reject' },
                    // Asset Manager
                    { name: 'Material Created', value: 'material.create' },
                    { name: 'Material Updated', value: 'material.update' },
                    { name: 'Material Deleted', value: 'material.delete' },
                    { name: 'Machine Created', value: 'machine.create' },
                    { name: 'Machine Updated', value: 'machine.update' },
                    { name: 'Machine Deleted', value: 'machine.delete' },
                    { name: 'Asset Service Created', value: 'asset_service.create' },
                    { name: 'Asset Service Updated', value: 'asset_service.update' },
                    { name: 'Asset Service Deleted', value: 'asset_service.delete' },
                    { name: 'Subcontract Created', value: 'subcontract.create' },
                    { name: 'Subcontract Updated', value: 'subcontract.update' },
                    { name: 'Subcontract Deleted', value: 'subcontract.delete' },
                    // Calendar
                    { name: 'Calendar Event Created', value: 'calendar_event.create' },
                    { name: 'Calendar Event Updated', value: 'calendar_event.update' },
                    { name: 'Calendar Event Deleted', value: 'calendar_event.delete' },
                    { name: 'Calendar Created', value: 'calendar.create' },
                    { name: 'Calendar Updated', value: 'calendar.update' },
                    { name: 'Calendar Deleted', value: 'calendar.delete' },
                    // CRM - Contact
                    { name: 'Contact Created', value: 'contact.create' },
                    { name: 'Contact Updated', value: 'contact.update' },
                    { name: 'Contact Deleted', value: 'contact.delete' },
                    { name: 'Contact Archived', value: 'contact.archive' },
                    { name: 'Contact Restored', value: 'contact.restore' },
                    // CRM - Company
                    { name: 'Company Created', value: 'company.create' },
                    { name: 'Company Updated', value: 'company.update' },
                    { name: 'Company Deleted', value: 'company.delete' },
                    { name: 'Company Archived', value: 'company.archive' },
                    { name: 'Company Restored', value: 'company.restore' },
                    // CRM - Portfolio
                    { name: 'Portfolio Created', value: 'portfolio.create' },
                    { name: 'Portfolio Updated', value: 'portfolio.update' },
                    { name: 'Portfolio Deleted', value: 'portfolio.delete' },
                    // Deal
                    { name: 'Deal Created', value: 'deal.create' },
                    { name: 'Deal Updated', value: 'deal.update' },
                    { name: 'Deal Deleted', value: 'deal.delete' },
                    { name: 'Deal Stage Changed', value: 'deal.stage_changed' },
                    // Drive
                    { name: 'Drive File Uploaded', value: 'drive.file.upload' },
                    { name: 'Drive File Updated', value: 'drive.file.update' },
                    { name: 'Drive File Deleted', value: 'drive.file.delete' },
                    { name: 'Drive Folder Created', value: 'drive.folder.create' },
                    { name: 'Drive Folder Deleted', value: 'drive.folder.delete' },
                    // Invoice
                    { name: 'Invoice Created', value: 'invoice.create' },
                    { name: 'Invoice Updated', value: 'invoice.update' },
                    { name: 'Invoice Deleted', value: 'invoice.delete' },
                    { name: 'Invoice Booked', value: 'invoice.book' },
                    { name: 'Invoice Paid', value: 'invoice.paid' },
                    { name: 'Invoice Sent', value: 'invoice.send' },
                    { name: 'Invoice Cancelled', value: 'invoice.cancel' },
                    // Cancellation Invoice
                    { name: 'Cancellation Invoice Created', value: 'cancellation_invoice.create' },
                    { name: 'Cancellation Invoice Updated', value: 'cancellation_invoice.update' },
                    // Incoming Payment
                    { name: 'Payment Created', value: 'incoming_payment.create' },
                    { name: 'Payment Deleted', value: 'incoming_payment.delete' },
                    // Offer
                    { name: 'Offer Created', value: 'offer.create' },
                    { name: 'Offer Updated', value: 'offer.update' },
                    { name: 'Offer Deleted', value: 'offer.delete' },
                    { name: 'Offer Sent', value: 'offer.send' },
                    { name: 'Offer Booked', value: 'offer.book' },
                    { name: 'Offer Cancelled', value: 'offer.cancel' },
                    // Organization
                    { name: 'Organization Updated', value: 'organization.update' },
                    // Pipeline
                    { name: 'Pipeline Created', value: 'pipeline.create' },
                    { name: 'Pipeline Updated', value: 'pipeline.update' },
                    { name: 'Pipeline Deleted', value: 'pipeline.delete' },
                    // Project
                    { name: 'Project Created', value: 'project.create' },
                    { name: 'Project Updated', value: 'project.update' },
                    { name: 'Project Deleted', value: 'project.delete' },
                    { name: 'Project Archived', value: 'project.archive' },
                    // Shift Plan
                    { name: 'Shift Plan Created', value: 'shift_plan.create' },
                    { name: 'Shift Plan Updated', value: 'shift_plan.update' },
                    { name: 'Shift Plan Deleted', value: 'shift_plan.delete' },
                    // Task
                    { name: 'Task Created', value: 'task.create' },
                    { name: 'Task Updated', value: 'task.update' },
                    { name: 'Task Deleted', value: 'task.delete' },
                    { name: 'Task Completed', value: 'task.complete' },
                    // Task Board
                    { name: 'Task Board Created', value: 'task_board.create' },
                    { name: 'Task Board Deleted', value: 'task_board.delete' },
                    // Time Tracking
                    { name: 'Time Entry Created', value: 'time_entry.create' },
                    { name: 'Time Entry Updated', value: 'time_entry.update' },
                    { name: 'Time Entry Deleted', value: 'time_entry.delete' },
                    { name: 'Tracker Started', value: 'tracker.start' },
                    { name: 'Tracker Stopped', value: 'tracker.stop' },
                    // User
                    { name: 'User Created', value: 'user.create' },
                    { name: 'User Updated', value: 'user.update' },
                    { name: 'User Deleted', value: 'user.delete' },
                    { name: 'User Archived', value: 'user.archive' },
                    { name: 'User Activated', value: 'user.activate' },
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
                        const webhooks = await cashwerkApiRequest.call(
                            this, 'GET', '/api-platform/webhooks',
                        );
                        const list = Array.isArray(webhooks) ? webhooks : (webhooks?.result ?? []);
                        const exists = list.some(
                            (w: IDataObject) => String(w.id) === String(staticData.webhookId),
                        );
                        if (exists) {
                            return true;
                        }
                    } catch {
                        // Webhook may have been deleted externally
                    }
                    delete staticData.webhookId;
                    delete staticData.webhookSecret;
                }
                return false;
            },

            async create(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default') as string;
                const events = this.getNodeParameter('events') as string[];

                const response = await cashwerkApiRequest.call(
                    this, 'POST', '/api-platform/webhooks',
                    {
                        url: webhookUrl,
                        events,
                        description: `n8n trigger (workflow ${this.getWorkflow().id})`,
                    },
                );

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
                    await cashwerkApiRequest.call(
                        this, 'DELETE', `/api-platform/webhooks/${webhookId}`,
                    );
                } catch {
                    // Webhook may already be deleted
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
            workflowData: [
                this.helpers.returnJsonArray(body),
            ],
        };
    }
}
