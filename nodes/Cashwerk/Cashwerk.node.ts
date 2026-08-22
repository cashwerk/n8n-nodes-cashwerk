import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { cashwerkApiRequest, getOrganizationId } from './GenericFunctions';
import { userOperations, userFields } from './descriptions/UserDescription';
import { workTimeOperations, workTimeFields } from './descriptions/WorkTimeDescription';
import { organizationOperations, organizationFields } from './descriptions/OrganizationDescription';
import { driveOperations, driveFields } from './descriptions/DriveDescription';
import { driveFolderOperations, driveFolderFields } from './descriptions/DriveFolderDescription';
import { driveFileOperations, driveFileFields } from './descriptions/DriveFileDescription';
import { driveSharingOperations, driveSharingFields } from './descriptions/DriveSharingDescription';
import { companyOperations, companyFields } from './descriptions/CompanyDescription';
import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { portfolioOperations, portfolioFields } from './descriptions/PortfolioDescription';
import { crmMetricsOperations, crmMetricsFields } from './descriptions/CrmMetricsDescription';
import {
	calendarEventOperations,
	calendarEventFields,
} from './descriptions/CalendarEventDescription';
import { calendarOperations, calendarFields } from './descriptions/CalendarDescription';
import { timeTrackingOperations, timeTrackingFields } from './descriptions/TimeTrackingDescription';
import {
	trackingCategoryOperations,
	trackingCategoryFields,
} from './descriptions/TrackingCategoryDescription';
import { absenceOperations, absenceFields } from './descriptions/AbsenceDescription';
import { shiftPlanOperations, shiftPlanFields } from './descriptions/ShiftPlanDescription';
import { workReportOperations, workReportFields } from './descriptions/WorkReportDescription';
import { assetUnitOperations, assetUnitFields } from './descriptions/AssetUnitDescription';
import { materialOperations, materialFields } from './descriptions/MaterialDescription';
import { assetGroupOperations, assetGroupFields } from './descriptions/AssetGroupDescription';
import { machineOperations, machineFields } from './descriptions/MachineDescription';
import { assetServiceOperations, assetServiceFields } from './descriptions/AssetServiceDescription';
import { subcontractOperations, subcontractFields } from './descriptions/SubcontractDescription';
import { taskBoardOperations, taskBoardFields } from './descriptions/TaskBoardDescription';
import {
	taskBoardColumnOperations,
	taskBoardColumnFields,
} from './descriptions/TaskBoardColumnDescription';
import { taskOperations, taskFields } from './descriptions/TaskDescription';
import { taskCommentOperations, taskCommentFields } from './descriptions/TaskCommentDescription';
import { projectOperations, projectFields } from './descriptions/ProjectDescription';
import { offerOperations, offerFields } from './descriptions/OfferDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import {
	mailConnectionOperations,
	mailConnectionFields,
} from './descriptions/MailConnectionDescription';
import { taxRateOperations, taxRateFields } from './descriptions/TaxRateDescription';
import {
	salesTaxRegulationOperations,
	salesTaxRegulationFields,
} from './descriptions/SalesTaxRegulationDescription';
import {
	incomingPaymentOperations,
	incomingPaymentFields,
} from './descriptions/IncomingPaymentDescription';
import {
	cancellationInvoiceOperations,
	cancellationInvoiceFields,
} from './descriptions/CancellationInvoiceDescription';
import { dealOperations, dealFields } from './descriptions/DealDescription';
import { pipelineOperations, pipelineFields } from './descriptions/PipelineDescription';
import { bookingOperations, bookingFields } from './descriptions/BookingDescription';
import { bookingPageOperations, bookingPageFields } from './descriptions/BookingPageDescription';
import {
	bookingEventTypeOperations,
	bookingEventTypeFields,
} from './descriptions/BookingEventTypeDescription';
import {
	bookingDateOverrideOperations,
	bookingDateOverrideFields,
} from './descriptions/BookingDateOverrideDescription';
import { chatOperations, chatFields } from './descriptions/ChatDescription';
import { executeUser, executeWorkTime } from './executors/users';
import { executeOrganization } from './executors/organization';
import {
	executeDrive,
	executeDriveFolder,
	executeDriveFile,
	executeDriveSharing,
} from './executors/drive';
import {
	executeCompany,
	executeContact,
	executePortfolio,
	executeCrmMetrics,
} from './executors/crm';
import { executeCalendarEvent, executeCalendar } from './executors/calendar';
import {
	executeTimeTracking,
	executeTrackingCategory,
	executeAbsence,
	executeShiftPlan,
	executeWorkReport,
} from './executors/workManager';
import {
	executeAssetUnit,
	executeMaterial,
	executeAssetGroup,
	executeMachine,
	executeAssetService,
	executeSubcontract,
} from './executors/assetManager';
import {
	executeTaskBoard,
	executeTaskBoardColumn,
	executeTask,
	executeTaskComment,
} from './executors/taskManager';
import { executeProject } from './executors/projectManager';
import {
	executeOffer,
	executeInvoice,
	executeTaxRate,
	executeSalesTaxRegulation,
	executeIncomingPayment,
	executeCancellationInvoice,
} from './executors/invoicing';
import { executeMailConnection } from './executors/mailing';
import { executeDeal, executePipeline } from './executors/salesPipeline';
import {
	executeBooking,
	executeBookingPage,
	executeBookingEventType,
	executeBookingDateOverride,
} from './executors/booking';
import { executeChat } from './executors/chat';

