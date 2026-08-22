import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { cashwerkApiRequest } from '../GenericFunctions';

export async function executeMailConnection(
	this: IExecuteFunctions,
	operation: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for executor signature parity
	_i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		return cashwerkApiRequest.call(this, 'GET', '/mailing/connections');
	}

	throw new Error(`Unsupported Mail Connection operation: ${operation}`);
}
