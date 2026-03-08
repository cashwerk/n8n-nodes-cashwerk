import { INodeProperties } from 'n8n-workflow';

export const incomingPaymentOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['incomingPayment'] } },
        options: [
            { name: 'Get By Invoice', value: 'getByInvoice', action: 'Get Payments by Invoice', description: 'Get all payments for an invoice' },
            { name: 'Get Total', value: 'total', action: 'Get Payment Total', description: 'Get total paid amount for an invoice' },
            { name: 'Create For Invoice', value: 'createForInvoice', action: 'Create Payment for Invoice', description: 'Create a new incoming payment for an invoice' },
            { name: 'Delete', value: 'delete', action: 'Delete a Payment', description: 'Delete an incoming payment by ID' },
        ],
        default: 'getByInvoice',
    },
];

export const incomingPaymentFields: INodeProperties[] = [
    // ── getByInvoice ──
    {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['getByInvoice'] } },
        description: 'The ID of the invoice to retrieve payments for',
    },
    // ── total ──
    {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['total'] } },
        description: 'The ID of the invoice to get the total paid amount for',
    },
    // ── createForInvoice ──
    {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['createForInvoice'] } },
        description: 'The ID of the invoice to create the payment for',
    },
    {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['createForInvoice'] } },
        description: 'Payment amount',
    },
    {
        displayName: 'Payment Date',
        name: 'paymentDate',
        type: 'dateTime',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['createForInvoice'] } },
        description: 'Payment date',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['createForInvoice'] } },
        options: [
            { displayName: 'Currency Code', name: 'currencyCode', type: 'string', default: 'EUR', description: 'Currency code (default: EUR)' },
            { displayName: 'Received At', name: 'receivedAt', type: 'dateTime', default: '', description: 'Date the payment was received' },
            { displayName: 'Payment Reference', name: 'paymentReference', type: 'string', default: '', description: 'Reference number for the payment' },
            { displayName: 'Payment Method', name: 'paymentMethod', type: 'options', default: 'BANK_TRANSFER', description: 'Method of payment', options: [
                { name: 'Bank Transfer', value: 'BANK_TRANSFER' },
                { name: 'Cash', value: 'CASH' },
                { name: 'Credit Card', value: 'CREDIT_CARD' },
                { name: 'Direct Debit', value: 'DIRECT_DEBIT' },
                { name: 'Check', value: 'CHECK' },
                { name: 'Credit Purchase', value: 'CREDIT_PURCHASE' },
                { name: 'Cash With Order', value: 'CASH_WITH_ORDER' },
                { name: 'Other', value: 'OTHER' },
            ] },
            { displayName: 'Status', name: 'status', type: 'options', default: 'RECEIVED', description: 'Payment status', options: [
                { name: 'Pending', value: 'PENDING' },
                { name: 'Received', value: 'RECEIVED' },
                { name: 'Failed', value: 'FAILED' },
                { name: 'Cancelled', value: 'CANCELLED' },
            ] },
            { displayName: 'Notes', name: 'notes', type: 'string', default: '', description: 'Additional notes' },
            { displayName: 'Transaction ID', name: 'transactionId', type: 'string', default: '', description: 'External transaction ID' },
            { displayName: 'Bank Reference', name: 'bankReference', type: 'string', default: '', description: 'Bank reference number' },
        ],
    },
    // ── delete ──
    {
        displayName: 'Payment ID',
        name: 'paymentId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['incomingPayment'], operation: ['delete'] } },
        description: 'The ID of the incoming payment to delete',
    },
];
