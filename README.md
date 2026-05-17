# n8n-nodes-cashwerk

n8n community node for the **cashwerk** API. Provides full CRUD operations across 38 resources spanning CRM, Invoicing, Project Management, Drive, Calendar, Asset Management, Work & Time Tracking, Task Management and Sales Pipeline -- plus a webhook-based trigger node for real-time event automation.

## Installation

### Community Node (recommended)

1. Open **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `n8n-nodes-cashwerk`
4. Click **Install**

### npm

```bash
npm install n8n-nodes-cashwerk
```

## Credentials

This package supports two authentication methods:

### API Key

1. In n8n, go to **Credentials > New Credential > cashwerk API**
2. Enter your **API Key** (starts with `cw_live_` or `cw_test_`)
3. Select the **Environment** (Production or Staging)
4. Click **Test** to verify the connection

### OAuth2

1. In n8n, go to **Credentials > New Credential > cashwerk OAuth2 API**
2. Select the **Environment** (Production or Staging)
3. Follow the OAuth2 authorization flow
4. Optionally specify **Scopes** (space-separated, e.g. `contacts:read invoices:read`)

API keys and OAuth applications can be managed in the cashwerk web app under **Settings > API & Integrations**.

## Nodes

### cashwerk (Action Node)

Perform operations on cashwerk entities. Supports 38 resources with 200+ operations.

#### CRM

| Resource | Operations |
|---|---|
| **Contact** | Get, Get Many, Create, Update, Archive, Archive Many, Restore, Restore Many, Unlink Company, Link Companies, Upload Avatar, Export CSV, Export PDF, Get Deals, Get Invoices, Get Offers, Get Projects, Get Tasks, Get Cancellation Invoices |
| **Company** | Get, Get Many, Create, Update, Archive, Archive Many, Restore, Restore Many, Add Contacts, Remove Contact, Upload Logo, Export CSV, Export PDF, Get Deals, Get Invoices, Get Offers, Get Projects, Get Tasks, Get Cancellation Invoices |
| **Portfolio** | Get, Get Many, Create, Update, Delete |
| **CRM Metrics** | Get Contact Metrics, Get Company Metrics |

#### Invoicing & Finance

| Resource | Operations |
|---|---|
| **Invoice** | Get, Get Many, Create, Update, Archive, Restore, Book, Cancel, Cancellation, Mark as Paid, Revert Committed, Send, Get Dashboard, Create XInvoice, Create ZUGFeRD, Validate XInvoice |
| **Offer** | Get, Get Many, Create, Update, Archive, Restore, Book, Cancel, Send, Convert to Invoice, Create from Deal |
| **Cancellation Invoice** | Get, Get Many, Create, Update, Archive, Restore, Create XInvoice, Create ZUGFeRD |
| **Incoming Payment** | Get by Invoice, Total, Create for Invoice, Delete |
| **Tax Rate** | Get, Get Many, Create, Update, Delete, Delete Many |
| **Sales Tax Regulation** | Get, Get Many, Create, Update, Delete, Delete Many |

#### Project Management

| Resource | Operations |
|---|---|
| **Project** | Get, Create, Query, Archive, Restore, Customer, Add Assignees, Update Assignees, Get Assignees, Add Contact Persons, Get Dashboard, Get Statuses, Update Address with Portfolio, Update Default Task Board, Upload Image |

#### Task Management

| Resource | Operations |
|---|---|
| **Task Board** | Get, Get Many, Create, Activate, Archive, Create Column, Invite User, Remove User, Update Due Date, Update Project, Update Title |
| **Task Board Column** | Delete, Create Task, Update Name |
| **Task** | Get, Get Many, Delete, Add Collaborator, Remove Collaborator, Add Companies, Add Contacts, Add Tag, Remove Tag, Create Comment, Create Subtask, Remove Subtask, Mark as Completed, Mark as Incomplete, Update Assignee, Update Description, Update Due Date, Update Title |
| **Task Comment** | Update, Delete |

#### Sales Pipeline

| Resource | Operations |
|---|---|
| **Deal** | Get, Get by Pipeline, Create, Update, Delete, Add Companies, Add Contacts, Add Tag, Stage, Update Lines |
| **Pipeline** | Get, Get Many, Create, Update, Archive, Restore |

#### Drive (File Management)

