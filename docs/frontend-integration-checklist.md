# Frontend-Backend Integration Checklist

This document outlines the manual verification steps for the MFTL Collections platform integration.

## 1. Environment Setup

### Backend (Azure Functions)
- **Path**: `backend/src/MFTL.Collections.Api`
- **Command**: `func start --port 7072`
- **Base URL**: `http://localhost:7072/api/v1`
- **Database**: Ensure Migrations are applied and `local.settings.json` is configured.

### Frontend (Vue 3)
- **Path**: `frontend`
- **Command**: `npm run dev`
- **Env Verification**:
  - `VITE_API_BASE_URL=http://localhost:7072/api/v1`
  - `VITE_AUTH_DEV_BYPASS=true`
  - `VITE_DEBUG_API=true`

---

## 2. Core Flows Verification

### [ ] Admin: Create Event
- **Route**: `/admin/events/new`
- **Action**: Fill Title, Description, and Date. Click "Create event".
- **Expected API**: `POST /events`
- **Success Criteria**: 
  - Success message shown.
  - Redirected to `/admin/events/{guid}`.
  - New event visible in `/admin/events`.

### [ ] Admin: Event Detail & Funds List
- **Route**: `/admin/events/{guid}`
- **Action**: Load the page.
- **Expected API**: `GET /events/{guid}`
- **Success Criteria**: 
  - Event details displayed correctly.
  - "View recipient funds" button works.

### [ ] Admin: Create Recipient Fund
- **Route**: `/admin/events/{guid}/recipient-funds/new`
- **Action**: Fill Name, Description, Target Amount.
- **Expected API**: `POST /recipient-funds` (payload includes `eventId`)
- **Success Criteria**:
  - Success message shown.
  - Redirected back to funds list.

### [ ] Collector: Cash Contribution
- **Route**: `/collector/contributions/new`
- **Action**:
  1. Select Assigned Event from dropdown.
  2. Select Recipient Fund (filtered by event).
  3. Enter Contributor Name and Amount.
  4. Click "Issue receipt".
- **Expected API**: `POST /contributions/cash`
- **Success Criteria**:
  - Success state shown in UI.
  - "Issue receipt" button disabled after success.

---

## 3. Troubleshooting & Observability

### API Debugging
When `VITE_DEBUG_API=true` is set in `.env`, all requests are logged to the browser console:
- **Grouped by URL**: Method, Status, and Duration.
- **Correlation ID**: Logged for both success and error responses.

### Common Failure Points
- **400 Bad Request**: Usually indicates a GUID parsing error or missing required field (e.g. `eventId`). Check Console for payload vs contract.
- **404 Not Found**: Verify `VITE_API_BASE_URL` ends in `/v1` and the backend is running on port 7072.
- **CORS Errors**: Ensure the backend `local.settings.json` has `"CORS": "*"` or the specific frontend origin.

### Backend Contract Examples

#### Create Event (POST /events)
```json
{
  "title": "Missions 2026",
  "description": "Annual outreach program",
  "eventDate": "2026-05-15T00:00:00Z"
}
```

#### Record Cash (POST /contributions/cash)
```json
{
  "eventId": "guid",
  "recipientFundId": "guid",
  "amount": 150.00,
  "contributorName": "John Doe",
  "note": "Optional note"
}
```
