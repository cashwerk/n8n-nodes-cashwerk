# n8n-nodes-cashwerk – Verifizierungs-Report

Stand: 2026-08-22 · Package: `n8n-nodes-cashwerk` · Pfad: `packages/nx-cashwerk-n8n`

Ziel: Den cashwerk-Node als **verifizierten Community-Node** bei n8n einreichen, damit er auf `n8n.io/integrations` und im Nodes-Panel jeder n8n-Instanz erscheint (SEO: hochwertiger Backlink + Sichtbarkeit, ohne Kosten).

---

## 1. Ausgangslage (vor den Änderungen)

| Anforderung n8n | Status | Befund |
|---|---|---|
| Package-Name `n8n-nodes-*` | ✅ | `n8n-nodes-cashwerk` |
| Keyword `n8n-community-node-package` | ✅ | vorhanden |
| `n8n`-Attribut (nodes + credentials) | ✅ | 2 Nodes, 2 Credentials |
| MIT-Lizenz | ✅ | LICENSE + package.json |
| README | ✅ | 177 Zeilen |
| Auf npm veröffentlicht | ✅ | 1.0.0 (lokal publiziert) |
| **Öffentliches Repo** | ✅ | `github.com/cashwerk/n8n-nodes-cashwerk` (public, Branch `main`) – Org `cashwerk` existierte bereits |
| **Keine Runtime-Dependencies** | ❌ | `dependencies: { "form-data": "^4.0.5" }` |
| **Publish via GitHub Actions + Provenance** (Pflicht seit 01.05.2026) | ❌ | npm 1.0.0 ohne Attestation, kein `publish.yml` |
| `@n8n/node-cli` ≥ 0.23 | ❌ | nicht installiert |
| Linter (`npm run lint`) | ❌ | kein Script, keine Config – bei Erstlauf **2.335 Fehler** |
| n8n-node-Scaffolding | ⚠️ | handgebaut (`tsc` + `cp`) |
| SVG-Icon (light/dark) | ❌ | nur `cashwerk.png` |

---

## 2. Was erledigt wurde

### 2.1 Runtime-Dependency entfernt
- `form-data` aus `package.json` gestrichen.
- `cashwerkApiUploadFile` in `nodes/Cashwerk/GenericFunctions.ts` baut den `multipart/form-data`-Body jetzt von Hand (Boundary + `Buffer.concat`), setzt `Content-Type`/`Content-Length` selbst und schickt den Buffer über `this.helpers.httpRequest`.
- `dependencies` ist damit leer → `npm pack` bestätigt: **0 Dependencies**.

### 2.2 n8n-node-CLI + Tooling
- devDependencies: `@n8n/node-cli@0.44.5`, `eslint@9`, `prettier@3`, `release-it@20`.
- Scripts wie im offiziellen Starter:
  `build` → `n8n-node build`, `lint` / `lint:fix` → `n8n-node lint`, `release` → `n8n-node release`, `prepublishOnly` → `n8n-node prerelease`, `dev` → `n8n-node dev`, `build:watch` → `tsc --watch`.
- `engines.node >= 20.15`.
- Neue Dateien: `eslint.config.mjs` (n8n-Config), `.prettierrc` (n8n-Stil: Tabs, Single Quotes, printWidth 100).

### 2.3 Publish-Workflow mit Provenance
- `.github/workflows/publish.yml` 1:1 aus `n8n-io/n8n-nodes-starter` übernommen.
- Trigger: Git-Tag `*.*.*`; Job hat `id-token: write` → npm-Provenance über GitHub-OIDC.
- Funktioniert ohne Secret (Trusted Publisher) oder alternativ mit `NPM_TOKEN`.