| Resource | Operations |
|---|---|
| **Drive** | Get, Get Many, Search, Init, Create Folder, Get Contents, Get Folders, Get Trash, Get View, Upload Direct, Clear |
| **Drive File** | Update, Delete, Get Details, Move, Move to Trash, Restore, Update Tags |
| **Drive Folder** | Get, Update, Delete, Get Details, Get Size, Get Subfolders, Move, Move to Trash, Restore, Update Tags, Zip |
| **Drive Sharing** | Get Shared Items, Get Shared File, Get Shared Folder, Get Folder Contents, Share Folder, Share File, Unshare Folder, Unshare File, Update Access, Delete Access, Update Share |

#### Calendar

| Resource | Operations |
|---|---|
| **Calendar** | Get, Get Many, Create, Update, Delete |
| **Calendar Event** | Get, Get Many, Create, Update, Delete, Check Busy, Update Response |

#### Work & Time Tracking

| Resource | Operations |
|---|---|
| **Time Tracking** | Get, Update, Get by Date Range, Get Running, Start Tracker, Stop Tracker, Pause Tracker, Resume Tracker, Breaks, Trackings |
| **Tracking Category** | Get, Get Many, Create, Update |
| **Absence** | Get, Get Many, Create, Update, Delete, Approve, Reject, Get by Date Range, Get Meta, Get Pending |
| **Shift Plan** | Get, Get Many, Create, Update, Delete, Duplicate, Get by Date Range |
| **Work Report** | Get User Summary, Get User Report, Get User Monthly, Get Week Stats, Get Working Days, Query Trackings, Get Org Summary, Get Org Report, Export CSV, Export PDF |
| **Work Time** | Get, For User |

#### Asset Management

| Resource | Operations |
|---|---|
| **Asset Unit** | Get, Get Many, Create, Update, Delete, Search |
| **Asset Group** | Get, Get Many, Create, Update, Delete |
| **Material** | Get, Get Many, Create, Update, Delete, Delete Many, Query, Upload Image |
| **Machine** | Get, Get Many, Create, Update, Delete, Delete Many, Query, Upload Image |
| **Asset Service** | Get, Get Many, Create, Update, Delete, Delete Many, Query, Upload Image |
| **Subcontract** | Get, Get Many, Create, Update, Delete, Delete Many, Query, Upload Image |

#### Organization & Users

| Resource | Operations |
|---|---|
| **Organization** | Get |
| **User** | Get, Get Many, Get Active |
| **Mail Connection** | Get Many |

---

### cashwerk Trigger

Starts a workflow when a cashwerk event occurs. Events are delivered in real-time via webhooks with HMAC-SHA256 signature verification.

Webhook subscriptions are automatically registered when the workflow is activated and removed on deactivation.

**Available events (89 events + wildcard):**

| Category | Events |
|---|---|
| **All** | `*` (wildcard) |
| **Absence** | `absence.create`, `absence.update`, `absence.delete`, `absence.approve`, `absence.reject` |
| **Asset Manager** | `material.create/update/delete`, `machine.create/update/delete`, `asset_service.create/update/delete`, `subcontract.create/update/delete` |
| **Calendar** | `calendar.create/update/delete`, `calendar_event.create/update/delete` |
| **CRM** | `contact.create/update/delete/archive/restore`, `company.create/update/delete/archive/restore`, `portfolio.create/update/delete` |
| **Deal** | `deal.create`, `deal.update`, `deal.delete`, `deal.stage_changed` |
| **Drive** | `drive.file.upload/update/delete`, `drive.folder.create/delete` |
| **Invoice** | `invoice.create/update/delete/book/paid/send/cancel` |
| **Cancellation Invoice** | `cancellation_invoice.create/update` |
| **Payment** | `incoming_payment.create/delete` |
| **Offer** | `offer.create/update/delete/send/book/cancel` |
| **Organization** | `organization.update` |
| **Pipeline** | `pipeline.create/update/delete` |
| **Project** | `project.create/update/delete/archive` |
| **Shift Plan** | `shift_plan.create/update/delete` |
| **Task** | `task.create/update/delete/complete`, `task_board.create/delete` |
| **Time Tracking** | `time_entry.create/update/delete`, `tracker.start/stop` |
| **User** | `user.create/update/delete/archive/activate` |

## Workflow Templates

The package ships with example workflow templates:

- **Daily Invoice Summary** -- Scheduled report of daily invoices sent via email
- **Deal Won to Invoice** -- Automatically create an invoice when a deal is won
- **Deal to Project Pipeline** -- Auto-create project and tasks from won deals
- **Sync Contacts from CSV** -- Bulk import contacts from a CSV file
- **New Contact to Slack** -- Real-time Slack notification when a contact is created

## License

[MIT](LICENSE)
