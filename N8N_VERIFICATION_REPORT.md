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
| **Öffentliches Repo** | ❌ | `github.com/cashwerk/Software` → 404; Org existiert nicht; lokales Monorepo hat kein Git-Remote |
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

### 2.7 Geänderte Dateien (alles **uncommitted**)
- Geändert: `package.json`, `credentials/*.ts` (2), `nodes/Cashwerk/Cashwerk.node.ts`, `CashwerkTrigger.node.ts`, `GenericFunctions.ts`, `constants.ts`, alle 43 `descriptions/*.ts`, 14 `executors/*.ts`.
- Neu: `.github/workflows/publish.yml`, `.prettierrc`, `eslint.config.mjs`, `nodes/Cashwerk/cashwerk.svg`, `nodes/Cashwerk/cashwerk.dark.svg`, dieser Report.
- Unberührt: `scripts/openapi-external.json` (deine uncommitteten +4.497 Zeilen), `executors/chat.ts`, `README.md`, `LICENSE`, `cashwerk.png`.

---

## 3. Offene Punkte / Risiken

| # | Punkt | Was tun |
|---|---|---|
| A | **`AbsenceDescription.ts` und `ChatDescription.ts`**: deine vorherigen uncommitteten Änderungen sind beim Reset auf den Git-Stand verloren gegangen. | Im Monorepo-Root `npm run n8n:generate-descriptions` ausführen (liest die aktualisierte `openapi-external.json`), danach `npx prettier --write` + `npm run lint:fix` über die beiden Dateien, `npm run lint` muss 0 bleiben. |
| B | **`executors/booking.ts` ist ein Stub** – 21 Operationen werfen `not yet implemented`. n8n testet verifizierte Nodes manuell; eine durchgehend werfende Resource ist ein wahrscheinlicher Ablehnungsgrund. | Entweder implementieren oder Booking-Resources vor dem Submit aus `Cashwerk.node.ts` (Resource-Liste + Executor-Map + Description-Imports) herausnehmen. |
| C | `author.email` in `package.json` ist aktuell `m.zaric@openhandwerk.de` und wird auf npm öffentlich. | Bei Bedarf auf eine Firmenadresse ändern. |
| D | `cashwerk.png` liegt weiterhin im Package. | Optional löschen (wird nicht mehr referenziert). |
| E | `repository.url` zeigt auf `github.com/cashwerk/Software` (404). | Siehe Schritt 1 unten. |

---

## 4. Nächste Schritte (nur du, kein Code, ~25 Min)

### Schritt 1 – Öffentliches Repo
GitHub-Org **`cashwerk`** anlegen (existiert nicht; `github.com/cashwerk/Software` ist 404). Zwei Varianten:

- **Variante A (empfohlen): eigenes Repo `cashwerk/n8n-nodes-cashwerk`.**
  Den Ordner `packages/nx-cashwerk-n8n` als eigenständiges Repo pushen. Dann in `package.json` anpassen:
  ```json
  "repository": { "type": "git", "url": "https://github.com/cashwerk/n8n-nodes-cashwerk.git" },
  "bugs": { "url": "https://github.com/cashwerk/n8n-nodes-cashwerk/issues" }
  ```
  (das Feld `"directory"` entfällt).
- **Variante B: gesamtes Monorepo `cashwerk/Software` öffentlich.**
  Dann stimmt die bestehende `repository.url` inkl. `"directory": "packages/nx-cashwerk-n8n"` bereits. Nur sinnvoll, wenn wirklich alles im Monorepo öffentlich sein darf.

Vor dem ersten Push: Punkte A und B aus Abschnitt 3 klären, dann alle Änderungen committen.

### Schritt 2 – Trusted Publisher auf npm
npmjs.com → Package **`n8n-nodes-cashwerk`** → *Settings* → *Publish access* → *Trusted Publishers* → *Add a publisher* → **GitHub Actions**:
- Repository owner: `cashwerk`
- Repository name: `n8n-nodes-cashwerk` (bzw. `Software` bei Variante B)
- Workflow name: `publish.yml`
- Environment: leer lassen

Kein `NPM_TOKEN` nötig. (Fallback: Granular Access Token mit Publish-Recht als Secret `NPM_TOKEN` im Repo.)

### Schritt 3 – Release
Lokal im Package-Ordner:
```bash
npm run release
```
Läuft Lint + Build, fragt die Version ab (→ **1.0.1**), aktualisiert Changelog, committet, taggt `1.0.1`, pusht. Der Tag startet `publish.yml`, das mit Provenance auf npm veröffentlicht. Kontrolle: auf der npm-Seite des Packages muss unter der Version ein „Provenance"-Badge erscheinen.

### Schritt 4 – Creator Portal
Auf dem n8n Creator Portal anmelden und den Node zur Verifizierung einreichen (npm-Name + Repo-URL). n8n zieht das Package von npm, prüft Provenance, Lint, UX-Guidelines und README. Bei Annahme erscheint der Node auf `n8n.io/integrations` und im Nodes-Panel aller n8n-Instanzen.

### Optional – zusätzliche Sichtbarkeit ohne Code
- 2–3 Workflow-Templates über `creators.n8n.io` einreichen (jede Template-Seite auf `n8n.io/workflows` ist ein eigener Link).
- Launch-Post im n8n-Community-Forum.

---

## 5. Referenzen
- Submit-Doku: https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/
- Starter (Workflow-Quelle): https://github.com/n8n-io/n8n-nodes-starter
- Package auf npm: https://www.npmjs.com/package/n8n-nodes-cashwerk
