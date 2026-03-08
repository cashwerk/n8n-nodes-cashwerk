import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { cashwerkApiRequest } from '../GenericFunctions';

export async function executeMailConnection(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<IDataObject | IDataObject[]> {
    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', '/mailing/connections');
    }

    throw new Error(`Unsupported Mail Connection operation: ${operation}`);
}