### 2.4 Linter: 2.335 → 0
Ablauf (der n8n-Autofixer setzt mehrzeilige Objekte voraus; die generierten Descriptions waren einzeilig und wurden beim ersten Fix-Lauf in 20 Dateien syntaktisch zerstört – alle Dateien wurden daraufhin auf Git-Stand zurückgesetzt und der Prozess neu aufgesetzt):
1. Prettier über `nodes/**` und `credentials/**`.
2. `eslint --fix` pro Datei (3 Durchläufe), nach jeder Datei `tsc`-Guard mit automatischem Revert bei Bruch.
3. AST-Skript (TypeScript-Compiler-API) für nicht-autofixbare Regeln: 183 `options`-Arrays alphabetisch nach `displayName`/`name` sortiert, 51 Boolean-Beschreibungen mit „Whether …" versehen.
4. Manuelle Fixes:
   - `Cashwerk.node.ts`: `NodeConnectionTypes.Main` statt `'main'`; `NodeOperationError` statt `Error`; Fehler im Execute-Loop werden als `NodeOperationError` mit `itemIndex` geworfen; `any` → `IDataObject` in allen `loadOptions`-Mappern; ungenutzter Import entfernt.
   - `CashwerkTrigger.node.ts`: `subtitle: '={{$parameter["events"]}}'`; die beiden leeren `catch`-Blöcke (`checkExists`, `delete`) loggen jetzt über `this.logger.warn`.
   - `GenericFunctions.ts`: `do … while (true)` → `while (hasMore)`; `catch (error: any)` → `unknown` + gezielter Cast; `(this as any)` → `IExecuteFunctions`; zwei begründete `eslint-disable-next-line` für die generischen `Promise<any>`-Request-Helper.
   - Executors: Rückgabetyp `Promise<any>` → `Promise<unknown>`; ungenutzte Imports/`orgId`-Variablen entfernt; ungenutzte `i`-Parameter in Stubs als `_i` mit Disable-Kommentar.
   - Credentials: `icon: Icon = { light, dark }` ergänzt.
   - `package.json`: `author.email` gesetzt (n8n-Regel `valid-author`), `peerDependencies.n8n-workflow: "*"` (Regel `valid-peer-dependencies`).

### 2.5 Icons
- `nodes/Cashwerk/cashwerk.svg` (light) und `cashwerk.dark.svg` (dark), abgeleitet vom Site-Favicon.
- Beide Nodes und beide Credentials nutzen `{ light, dark }`.
- `n8n-node build` kopiert sie nach `dist/` (verifiziert).

### 2.6 Verifikation
```
npx eslint nodes credentials package.json   → 0 errors, 0 warnings
npx tsc --noEmit                            → exit 0
npm run build (n8n-node build)              → ✓ Build successful
npm pack --dry-run                          → 169.5 kB, 265 Dateien, deps: none
```

