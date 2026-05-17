#!/usr/bin/env node
/**
 * n8n Description Regeneration Script
 *
 * Parses openapi-external.json to extract enum field definitions from DTO schemas,
 * then updates the corresponding *Description.ts files' option arrays to match.
 *
 * Strategy: **merge** — reads existing description files, replaces only the
 * `options: [...]` arrays for enum-type fields, preserves everything else
 * (display names, descriptions, routing logic, `// @manual` blocks).
 *
 * Usage:
 *   npm run n8n:regenerate                  # Apply updates
 *   npm run n8n:regenerate -- --dry-run     # Preview without writing
 *   npm run n8n:regenerate -- --verbose     # Detailed per-field output
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { resolve, basename } from 'path';
import type {
    OpenApiDocument,
    OpenApiSchema,
    OpenApiSchemaProperty,
    EnumFieldSpec,
    OptionReplacement,
    FileChangeResult,
    RegenerationReport,
    RegenerateCliArgs,
} from '../../../scripts/shared/openapi.interfaces';

// ─── Configuration ──────────────────────────────────────────────────

const SCRIPT_DIR = resolve(__dirname);
const SPEC_PATH = resolve(SCRIPT_DIR, 'openapi-external.json');
const DESCRIPTIONS_DIR = resolve(SCRIPT_DIR, '..', 'nodes', 'Cashwerk', 'descriptions');

const MANUAL_MARKER = '// @manual';

/**
 * DTO prefix → strip mapping. Order matters — first match wins.
 * After stripping, the remainder maps to Description file names.
 */
const DTO_PREFIXES = ['Create', 'Update', 'Query', 'Bulk', 'Filter', 'List', 'Add'];
const DTO_SUFFIXES = ['Dto', 'DTO', 'Entity', 'Payload'];

/**
 * Explicit overrides where the DTO resource name doesn't match the
 * Description file name after standard prefix/suffix stripping.
 */
const RESOURCE_NAME_OVERRIDES: Record<string, string> = {
    'AbsenceRequest': 'Absence',
    'CalendarEventItem': 'CalendarEvent',
    'TaskBoardColumnItem': 'TaskBoardColumn',
    'ShiftPlanEntry': 'ShiftPlan',
    'ShiftPlanRequest': 'ShiftPlan',
    'TimeTrackingEntry': 'TimeTracking',
    'WorkReportEntry': 'WorkReport',
    'WorkTimeEntry': 'WorkTime',
    'CompaniesToDeal': 'Deal',
    'ContactsToDeal': 'Deal',
    'CompaniesToTask': 'Task',
    'ContactsToTask': 'Task',
    'DealRequest': 'Deal',
    'IncomingPayment': 'IncomingPayment',
    'InvoiceLine': 'Invoice',
    'PipelineRequest': 'Pipeline',
    'Portfolio': 'Portfolio',
    'Project': 'Project',
    'ProjectCustomer': 'Project',
    'SalesTaxRegulation': 'SalesTaxRegulation',
    'CancellationInvoice': 'CancellationInvoice',
    'TrackingRequest': 'TrackingCategory',
    'TrackingMeta': 'TrackingCategory',
    'Trackings': 'TrackingCategory',
    'Event': 'CalendarEvent',
    'EventResponse': 'CalendarEvent',
    'Recurrence': 'CalendarEvent',
    'ExportContacts': 'Contact',
    'Contacts': 'Contact',
    'ProfileData': 'User',
    'WorkDay': 'WorkTime',
};

/**
 * Fields that should NEVER be touched by regeneration, even if they
 * happen to match a spec enum. These are structural n8n fields.
 */
const SKIP_FIELDS = new Set(['operation', 'resource', 'sortType']);

// ─── CLI ────────────────────────────────────────────────────────────

function parseArgs(): RegenerateCliArgs {
    const args = process.argv.slice(2);
    return {
        dryRun: args.includes('--dry-run') || args.includes('--check'),
        verbose: args.includes('--verbose') || args.includes('-v'),
    };
}

// ─── Enum Value → Display Name ──────────────────────────────────────

