<h1 align="left">
  Pathmarks
  <img src="public/icons/icon128.png" alt="Pathmarks Icon" width="100" style="margin-left: 1rem;" />
</h1>
Pathmarks is a lightweight browser extension to manage and access useful application paths.

## Features

- Save and manage custom shortcuts (e.g. `/admin`, `/config/users`)
- Search and filter pathmarks by title or path
- Open links in new tabs next to your current one
- Intuitive popup with quick access
- Clean and editable configuration with JSON

## How It Works

1. Click the extension icon to open the popup.
2. Use the search bar to find pathmarks.
3. Click on a pathmark to open it in a new tab next to your current tab.
4. Edit your pathmarks via the **Options** page.

## Configuration

You can define your setup like this in the options page:

```json
{
  "pathmarks": [
    { "title": "Dashboard", "path": "/dashboard" },
    { "title": "User Management", "path": "/config/users" },
    { "title": "Admin Panel", "path": "/admin" },
    { "title": "Audit Logs", "path": "/logs/audit" },
    { "title": "Feature Flags", "path": "/config/flags" },
    { "title": "Permission Settings", "path": "/config/permissions" },
    { "title": "API Explorer", "path": "/docs/api" },
    { "title": "System Monitor", "path": "/monitoring/system" },
    { "title": "Error Tracker", "path": "/errors" },
    { "title": "Support Inbox", "path": "/support/inbox" }
  ]
}