<h1 align="left">
  Pathmarks
  <img src="public/icons/icon128.png" alt="Pathmarks Icon" width="100" style="margin-left: 1rem;" />
</h1>
Pathmarks is a lightweight browser extension to manage and access useful application paths from any environment.

## Features

- Save and manage custom shortcuts (e.g. `/admin`, `/config/users`)
- Environment switching (e.g. dev/staging/prod)
- Open links in new tabs next to your current one
- Intuitive popup with quick access
- Clean and editable configuration with JSON

## How It Works

1. Click the extension icon to open the popup.
2. Use the configured pathmarks to open relevant routes.
3. Edit your pathmarks and environments via the **Options** page.

## Configuration

You can define your setup like this in the options page:

```json
{
  "envs": [
    { "label": "Prod", "origin": "https://example.com" },
    { "label": "Dev", "origin": "https://dev.example.com" }
  ],
  "pathmarks": [
    { "title": "Dashboard", "path": "/dashboard" },
    { "title": "User Management", "path": "/config/users" }
  ]
}