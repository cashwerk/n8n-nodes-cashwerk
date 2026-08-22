# n8n-nodes-cashwerk

n8n community node for the **cashwerk** API. Provides full CRUD operations across 43 resources spanning CRM, Invoicing, Project Management, Drive, Calendar, Asset Management, Work & Time Tracking, Task Management and Sales Pipeline -- plus a webhook-based trigger node for real-time event automation.

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

Perform operations on cashwerk entities. Supports 43 resources with 430+ operations.

#### CRM

| Resource | Operations |
|---|---|
| **Contact** | Archive, Archive Many, Create, Export Csv, Export Pdf, Find By Emails, Get, Get Appointments, Get Cancellation Invoices, Get Deals, Get Invoices, Get Many, Get Offers, Get Projects, Get Tasks, Link Companies, Restore, Restore Many, Unlink Company, Update, Upload Avatar |
| **Company** | Archive, Archive Many, Create, Export Csv, Export Pdf, Get, Get Appointments, Get Cancellation Invoices, Get Deals, Get Invoices, Get Many, Get Offers, Get Projects, Get Tasks, Link Contacts, Remove Contact, Restore, Restore Many, Update, Upload Logo |
| **Portfolio** | Create, Delete, Get, Get Many, Portfolios, Update |
| **CRM Metrics** | Get Company Metrics, Get Contact Metrics |

#### Invoicing & Finance

| Resource | Operations |
|---|---|
| **Invoice** | Archive, Archive Many, Book, Cancel, Cancellation, Create, Create X Invoice, Create Zugferd, Delete, Delete Many, Get, Get Dashboard, Get Many, Mark As Paid, Restore, Restore Many, Revert Committed, Send, Update, Validate X Invoice |
| **Offer** | Accept, Archive, Archive Many, Book, Cancel, Convert To Invoice, Create, Create From Deal, Delete, Delete Many, Get, Get Dashboard, Get Many, Get Preview, Preview From Data, Reject, Restore, Restore Many, Send, Update |
| **Cancellation Invoice** | Archive, Archive Many, Create, Create X Invoice, Create Zugferd, Delete Many, Get, Get Many, Get Preview, Restore, Restore Many, Update |
| **Incoming Payment** | Create For Invoice, Delete, Get By Invoice, Get Total |
| **Tax Rate** | Create, Delete, Delete Many, Get, Get Many, Update |
| **Sales Tax Regulation** | Create, Delete, Delete Many, Get, Get Many, Update |

#### Project Management

| Resource | Operations |
|---|---|
| **Project** | Add Assignees, Add Contact, Add Contact Persons, Archive, Archive Many, Create, Customer, Delete, Delete Many, Duplicate, Get, Get Assignees, Get Dashboard, Get Statuses, Query, Restore, Restore Many, Update, Update Address With Portfolio, Update Assignees, Update Default Task Board, Upload Image |

#### Task Management

| Resource | Operations |
|---|---|
| **Task Board** | Activate, Activate Many, Archive, Archive Many, Create, Create Column, Delete, Get, Get Many, Get Presets, Invite User, Remove User, Save As Preset, Update Due Date, Update Project, Update Title |
| **Task Board Column** | Create Task, Delete, Update Name, Update Position |
| **Task** | Add Collaborator, Add Companies, Add Contacts, Add Tag, Assign To Column, Clone, Clone Subtask, Convert To Subtask, Create Comment, Create Subtask, Delete, Get, Get Drive Folder, Get Many, Mark As Completed, Mark As Incomplete, Move To Board, Remove Collaborator, Remove Subtask, Remove Tag, Update Assignee, Update Description, Update Due Date, Update Position, Update Subtask Position, Update Title |
| **Task Comment** | Delete, Update |

#### Sales Pipeline

| Resource | Operations |
|---|---|
| **Deal** | Add Companies, Add Contacts, Add Tag, Bulk Update Positions, Create, Delete, Get, Get Drive Folder, Get Many, Stage, Update, Update Lines |
| **Pipeline** | Add Stage, Archive, Create, Delete, Get, Get Many, Reorder Stages, Restore, Update, Update Assigned Users |

#### Drive (File Management)

| Resource | Operations |
|---|---|
| **Drive** | Clear Trash, Create Folder, Get, Get Contents, Get Folders, Get Many, Get Trash, Get View, Init Chunked Upload, Search, Upload Batch, Upload File |
| **Drive File** | Delete, Get Details, Move, Move to Trash, Restore, Update, Update Tags |
| **Drive Folder** | Delete, Get, Get Details, Get Size, Get Subfolders, Move, Move to Trash, Restore, Update, Update Tags, Zip |
| **Drive Sharing** | Delete, Delete Access, Get, Get Folder Contents, Get Shared File, Get Shared Folder, Get Shared Items, Share, Share File, Share Folder, Unshare, Unshare File, Unshare Folder, Update, Update Access, Update Share |

#### Calendar

| Resource | Operations |
|---|---|
| **Calendar** | Create, Delete, Get, Get Many, Update |
| **Calendar Event** | Check Busy, Clear All Events, Convert Guest To Contact, Create, Delete, Ensure Drive Folder, Get, Get Many, Link Attachment, Split Series, Update, Update Occurrence, Update Response, Upload Attachment |

#### Booking

| Resource | Operations |
|---|---|
| **Booking** | Cancel, Create, Get, Get Many |
| **Booking Page** | Create, Delete, Get, Get Many, Share Links, Theme, Update |
| **Booking Event Type** | Availability, Create, Delete, Form Fields, Get By Page, Update |
| **Booking Date Override** | Create, Delete, Get Many, Upload Batch |

