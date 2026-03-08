# @cashwerk/n8n-nodes-cashwerk

n8n community node for the **cashwerk** API. Provides full CRUD operations for CRM, Invoicing, Project Management, Time Tracking and Sales Pipeline entities, plus a webhook-based trigger node for real-time event automation.

## Installation

### From GitHub Package Registry (private)

```bash
npm install @cashwerk/n8n-nodes-cashwerk --registry=https://npm.pkg.github.com
```

### Community Node (public, once published)

1. Open **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `@cashwerk/n8n-nodes-cashwerk`
4. Click **Install**

## Credentials

1. In n8n, go to **Credentials > New Credential > cashwerk API**
2. Enter your **API Key** (starts with `cw_live_` or `cw_test_`)
3. Enter your **Base URL** (default: `https://production.cashwerk.io`)
4. Click **Test** to verify the connection

API keys can be generated in the cashwerk web app under **Settings > API & Integrations**.

## Nodes

### cashwerk (Action Node)

Perform CRUD operations on cashwerk entities.

| Resource | Operations |
|---|---|
| **Contact** | Create, Get, Get Many, Update, Delete (archive) |
| **Company** | Create, Get, Get Many |
| **Invoice** | Create, Get, Get Many, Send (email) |
| **Offer** | Create, Get, Get Many |
| **Project** | Create, Get, Get Many |
| **Task** | Get, Get Many |
| **Deal** | Create, Get, Get Many |
| **Time Entry** | Create, Get Many |

### cashwerk Trigger

Starts a workflow when a cashwerk event occurs. Events are delivered in real-time via webhooks.

Webhook subscriptions are automatically registered when the workflow is activated and removed on deactivation.

**Available events:**

- `contact.create`, `contact.update`, `contact.delete`, `contact.archive`
- `company.create`, `company.update`, `company.delete`
- `invoice.create`, `invoice.update`, `invoice.delete`
- `offer.create`, `offer.update`
- `deal.create`, `deal.update`
- `project.create`, `project.update`
- `task.create`, `task.update`
- `time_entry.create`, `time_entry.update`
- `*` (all events)

## Local Development & Testing

### 1. Build the package

```bash
cd packages/nx-cashwerk-n8n
npm install
npm run build
```

### 2. Run n8n locally with the custom node

**Option A: npm link (recommended for development)**

```bash
# In packages/nx-cashwerk-n8n
npm link

# In your n8n installation directory (~/.n8n or wherever n8n is installed)
npm link @cashwerk/n8n-nodes-cashwerk

# Start n8n
npx n8n start
```

**Option B: Docker with volume mount**

```bash
# Build the package first
cd packages/nx-cashwerk-n8n && npm run build

# Run n8n with the custom node mounted
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd):/home/node/.n8n/custom/@cashwerk/n8n-nodes-cashwerk \
  n8nio/n8n
```

**Option C: N8N_CUSTOM_EXTENSIONS env var**

```bash
cd packages/nx-cashwerk-n8n && npm run build
N8N_CUSTOM_EXTENSIONS="/absolute/path/to/packages/nx-cashwerk-n8n" npx n8n start
```

### 3. Point to localhost

When creating the cashwerk API credential in n8n, set the **Base URL** to your local server:

```
http://localhost:3000
```

This way you can test against your local `nx-server` without touching production data.

### 4. Watch mode for development

In one terminal, run the package in watch mode:

```bash
cd packages/nx-cashwerk-n8n
npm run dev
```

In another terminal, run n8n. Restart n8n after each rebuild to pick up changes.

## Publishing

### GitHub Package Registry

The package is published alongside the other `@cashwerk/*` packages:

```bash
cd packages/nx-cashwerk-n8n
npm publish
```

Requires authentication to `https://npm.pkg.github.com` (same as `@cashwerk/shared-types` etc.).

## API Scopes

The API key must have the required scopes for the operations you want to perform. Scopes are configured when creating the API key in the cashwerk web app. Common scopes:

- `CRM_CONTACTS_READ`, `CRM_CONTACT_CREATE`, `CRM_CONTACT_UPDATE`, `CRM_CONTACT_DELETE`
- `CRM_COMPANIES_READ`, `CRM_COMPANY_CREATE`
- `INVOICES_READ`, `INVOICE_CREATE`, `INVOICE_SEND_BY_MAIL`
- `OFFERS_READ`, `OFFER_CREATE`
- `PROJECTS_READ`, `PROJECT_CREATE`
- `TASKS_READ`, `TASK_READ`
- `DEALS_READ`, `DEAL_CREATE`
- `TIME_TRACKINGS_ORG_READ`, `TIME_TRACKING_START`

## License

MIT
