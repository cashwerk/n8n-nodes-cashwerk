/**
 * Fix the n8n lint rules the autofixer cannot handle on generated descriptions:
 *  - sort `options` arrays of options/multiOptions params by `name`
 *  - sort `options` arrays of collection params by `displayName`
 *  - prefix boolean descriptions with "Whether …"
 *
 *   node scripts/sort-descriptions.js [files…]   (default: all descriptions)
 */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2).length
	? process.argv.slice(2)
	: fs
			.readdirSync(path.join(__dirname, '..', 'nodes', 'Cashwerk', 'descriptions'))
			.map((f) => path.join(__dirname, '..', 'nodes', 'Cashwerk', 'descriptions', f));

const propText = (obj, name) => {
	const p = obj.properties.find(
		(x) => ts.isPropertyAssignment(x) && x.name.getText() === name,
	);
	return p ? p.initializer : undefined;
};
const strVal = (init) =>
	init && (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) ? init.text : undefined;

for (const file of files) {
	let src = fs.readFileSync(file, 'utf8');
	const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
	const edits = [];

	const visit = (node) => {
		if (ts.isObjectLiteralExpression(node)) {
			const type = strVal(propText(node, 'type'));
			const opts = propText(node, 'options');
			if (opts && ts.isArrayLiteralExpression(opts) && (type === 'options' || type === 'multiOptions' || type === 'collection')) {
				const key = type === 'collection' ? 'displayName' : 'name';
				const els = opts.elements.filter(ts.isObjectLiteralExpression);
				if (els.length === opts.elements.length && els.length > 1) {
					const keyed = els.map((e) => ({ e, k: strVal(propText(e, key)) ?? '' }));
					const sorted = [...keyed].sort((a, b) => a.k.localeCompare(b.k, 'en', { sensitivity: 'base' }) || (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
					if (sorted.some((s, i) => s.e !== keyed[i].e)) {
						const start = els[0].getStart();
						const end = els[els.length - 1].getEnd();
						const sep = ',\n';
						edits.push({ start, end, text: sorted.map((s) => s.e.getText()).join(sep) });
						// do not descend into elements we are re-ordering via text; still visit children for nested sorts
					}
				}
			}
			if (type === 'boolean') {
				const d = propText(node, 'description');
				const v = strVal(d);
				if (v && !/^whether\b/i.test(v)) {
					const text = 'Whether ' + v.charAt(0).toLowerCase() + v.slice(1);
					edits.push({ start: d.getStart(), end: d.getEnd(), text: `'${text.replace(/'/g, "\\'")}'` });
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(sf);

	// apply non-overlapping edits from the end; nested edits inside a re-ordered range are dropped this pass
	edits.sort((a, b) => b.start - a.start);
	let lastStart = Infinity;
	let applied = 0;
	for (const e of edits) {
		if (e.end > lastStart) continue;
		src = src.slice(0, e.start) + e.text + src.slice(e.end);
		lastStart = e.start;
		applied++;
	}
	if (applied) fs.writeFileSync(file, src);
	if (applied) console.log(`${path.basename(file)}: ${applied} edits`);
}