function enumValueToDisplayName(value: string): string {
    return value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ─── Schema → Resource Name ─────────────────────────────────────────

/**
 * Additional suffixes to strip AFTER the primary DTO suffix is removed.
 * E.g., `DealRequestDTO` → strip `DTO` → `DealRequest` → strip `Request` → `Deal`
 */
const SECONDARY_SUFFIXES = ['Request', 'Response', 'Item', 'Entry', 'Meta'];

function extractResourceName(schemaName: string): string | null {
    let name = schemaName;

    for (const prefix of DTO_PREFIXES) {
        if (name.startsWith(prefix) && name.length > prefix.length) {
            name = name.slice(prefix.length);
            break;
        }
    }

    for (const suffix of DTO_SUFFIXES) {
        if (name.endsWith(suffix) && name.length > suffix.length) {
            name = name.slice(0, -suffix.length);
            break;
        }
    }

    if (name === schemaName || name.length < 2) return null;

    if (RESOURCE_NAME_OVERRIDES[name]) {
        return RESOURCE_NAME_OVERRIDES[name];
    }

    for (const suffix of SECONDARY_SUFFIXES) {
        if (name.endsWith(suffix) && name.length > suffix.length) {
            const stripped = name.slice(0, -suffix.length);
            if (RESOURCE_NAME_OVERRIDES[stripped]) {
                return RESOURCE_NAME_OVERRIDES[stripped];
            }
            return stripped;
        }
    }

    return name;
}

// ─── OpenAPI Spec Parsing ───────────────────────────────────────────

function extractEnumsByResource(spec: OpenApiDocument): Map<string, EnumFieldSpec[]> {
    const resourceEnums = new Map<string, EnumFieldSpec[]>();

    const schemas = spec.components?.schemas as Record<string, OpenApiSchema> | undefined;
    if (!schemas) return resourceEnums;

    for (const [schemaName, schema] of Object.entries(schemas)) {
        const resourceName = extractResourceName(schemaName);
        if (!resourceName) continue;

        const properties = schema.properties;
        if (!properties) continue;

        for (const [fieldName, fieldDef] of Object.entries(properties)) {
            const prop = fieldDef as OpenApiSchemaProperty;
            if (!prop.enum || !Array.isArray(prop.enum)) continue;
            if (prop.enum.length === 0) continue;
            if (SKIP_FIELDS.has(fieldName)) continue;

            const enumValues = prop.enum.filter((v): v is string => typeof v === 'string');
            if (enumValues.length === 0) continue;

            const existing = resourceEnums.get(resourceName) ?? [];
            const existingField = existing.find(f => f.fieldName === fieldName);

            if (existingField) {
                const merged = new Set([...existingField.values, ...enumValues]);
                existingField.values = Array.from(merged);
            } else {
                existing.push({ fieldName, values: [...enumValues] });
                resourceEnums.set(resourceName, existing);
            }
        }
    }

    return resourceEnums;
}

// ─── Description File Parsing & Update ──────────────────────────────

interface ExistingOption {
    displayName: string;
    value: string;
}

function parseExistingOptions(optionLines: string[]): ExistingOption[] {
    const options: ExistingOption[] = [];
    const optionRegex = /\{\s*name:\s*'([^']+)',\s*value:\s*'([^']+)'/;

    for (const line of optionLines) {
        const match = line.match(optionRegex);
        if (match) {
            options.push({ displayName: match[1], value: match[2] });
        }
    }

    return options;
}

function buildOptionLines(
    specValues: string[],
    existingOptions: ExistingOption[],
    indent: string,
): string[] {
    const existingMap = new Map(existingOptions.map(o => [o.value, o.displayName]));

    return specValues.map(value => {
        const displayName = existingMap.get(value) ?? enumValueToDisplayName(value);
        return `${indent}{ name: '${displayName}', value: '${value}' },`;
    });
}

interface OptionsBlock {
    startLine: number;
    endLine: number;
    contentLines: string[];
    indent: string;
    fieldName: string;
    operationContext: string;
}

function findOptionsBlocks(lines: string[]): OptionsBlock[] {
    const blocks: OptionsBlock[] = [];
    let currentOperation = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const opMatch = line.match(/operation:\s*\['(\w+)'\]/);
        if (opMatch) {
            currentOperation = opMatch[1];
        }

        if (line.includes("name: 'operation'") && line.includes("type: 'options'")) {
            continue;
        }

        const fieldMatch = line.match(/name:\s*'(\w+)',\s*type:\s*'options'/);
        if (!fieldMatch) continue;

        const fieldName = fieldMatch[1];
        if (SKIP_FIELDS.has(fieldName)) continue;

        const optionsIdx = line.indexOf('options: [');
        if (optionsIdx === -1) continue;

        let bracketDepth = 0;
        let foundStart = false;
        let endLine = i;
        const contentStartLine = i + 1;

        for (let j = i; j < lines.length; j++) {
            const scanLine = lines[j];
            const startPos = j === i ? optionsIdx : 0;

            for (let k = startPos; k < scanLine.length; k++) {
                if (scanLine[k] === '[') {
                    bracketDepth++;
                    foundStart = true;
                }
                if (scanLine[k] === ']') {
                    bracketDepth--;
                    if (foundStart && bracketDepth === 0) {
                        endLine = j;
                        break;
                    }
                }
            }

            if (foundStart && bracketDepth === 0) break;
        }

        const contentLines = lines.slice(contentStartLine, endLine);

        const firstContentLine = contentLines.find(l => l.trim().length > 0);
        const indent = firstContentLine
            ? firstContentLine.match(/^(\s*)/)?.[1] ?? '                '
            : '                ';

        blocks.push({
            startLine: contentStartLine,
            endLine,
            contentLines,
            indent,
            fieldName,
            operationContext: currentOperation,
        });
    }

    return blocks;
}

function updateDescriptionFile(
    filePath: string,
    enumFields: EnumFieldSpec[],
    dryRun: boolean,
    verbose: boolean,
): FileChangeResult {
    const fileName = basename(filePath);
    const resourceName = fileName.replace('Description.ts', '');
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    const enumMap = new Map<string, string[]>();
    for (const field of enumFields) {
        enumMap.set(field.fieldName, field.values);
    }

    const blocks = findOptionsBlocks(lines);
    const replacements: OptionReplacement[] = [];
    let skippedManual = 0;

    const sortedBlocks = [...blocks].sort((a, b) => b.startLine - a.startLine);

    for (const block of sortedBlocks) {
        const specValues = enumMap.get(block.fieldName);
        if (!specValues) continue;

        const blockText = block.contentLines.join('\n');
        if (blockText.includes(MANUAL_MARKER)) {
            skippedManual++;
            if (verbose) {
                console.log(`  ⏭  ${fileName} → ${block.fieldName} (${block.operationContext}): skipped (@manual)`);
            }
            continue;
        }

        const existingOptions = parseExistingOptions(block.contentLines);
        const existingValues = existingOptions.map(o => o.value);

        const added = specValues.filter(v => !existingValues.includes(v));
        const removed = existingValues.filter(v => !specValues.includes(v));

        if (added.length === 0 && removed.length === 0) continue;

        const newLines = buildOptionLines(specValues, existingOptions, block.indent);

        lines.splice(
            block.startLine,
            block.endLine - block.startLine,
            ...newLines,
        );

        replacements.push({
            fieldName: block.fieldName,
            operation: block.operationContext,
            oldValues: existingValues,
            newValues: [...specValues],
            added,
            removed,
        });
    }

    const changed = replacements.length > 0;

    if (changed && !dryRun) {
        writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }

    return {
        file: fileName,
        resourceName,
        replacements,
        changed,
        skippedManual,
    };
}

// ─── Output ─────────────────────────────────────────────────────────

function printReport(report: RegenerationReport, verbose: boolean): void {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  n8n Description Regeneration Report');
    console.log(`  Mode: ${report.mode === 'dry-run' ? 'DRY RUN (no files written)' : 'APPLY'}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`  Files scanned:      ${report.filesScanned}`);
    console.log(`  Files changed:      ${report.filesChanged}`);
    console.log(`  Total replacements: ${report.totalReplacements}`);
    if (report.skippedManual > 0) {
        console.log(`  Skipped (@manual):  ${report.skippedManual}`);
    }
    console.log('');

    if (report.changes.length === 0) {
        console.log('  All description files are up to date.\n');
        return;
    }

    for (const change of report.changes) {
        if (!change.changed) continue;
        console.log(`  📝 ${change.file}:`);
        for (const rep of change.replacements) {
            const context = rep.operation ? ` (${rep.operation})` : '';
            console.log(`     ${rep.fieldName}${context}:`);
            if (rep.added.length > 0) {
                console.log(`       + Added:   ${rep.added.join(', ')}`);
            }
            if (rep.removed.length > 0) {
                console.log(`       - Removed: ${rep.removed.join(', ')}`);
            }
        }
        console.log('');
    }

    if (verbose) {
        console.log('───────────────────────────────────────────────────────────────');
        console.log('  Unchanged files:');
        for (const change of report.changes) {
            if (!change.changed) {
                console.log(`    ✅ ${change.file}`);
            }
        }
        console.log('');
    }
}

// ─── Main ───────────────────────────────────────────────────────────

function main(): void {
    const { dryRun, verbose } = parseArgs();

    console.log('\n🔄 n8n Description Regeneration');
    console.log(`   Spec:         ${SPEC_PATH}`);
    console.log(`   Descriptions: ${DESCRIPTIONS_DIR}`);
    console.log(`   Mode:         ${dryRun ? 'DRY RUN' : 'APPLY'}\n`);

    if (!existsSync(SPEC_PATH)) {
        console.error(`❌ OpenAPI spec not found at ${SPEC_PATH}`);
        console.error('   Run first: npm run api:export-spec\n');
        process.exit(1);
    }

    if (!existsSync(DESCRIPTIONS_DIR)) {
        console.error(`❌ Descriptions directory not found at ${DESCRIPTIONS_DIR}`);
        process.exit(1);
    }

    const specRaw = readFileSync(SPEC_PATH, 'utf-8');
    const spec: OpenApiDocument = JSON.parse(specRaw);
    const resourceEnums = extractEnumsByResource(spec);

    if (verbose) {
        console.log(`   Found enums for ${resourceEnums.size} resources:`);
        for (const [resource, fields] of resourceEnums) {
            const fieldNames = fields.map(f => `${f.fieldName}(${f.values.length})`).join(', ');
            console.log(`     ${resource}: ${fieldNames}`);
        }
        console.log('');
    }

    const descFiles = readdirSync(DESCRIPTIONS_DIR)
        .filter(f => f.endsWith('Description.ts'))
        .sort();

    const changes: FileChangeResult[] = [];
    let totalReplacements = 0;
    let totalSkippedManual = 0;

    for (const file of descFiles) {
        const resourceName = file.replace('Description.ts', '');
        const enumFields = resourceEnums.get(resourceName);

        if (!enumFields || enumFields.length === 0) {
            if (verbose) {
                console.log(`  ⏭  ${file}: no matching enums in spec`);
            }
            changes.push({
                file,
                resourceName,
                replacements: [],
                changed: false,
                skippedManual: 0,
            });
            continue;
        }

        const filePath = resolve(DESCRIPTIONS_DIR, file);
        const result = updateDescriptionFile(filePath, enumFields, dryRun, verbose);
        changes.push(result);
        totalReplacements += result.replacements.length;
        totalSkippedManual += result.skippedManual;
    }

    const report: RegenerationReport = {
        generatedAt: new Date().toISOString(),
        specPath: SPEC_PATH,
        mode: dryRun ? 'dry-run' : 'apply',
        filesScanned: descFiles.length,
        filesChanged: changes.filter(c => c.changed).length,
        totalReplacements,
        skippedManual: totalSkippedManual,
        changes,
    };

    printReport(report, verbose);

    if (dryRun && report.filesChanged > 0) {
        console.log(`🔴 ${report.filesChanged} file(s) would be updated. Run without --dry-run to apply.\n`);
        process.exit(1);
    }

    if (!dryRun && report.filesChanged > 0) {
        console.log(`✅ ${report.filesChanged} file(s) updated successfully.\n`);
    }

    if (!dryRun && report.filesChanged === 0) {
        console.log('✅ All description files are already up to date.\n');
    }
}

main();