export class Cashwerk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'cashwerk',
		name: 'cashwerk',
		icon: { light: 'file:cashwerk.svg', dark: 'file:cashwerk.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the cashwerk API',
		defaults: { name: 'cashwerk' },
		inputs: [NodeConnectionTypes.Main],
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Absence', value: 'absence' },
					{ name: 'Asset Group', value: 'assetGroup' },
					{ name: 'Asset Service', value: 'assetService' },
					{ name: 'Asset Unit', value: 'assetUnit' },
					{ name: 'Booking', value: 'booking' },
					{ name: 'Booking Date Override', value: 'bookingDateOverride' },
					{ name: 'Booking Event Type', value: 'bookingEventType' },
					{ name: 'Booking Page', value: 'bookingPage' },
					{ name: 'Calendar', value: 'calendar' },
					{ name: 'Calendar Event', value: 'calendarEvent' },
					{ name: 'Cancellation Invoice', value: 'cancellationInvoice' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'CRM Metric', value: 'crmMetrics' },
					{ name: 'Deal', value: 'deal' },
					{ name: 'Drive', value: 'drive' },
					{ name: 'Drive File', value: 'driveFile' },
					{ name: 'Drive Folder', value: 'driveFolder' },
					{ name: 'Drive Sharing', value: 'driveSharing' },
					{ name: 'Incoming Payment', value: 'incomingPayment' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Machine', value: 'machine' },
					{ name: 'Mail Connection', value: 'mailConnection' },
					{ name: 'Material', value: 'material' },
					{ name: 'Offer', value: 'offer' },
					{ name: 'Organization', value: 'organization' },
					{ name: 'Pipeline', value: 'pipeline' },
					{ name: 'Portfolio', value: 'portfolio' },
					{ name: 'Project', value: 'project' },
					{ name: 'Sales Tax Regulation', value: 'salesTaxRegulation' },
					{ name: 'Shift Plan', value: 'shiftPlan' },
					{ name: 'Subcontract', value: 'subcontract' },
					{ name: 'Task', value: 'task' },
					{ name: 'Task Board', value: 'taskBoard' },
					{ name: 'Task Board Column', value: 'taskBoardColumn' },
					{ name: 'Task Comment', value: 'taskComment' },
					{ name: 'Tax Rate', value: 'taxRate' },
					{ name: 'Time Tracking', value: 'timeTracking' },
					{ name: 'Tracking Category', value: 'trackingCategory' },
					{ name: 'User', value: 'user' },
					{ name: 'Work Report', value: 'workReport' },
					{ name: 'Work Time', value: 'workTime' },
				],
				default: 'absence',
			},
			...absenceOperations,
			...absenceFields,
			...assetGroupOperations,
			...assetGroupFields,
			...assetServiceOperations,
			...assetServiceFields,
			...assetUnitOperations,
			...assetUnitFields,
			...bookingOperations,
			...bookingFields,
			...bookingDateOverrideOperations,
			...bookingDateOverrideFields,
			...bookingEventTypeOperations,
			...bookingEventTypeFields,
			...bookingPageOperations,
			...bookingPageFields,
			...calendarOperations,
			...calendarFields,
			...calendarEventOperations,
			...calendarEventFields,
			...cancellationInvoiceOperations,
			...cancellationInvoiceFields,
			...chatOperations,
			...chatFields,
			...companyOperations,
			...companyFields,
			...contactOperations,
			...contactFields,
			...crmMetricsOperations,
			...crmMetricsFields,
			...dealOperations,
			...dealFields,
			...driveOperations,
			...driveFields,
			...driveFileOperations,
			...driveFileFields,
			...driveFolderOperations,
			...driveFolderFields,
			...driveSharingOperations,
			...driveSharingFields,
			...incomingPaymentOperations,
			...incomingPaymentFields,
			...invoiceOperations,
			...invoiceFields,
			...mailConnectionOperations,
			...mailConnectionFields,
			...machineOperations,
			...machineFields,
			...materialOperations,
			...materialFields,
			...offerOperations,
			...offerFields,
			...organizationOperations,
			...organizationFields,
			...pipelineOperations,
			...pipelineFields,
			...portfolioOperations,
			...portfolioFields,
			...projectOperations,
			...projectFields,
			...salesTaxRegulationOperations,
			...salesTaxRegulationFields,
			...shiftPlanOperations,
			...shiftPlanFields,
			...subcontractOperations,
			...subcontractFields,
			...taskOperations,
			...taskFields,
			...taskBoardOperations,
			...taskBoardFields,
			...taskBoardColumnOperations,
			...taskBoardColumnFields,
			...taskCommentOperations,
			...taskCommentFields,
			...taxRateOperations,
			...taxRateFields,
			...timeTrackingOperations,
			...timeTrackingFields,
			...trackingCategoryOperations,
			...trackingCategoryFields,
			...userOperations,
			...userFields,
			...workReportOperations,
			...workReportFields,
			...workTimeOperations,
			...workTimeFields,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getDrives(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const meResponse = await cashwerkApiRequest.call(this, 'GET', '/api-platform/me');
					const orgId = meResponse?.organizationId;
					if (!orgId) return [];
					const drives = await cashwerkApiRequest.call(
						this,
						'GET',
						'/drive/organization-possessed',
						{},
						{ organizationId: orgId },
					);
					if (!Array.isArray(drives)) return [];
					return drives.map((d: IDataObject) => ({
						name: (d.name as string) || `Drive ${d.id}`,
						value: d.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getCalendars(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const calendars = await cashwerkApiRequest.call(this, 'GET', '/calendars');
					if (!Array.isArray(calendars)) return [];
					return calendars.map((c: IDataObject) => ({
						name: (c.name as string) || `Calendar ${c.id}`,
						value: c.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getPipelines(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const pipelines = await cashwerkApiRequest.call(this, 'GET', '/sales-pipeline/pipelines');
					if (!Array.isArray(pipelines)) return [];
					return pipelines.map((p: IDataObject) => ({
						name: (p.title as string) || `Pipeline ${p.id}`,
						value: p.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getStagesByPipeline(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const pipelineId = this.getCurrentNodeParameter('boardId') as number;
					if (!pipelineId) return [];
					const pipeline = await cashwerkApiRequest.call(
						this,
						'GET',
						`/sales-pipeline/pipelines/${pipelineId}`,
					);
					const stages = pipeline?.stages;
					if (!Array.isArray(stages)) return [];
					return stages
						.sort(
							(a: IDataObject, b: IDataObject) => (a.position as number) - (b.position as number),
						)
						.map((s: IDataObject) => ({
							name:
								(s.name as string) ||
								((s.status as IDataObject | undefined)?.name as string | undefined) ||
								`Stage ${s.id}`,
							value: s.id as number,
						}));
				} catch {
					return [];
				}
			},
			async getTaskBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await cashwerkApiRequest.call(
						this,
						'GET',
						'/task-manager/boards/search',
					);
					const list = Array.isArray(response) ? response : (response?.result ?? []);
					return list.map((b: IDataObject) => ({
						name: (b.title as string) || `Board ${b.id}`,
						value: b.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await cashwerkApiRequest.call(this, 'GET', '/projects/query');
					const list = Array.isArray(response) ? response : (response?.result ?? []);
					return list.map((p: IDataObject) => ({
						name: (p.name as string) || `Project ${p.id}`,
						value: p.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getContacts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const orgId = await getOrganizationId.call(this);
				const response = await cashwerkApiRequest.call(
					this,
					'POST',
					`/crm/contacts/organization/${orgId}/contacts/query`,
					{ take: 100 },
				);
				const items = response?.items ?? [];
				return items.map((c: IDataObject) => ({
					name: String(`${c.firstName || ''} ${c.lastName || ''}`.trim() || `Contact #${c.id}`),
					value: c.id as string | number,
				}));
			},
			async getCompanies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const orgId = await getOrganizationId.call(this);
				const response = await cashwerkApiRequest.call(
					this,
					'POST',
					`/crm/companies/organization/${orgId}/companies/query`,
					{ take: 100 },
				);
				const items = response?.items ?? [];
				return items.map((c: IDataObject) => ({
					name: String(c.name || `Company #${c.id}`),
					value: c.id as string | number,
				}));
			},
			async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const orgId = await getOrganizationId.call(this);
				const response = await cashwerkApiRequest.call(
					this,
					'GET',
					'/users/active',
					{},
					{ organizationId: orgId },
				);
				return (Array.isArray(response) ? response : []).map((u: IDataObject) => ({
					name:
						`${String(u.firstName ?? '')} ${String(u.lastName ?? '')}`.trim() ||
						String(u.email ?? `User #${String(u.id)}`),
					value: u.id as string | number,
				}));
			},
			async getDeals(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await cashwerkApiRequest.call(this, 'GET', '/sales-pipeline/deals');
				const items = response?.items ?? (Array.isArray(response) ? response : []);
				return items.map((d: IDataObject) => ({
					name: String(d.title || `Deal #${d.id}`),
					value: d.id as string | number,
				}));
			},
			async getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await cashwerkApiRequest.call(this, 'GET', '/task-manager/tasks');
				const items = response?.items ?? (Array.isArray(response) ? response : []);
				return items.map((t: IDataObject) => ({
					name: String(t.title || `Task #${t.id}`),
					value: t.id as string | number,
				}));
			},
			async getOffers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await cashwerkApiRequest.call(this, 'POST', '/invoicing/offers/query', {
						take: 100,
					});
					const items = response?.items ?? [];
					return items.map((o: IDataObject) => ({
						name: o.subject || o.offerNumber || `Offer #${o.id}`,
						value: o.id,
					}));
				} catch {
					return [];
				}
			},
			async getMailConnections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const connections = await cashwerkApiRequest.call(this, 'GET', '/mailing/connections');
					if (!Array.isArray(connections)) return [];
					return connections.map((c: IDataObject) => ({
						name: `${c.email || 'Unknown'} (${c.provider || 'unknown'})`,
						value: c.id as number,
					}));
				} catch {
					return [];
				}
			},
			async getInvoices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await cashwerkApiRequest.call(
						this,
						'POST',
						'/invoicing/invoices/query',
						{ take: 100 },
					);
					const items = response?.items ?? [];
					return items.map((inv: IDataObject) => ({
						name: String(inv.subject || inv.invoiceNumber || `Invoice #${inv.id}`),
						value: inv.id as string | number,
					}));
				} catch {
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const executorMap: Record<string, (op: string, i: number) => Promise<unknown>> = {
			absence: executeAbsence,
			assetGroup: executeAssetGroup,
			assetService: executeAssetService,
			assetUnit: executeAssetUnit,
			booking: executeBooking,
			bookingDateOverride: executeBookingDateOverride,
			bookingEventType: executeBookingEventType,
			bookingPage: executeBookingPage,
			calendar: executeCalendar,
			calendarEvent: executeCalendarEvent,
			cancellationInvoice: executeCancellationInvoice,
			chat: executeChat,
			company: executeCompany,
			contact: executeContact,
			crmMetrics: executeCrmMetrics,
			deal: executeDeal,
			drive: executeDrive,
			driveFile: executeDriveFile,
			driveFolder: executeDriveFolder,
			driveSharing: executeDriveSharing,
			incomingPayment: executeIncomingPayment,
			invoice: executeInvoice,
			mailConnection: executeMailConnection,
			machine: executeMachine,
			material: executeMaterial,
			offer: executeOffer,
			organization: executeOrganization,
			pipeline: executePipeline,
			portfolio: executePortfolio,
			project: executeProject,
			salesTaxRegulation: executeSalesTaxRegulation,
			shiftPlan: executeShiftPlan,
			subcontract: executeSubcontract,
			task: executeTask,
			taskBoard: executeTaskBoard,
			taskBoardColumn: executeTaskBoardColumn,
			taskComment: executeTaskComment,
			taxRate: executeTaxRate,
			timeTracking: executeTimeTracking,
			trackingCategory: executeTrackingCategory,
			user: executeUser,
			workReport: executeWorkReport,
			workTime: executeWorkTime,
		};

		const executor = executorMap[resource];
		if (!executor) {
			throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
		}

		// Deduplicate API calls across input items by caching responses keyed
		// on the resolved node parameters. When multiple input items resolve to
		// identical parameters (e.g. static userId, same dates), the API is
		// called only once and the result is collected only once.
		const responseCache = new Map<string, boolean>();

		for (let i = 0; i < items.length; i++) {
			try {
				const nodeParamDefs = this.getNode().parameters;
				const resolved: Record<string, unknown> = {};
				for (const key of Object.keys(nodeParamDefs)) {
					try {
						resolved[key] = this.getNodeParameter(key, i, undefined);
					} catch {
						// parameter not applicable for this resource/operation
					}
				}
				const cacheKey = JSON.stringify(resolved);

				if (responseCache.has(cacheKey)) {
					continue;
				}

				const responseData = await executor.call(this, operation, i);
				responseCache.set(cacheKey, true);

				if (Array.isArray(responseData)) {
					if (responseData.length === 0) {
						returnData.push({
							json: { empty: true, count: 0 },
							pairedItem: { item: i },
						});
					} else {
						for (const item of responseData) {
							returnData.push({
								json: (typeof item === 'object' && item !== null
									? item
									: { value: item }) as IDataObject,
								pairedItem: { item: i },
							});
						}
					}
				} else if (responseData === undefined || responseData === null) {
					returnData.push({ json: { success: true }, pairedItem: { item: i } });
				} else if (typeof responseData !== 'object') {
					returnData.push({
						json: { value: responseData },
						pairedItem: { item: i },
					});
				} else {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