#### Chat

| Resource | Operations |
|---|---|
| **Chat** | Archive, Create, Delete, Get Many, Participants, Read, Send Message, Update |

#### Work & Time Tracking

| Resource | Operations |
|---|---|
| **Time Tracking** | Breaks, Create Break, Delete Break, Delete Breaks, Get, Get By Date Range, Get Running, Get Task Trackings, Pause Tracker, Resume Tracker, Start Tracker, Stop Tracker, Trackings, Update, Update GPS |
| **Tracking Category** | Create, Delete, Get, Get Many, Update |
| **Absence** | Approve, Create, Delete, Get, Get By Date Range, Get Many, Get Meta, Get Pending, Reject, Update |
| **Shift Plan** | Create, Delete, Duplicate, Get, Get By Date Range, Get Many, Update |
| **Work Report** | Export CSV, Export PDF, Get Organization Report, Get Organization Summary, Get User Monthly Summary, Get User Report, Get User Summary, Get User Weekly Stats, Get Working Days, Query User Trackings, Start |
| **Work Time** | Bulk Assign, Delete, For User, Get, Update, Update Vacation Days, Update Work Days |

#### Asset Management

| Resource | Operations |
|---|---|
| **Asset Unit** | Create, Delete, Get, Get Many, Search, Update |
| **Asset Group** | Create, Delete, Get, Get Many, Update |
| **Material** | Create, Delete, Delete Many, Get, Get Many, Query, Update, Upload Image |
| **Machine** | Create, Delete, Delete Many, Get, Get Many, Query, Update, Upload Image |
| **Asset Service** | Create, Delete, Delete Many, Get, Get Many, Query, Update, Upload Image |
| **Subcontract** | Create, Delete, Delete Many, Get, Get Many, Query, Update, Upload Image |

#### Organization & Users

| Resource | Operations |
|---|---|
| **Organization** | Create Branch, Create Sector, Delete Branch, Get My Organization, Invite User, Set Sector Members, Update Headquarters, Update Sector, Upload Logo |
| **User** | Activate, Archive, Create, Delete, Get, Get Active, Get Many, Update Address, Update Birth Place, Update Birthdate, Update Branch, Update Nationality, Update Position, Update Profile Data, Update Public Phone, Update Sector, Update Social Media, Update Timezone, Upload Avatar, Upload Header |
| **Mail Connection** | Get Many |

---

### cashwerk Trigger

Starts a workflow when a cashwerk event occurs. Events are delivered in real-time via webhooks with HMAC-SHA256 signature verification.

Webhook subscriptions are automatically registered when the workflow is activated and removed on deactivation.

**Available events (125 events + wildcard):**

| Category | Events |
|---|---|
| **All** | `*` (wildcard) |
| **Absence** | `absence.create/delete/update` |
| **Asset Group** | `asset_group.create/delete/update` |
| **Asset Machine** | `asset_machine.create/delete/update` |
| **Asset Material** | `asset_material.create/delete/update` |
| **Asset Service** | `asset_service.create/delete/update` |
| **Asset Subcontract** | `asset_subcontract.create/delete/update` |
| **Asset Unit** | `asset_unit.create/delete/update` |
| **Booking** | `booking.create/update` |
| **Booking Event Type** | `booking_event_type.create/delete/update` |
| **Booking Page** | `booking_page.create/delete/update` |
| **Calendar** | `calendar.create/delete/update` |
| **Calendar Event** | `calendar_event.create/delete/update` |
| **Cancellation Invoice** | `cancellation_invoice.archive/create/restore/update` |
| **Comment** | `comment.create/delete/update` |
| **Company** | `company.archive/create/delete/restore/update` |
| **Contact** | `contact.archive/create/delete/restore/update` |
| **Deal** | `deal.create/delete/update` |
| **Drive Share** | `drive_share.create/delete/update` |
| **File** | `file.create/delete/update` |
| **Folder** | `folder.create/delete/update` |
| **Incoming Payment** | `incoming_payment.create` |
| **Invoice** | `invoice.archive/create/delete/restore/update` |
| **Offer** | `offer.archive/create/delete/restore/update` |
| **Organization** | `organization.create/update` |
| **Organization Branch** | `organization_branch.create/delete/update` |
| **Organization Sector** | `organization_sector.create/delete/update` |
| **Pipeline** | `pipeline.create/delete/restore/update` |
| **Portfolio** | `portfolio.create/delete/update` |
| **Project** | `project.archive/create/delete/restore/update` |
| **Sales Tax Regulation** | `sales_tax_regulation.create/delete/update` |
| **Shift Plan** | `shift_plan.create/delete/update` |
| **Task** | `task.create/delete/update` |
| **Task Board** | `task_board.archive/create/delete/restore/update` |
| **Task Board Column** | `task_board_column.create/delete/update` |
| **Tax Rate** | `tax_rate.create/delete/update` |
| **Time Entry** | `time_entry.create/delete/update` |
| **User** | `user.archive/create/delete/update` |
| **Work Time** | `work_time.create/delete/update` |

## Workflow Templates

The package ships with example workflow templates:

- **Daily Invoice Summary** -- Scheduled report of daily invoices sent via email
- **Deal Won to Invoice** -- Automatically create an invoice when a deal is won
- **Deal to Project Pipeline** -- Auto-create project and tasks from won deals
- **Sync Contacts from CSV** -- Bulk import contacts from a CSV file
- **New Contact to Slack** -- Real-time Slack notification when a contact is created

## License

[MIT](LICENSE)
