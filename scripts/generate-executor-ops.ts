/**
 * Generate executor branches for operations that exist in a description file
 * but have no `if (operation === '…')` branch in the matching executor.
 *
 * Uses the same OpenAPI classification as generate-descriptions.ts, so the
 * parameter names it reads (`id`, `filters`, `additionalFields`, …) are the
 * ones the description generator wrote.
 *
 *   npx tsx packages/nx-cashwerk-n8n/scripts/generate-executor-ops.ts [--dry-run]
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { OpenApiDocument } from '../../../scripts/shared/openapi.interfaces';
import {
    TAG_CONFIG,
    SPEC_PATH,
    classifyOperations,
    extractBodyFields,
    extractPathParams,
    extractQueryParams,
    groupEndpointsByTag,
    pascalCase,
    type ClassifiedOp,
    type SpecEndpoint,
} from './generate-descriptions';

const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = resolve(__dirname, '..', 'nodes', 'Cashwerk');
const DESC_DIR = resolve(ROOT, 'descriptions');
const EXEC_DIR = resolve(ROOT, 'executors');

interface FnRange { start: number; bodyOpen: number; bodyClose: number }

function findFunction(src: string, name: string): FnRange | null {
    const sig = src.indexOf(`export async function ${name}(`);
    if (sig < 0) return null;
    const bodyOpen = src.indexOf('{', src.indexOf(')', sig));
    let depth = 0;
    for (let j = bodyOpen; j < src.length; j++) {
        if (src[j] === '{') depth++;
        else if (src[j] === '}' && --depth === 0) return { start: sig, bodyOpen, bodyClose: j };
    }
    return null;
}

function describedOps(resource: string, descFile: string): Set<string> {
    const file = resolve(DESC_DIR, `${descFile}.ts`);
    if (!existsSync(file)) return new Set();
    const src = readFileSync(file, 'utf8');
    if (!src.includes(`resource: ['${resource}']`)) return new Set();
    const opsBlock = src.slice(0, src.search(/export const \w+Fields/));
    return new Set([...opsBlock.matchAll(/value: '([a-zA-Z]+)'/g)].map(m => m[1]));
}

function pathExpr(ep: SpecEndpoint, needs: Set<string>): string {
    const params = extractPathParams(ep);
    return ep.path.replace(/\{(\w+)\}/g, (_m, p: string) => {
        if (p === 'orgId') { needs.add('orgId'); needs.add('encodeParam'); return '${encodeParam(orgId)}'; }
        const def = params.find(x => x.name === p);
        needs.add('encodeParam');
        if (def?.n8nType === 'number') { needs.add('requireId'); return `\${encodeParam(requireId(this, '${p}', i))}`; }
        return `\${encodeParam(this.getNodeParameter('${p}', i) as string)}`;
    });
}

function branch(spec: OpenApiDocument, op: ClassifiedOp, ep: SpecEndpoint, needs: Set<string>): string {
    const L: string[] = [];
    const path = pathExpr(ep, needs);
    const query = extractQueryParams(ep);
    const body = extractBodyFields(spec, ep);
    const multipart = !!ep.requestBody?.content?.['multipart/form-data'];
    const jsonKeys = body.filter(f => f.n8nType === 'json').map(f => `'${f.name}'`);
    const jk = jsonKeys.length ? `, [${jsonKeys.join(', ')}]` : '';
    const isCreate = op.value === 'create';
    const collection = isCreate ? 'additionalFields' : op.value === 'update' ? 'updateFields' : 'options';

    L.push(`\tif (operation === '${op.value}') {`);
    L.push(`\t\t// ${ep.method} ${ep.path}`);

    let qsVar = '{}';
    if (query.length) {
        needs.add('cleanCollection');
        L.push(`\t\tconst qs = cleanCollection(this.getNodeParameter('filters', i, {}) as IDataObject);`);
        qsVar = 'qs';
    }

    if (multipart) {
        needs.add('cashwerkApiUploadFile');
        const fields = body.filter(f => f.name !== 'file');
        L.push(`\t\tconst binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;`);
        if (fields.length) {
            needs.add('cleanCollection');
            L.push(`\t\tconst formFields = cleanCollection(this.getNodeParameter('${collection}', i, {}) as IDataObject${jk});`);
            L.push(`\t\treturn cashwerkApiUploadFile.call(this, \`${path}\`, i, binaryPropertyName, formFields);`);
        } else {
            L.push(`\t\treturn cashwerkApiUploadFile.call(this, \`${path}\`, i, binaryPropertyName);`);
        }
        L.push('\t}');
        return L.join('\n');
    }

    let bodyVar = '{}';
    if (body.length) {
        needs.add('cleanCollection');
        const required = isCreate ? body.filter(f => f.required) : [];
        if (required.length) {
            L.push('\t\tconst body: IDataObject = {');
            for (const f of required) {
                const get = `this.getNodeParameter('${f.name}', i)`;
                if (f.n8nType === 'json') { needs.add('parseJsonParam'); L.push(`\t\t\t${f.name}: parseJsonParam(${get}),`); }
                else L.push(`\t\t\t${f.name}: ${get},`);
            }
            L.push(`\t\t\t...cleanCollection(this.getNodeParameter('${collection}', i, {}) as IDataObject${jk}),`);
            L.push('\t\t};');
        } else {
            L.push(`\t\tconst body = cleanCollection(this.getNodeParameter('${collection}', i, {}) as IDataObject${jk});`);
        }
        bodyVar = 'body';
    }

    if (op.value === 'getAll') {
        L.push(`\t\tconst returnAll = this.getNodeParameter('returnAll', i, false) as boolean;`);
        if (ep.method === 'GET') {
            needs.add('cashwerkApiRequest');
            if (qsVar === '{}') { L.push('\t\tconst qs: IDataObject = {};'); qsVar = 'qs'; }
            L.push(`\t\tif (!returnAll && qs.limit === undefined) qs.limit = this.getNodeParameter('limit', i, 50) as number;`);
            L.push(`\t\treturn cashwerkApiRequest.call(this, 'GET', \`${path}\`, {}, qs);`);
        } else {
            needs.add('cashwerkApiRequestAllItems');
            L.push(`\t\tconst limit = returnAll ? 0 : (this.getNodeParameter('limit', i, 50) as number);`);
            L.push(`\t\treturn cashwerkApiRequestAllItems.call(this, '${ep.method}', \`${path}\`, ${bodyVar}, ${qsVar}, limit);`);
        }
        L.push('\t}');
        return L.join('\n');
    }

    needs.add('cashwerkApiRequest');
    const args = [`'${ep.method}'`, `\`${path}\``];
    if (bodyVar !== '{}' || qsVar !== '{}') args.push(bodyVar);
    if (qsVar !== '{}') args.push(qsVar);
    L.push(`\t\treturn cashwerkApiRequest.call(this, ${args.join(', ')});`);
    L.push('\t}');
    return L.join('\n');
}

function ensureImports(src: string, needs: Set<string>): string {
    const m = src.match(/import \{([^}]*)\} from '\.\.\/GenericFunctions';/);
    const have = new Set((m?.[1] ?? '').split(',').map(s => s.trim()).filter(Boolean));
    const wanted = [...needs].filter(n => n !== 'orgId');
    if (needs.has('orgId')) wanted.push('getOrganizationId');
    for (const w of wanted) have.add(w);
    const line = `import { ${[...have].sort().join(', ')} } from '../GenericFunctions';`;
    if (m) return src.replace(m[0], line);
    return src.replace(/(from 'n8n-workflow';\n)/, `$1\n${line}\n`);
}

function main(): void {
    const spec = JSON.parse(readFileSync(SPEC_PATH, 'utf8')) as OpenApiDocument;
    const groups = groupEndpointsByTag(spec);
    const seenResources = new Set<string>();
    let added = 0;

    for (const [tag, config] of Object.entries(TAG_CONFIG)) {
        if (seenResources.has(config.resource)) continue;
        seenResources.add(config.resource);
        const endpoints = groups.get(tag);
        if (!endpoints) continue;

        const fnName = `execute${pascalCase(config.resource)}`;
        const execFile = resolve(EXEC_DIR, `${config.domain}.ts`);
        if (!existsSync(execFile)) { console.log(`⚠️  ${config.resource}: no executor file ${config.domain}.ts`); continue; }
        let src = readFileSync(execFile, 'utf8');
        const fn = findFunction(src, fnName);
        if (!fn) { console.log(`⚠️  ${config.resource}: ${fnName} not found in ${config.domain}.ts`); continue; }

        const described = describedOps(config.resource, config.descFile);
        const body = src.slice(fn.bodyOpen, fn.bodyClose);
        const needs = new Set<string>();
        const branches: string[] = [];

        for (const { classified, endpoint } of classifyOperations(endpoints)) {
            if (!described.has(classified.value)) continue;
            if (new RegExp(`['"]${classified.value}['"]`).test(body)) continue;
            branches.push(branch(spec, classified, endpoint, needs));
        }
        if (!branches.length) continue;

        const fnBody = src.slice(fn.bodyOpen, fn.bodyClose);
        const throwIdx = fnBody.search(/\n\t(?:throw new Error\(`Unknown operation|throw new NodeOperationError\()/);
        const insertAt = throwIdx >= 0 ? fn.bodyOpen + throwIdx : fn.bodyClose - 1;
        let chunk = '\n' + branches.join('\n\n') + '\n';
        if (needs.has('orgId') && !/const orgId = /.test(fnBody)) {
            const firstIf = fnBody.indexOf('\n\tif (');
            const orgLine = '\n\tconst orgId = await getOrganizationId.call(this);\n';
            src = src.slice(0, fn.bodyOpen + firstIf) + orgLine + src.slice(fn.bodyOpen + firstIf);
            // re-read offsets after insertion
            const fn2 = findFunction(src, fnName)!;
            const body2 = src.slice(fn2.bodyOpen, fn2.bodyClose);
            const t2 = body2.search(/\n\t(?:throw new Error\(`Unknown operation|throw new NodeOperationError\()/);
            const at2 = t2 >= 0 ? fn2.bodyOpen + t2 : fn2.bodyClose - 1;
            src = src.slice(0, at2) + chunk + src.slice(at2);
        } else {
            src = src.slice(0, insertAt) + chunk + src.slice(insertAt);
        }
        src = ensureImports(src, needs);
        added += branches.length;
        console.log(`📝 ${config.domain}.ts ${fnName}: +${branches.length} ops`);
        if (!DRY_RUN) writeFileSync(execFile, src);
    }
    console.log(`${DRY_RUN ? '(dry run) ' : ''}✅ ${added} executor branches generated.`);
}

main();