### 2.7 Alle Operationen ausführbar (Session 2026-08-22, abends)
- **Befund:** nicht nur Booking war ein Stub – 125 von 458 in den Descriptions angebotenen Operationen hatten **keinen Executor-Zweig** (Folge der früheren Description-Regeneration). Jede davon hätte im n8n-Test „Unknown operation" geworfen.
- `executors/booking.ts` von Hand implementiert (21 Ops, alle auf die `/booking/*`-Routen der Spec gemappt).
- Neues Script `scripts/generate-executor-ops.ts`: erzeugt fehlende Executor-Zweige aus der OpenAPI-Spec mit **derselben Klassifikation** wie der Description-Generator (Parameternamen `id`/`filters`/`additionalFields`/… passen daher zusammen). 121 Zweige generiert.
- Gemeinsamer Helper `cleanCollection()` in `GenericFunctions.ts` (leere Collection-Einträge entfernen, `json`-Felder parsen).
- 19 generierte **Duplikate** entfernt (z. B. Company „Deals a company" neben „Get company deals", Project „Get Many" → zeigte auf `/projects/{id}/contacts`), ~30 irreführende Ops **umbenannt** (Organization `create` → `createSector`, TimeTracking `create` → `createBreak`, Chat `messages` → `sendMessage`, …). Der Generator kennt die Liste jetzt als `OP_EXCLUSIONS` / `OP_ALIASES` und fügt sie nicht wieder hinzu.
- Neues Script `scripts/sort-descriptions.js` (TypeScript-AST): sortiert `options`/`collection`-Arrays und setzt „Whether …" – ersetzt das verlorene AST-Script aus Abschnitt 2.4.
- Trigger-Events regeneriert (125 Events + Wildcard), README-Tabellen (Resources/Operations/Events) aus den Descriptions neu erzeugt, `package-lock.json` für `npm ci` im Workflow erzeugt, `cashwerk.png` gelöscht, `registry-url` im Workflow ergänzt.
- **Abdeckung:** 435 Operationen in 43 Resources, 435 implementiert, 0 verwaist.

### 2.8 Verifikation (Endstand)
```
npx eslint nodes credentials package.json   → 0 errors, 0 warnings
npx prettier --check                        → clean
npx tsc --noEmit                            → exit 0
npm run build                               → ✓ Build successful
npm pack --dry-run                          → 179.5 kB, 265 Dateien, deps: none
n8n:generate-descriptions / check-triggers  → up to date
```

### 2.9 Repo & Commit
- Package-Ordner ist ein eigenständiges Git-Repo; Branch `master` → `main` umbenannt (release-it verlangt `main`).
- Alles committet (`c0ba3c9`) und nach **https://github.com/cashwerk/n8n-nodes-cashwerk** (public) gepusht.
- `package.json`: `repository`/`bugs` zeigen auf das neue Repo.

### 2.10 Geänderte Dateien (historisch, Session 1)
- Geändert: `package.json`, `credentials/*.ts` (2), `nodes/Cashwerk/Cashwerk.node.ts`, `CashwerkTrigger.node.ts`, `GenericFunctions.ts`, `constants.ts`, alle 43 `descriptions/*.ts`, 14 `executors/*.ts`.
- Neu: `.github/workflows/publish.yml`, `.prettierrc`, `eslint.config.mjs`, `nodes/Cashwerk/cashwerk.svg`, `nodes/Cashwerk/cashwerk.dark.svg`, dieser Report.
- Unberührt: `scripts/openapi-external.json` (deine uncommitteten +4.497 Zeilen), `executors/chat.ts`, `README.md`, `LICENSE`, `cashwerk.png`.

---

## 3. Offene Punkte / Risiken

| # | Punkt | Status |
|---|---|---|
| A | `AbsenceDescription.ts` / `ChatDescription.ts` regenerieren | ✅ erledigt (Generator lief, Lint 0) |
| B | `executors/booking.ts` Stub | ✅ implementiert – plus alle anderen 121 fehlenden Ops (2.7) |
| C | `author.email` | ✅ `milos@cashwerk.io` (= npm-Account-Mail) |
| D | `cashwerk.png` | ✅ gelöscht |
| E | `repository.url` | ✅ `github.com/cashwerk/n8n-nodes-cashwerk` |
| F | Die 121 generierten Executor-Zweige sind **nicht live gegen die API getestet** (Lint/Typen/Build grün, Routen 1:1 aus der Spec). Vor dem Creator-Portal-Submit einen Smoke-Test in einer lokalen n8n-Instanz (`npm run dev`) über die wichtigsten Resources fahren. | ⚠️ offen |

---

## 4. Nächste Schritte

### Schritt 1 – Öffentliches Repo ✅
Erledigt: https://github.com/cashwerk/n8n-nodes-cashwerk (public, `main`, Workflow `publish.yml` enthalten).

### Schritt 2 – Trusted Publisher auf npm ✅ (2026-08-22 eingerichtet)
npmjs.com → Package **`n8n-nodes-cashwerk`** → *Settings* → *Publish access* → *Trusted Publishers* → *Add a publisher* → **GitHub Actions**:
- Repository owner: `cashwerk`
- Repository name: `n8n-nodes-cashwerk`
- Workflow name: `publish.yml`
- Environment: leer lassen

Kein `NPM_TOKEN` nötig. (Fallback: Granular Access Token mit Publish-Recht als Secret `NPM_TOKEN` im Repo.)

### Schritt 3 – Release ✅
**1.0.1 am 2026-08-22 via `publish.yml` veröffentlicht** – Provenance-Attestation (SLSA v1, sigstore logIndex 2568208655), `author.email` = milos@cashwerk.io, 0 Dependencies. Erster Lauf scheiterte, weil `n8n-node lint` im CI auch `scripts/**` lintet → in `eslint.config.mjs` ignoriert, Tag neu gesetzt.

Für künftige Releases:
```bash
cd packages/nx-cashwerk-n8n
npm version patch --tag-version-prefix=""    # → 1.0.1, Commit + Tag "1.0.1"
git push origin main --follow-tags
```
Der Tag startet `publish.yml` (`n8n-node release` im CI: lint → build → `npm publish` mit Provenance). Kontrolle: `gh run watch` bzw. npm-Seite → Version 1.0.1 mit „Provenance"-Badge.
(`npm run release` lokal ist die interaktive release-it-Variante – gleiches Ergebnis.)

### Schritt 4 – Creator Portal
Auf dem n8n Creator Portal anmelden und den Node zur Verifizierung einreichen (npm-Name + Repo-URL). n8n zieht das Package von npm, prüft Provenance, Lint, UX-Guidelines und README.

### Optional – zusätzliche Sichtbarkeit ohne Code
- 2–3 Workflow-Templates über `creators.n8n.io` einreichen (die 5 JSONs unter `templates/` sind Kandidaten).
- Launch-Post im n8n-Community-Forum.

---

## 5. Referenzen
- Submit-Doku: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/
- Starter (Workflow-Quelle): https://github.com/n8n-io/n8n-nodes-starter
- Package auf npm: https://www.npmjs.com/package/n8n-nodes-cashwerk
- Repo: https://github.com/cashwerk/n8n-nodes-cashwerk
