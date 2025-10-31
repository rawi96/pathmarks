# 🧭 Pathmarks

<img src="public/icons/icon128.png" alt="Pathmarks Icon" width="100" />

Pathmarks is a lightweight browser extension to manage and access useful application paths.

---

## ⚙️ Features

- Save and manage custom shortcuts (e.g. `/admin`, `/config/users`)
- Search and filter pathmarks by title or path
- Open links in new tabs next to your current one
- Intuitive popup with quick access
- Clean and editable configuration with JSON

---

## 🧪 Local Development

1. **Install dependencies**
   ```bash
   npm ci
   ```

2. **Build the extension**
   ```bash
   npm run build
   ```
   This will create a `dist/` folder containing the production build.

3. **Important:**  
   Before building for release, make sure to **update the version number** in both `manifest.json` and `package.json`.  
   For example:
   ```json
   {
     "version": "1.1.0"
   }
   ```

---

## 🌐 Test the Built Extension in Chrome

1. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **"Load unpacked"**.
4. Select the **`dist/`** folder created from your build.
5. Test your new features.

If everything works correctly, you can proceed to merge your branch.

---

## 🚀 Publishing a New Version

After merging your pull request to `main`, the **GitHub Actions pipeline** will:

1. Run the build command:
   ```bash
   npm run build
   ```
2. Create a ZIP file of the built extension.
3. Upload the `.zip` as an **artifact** in the GitHub Action run.

---

### 📦 How to Publish the New Version

1. Go to your **GitHub Actions** page.
2. Open the latest successful run of **"Build and Zip Chrome Extension"**.
3. Download the `pathmarks-extension` artifact (it’s a ZIP).

#### ⚠️ Known Issue:
When you download the ZIP from GitHub Actions:
- You’ll get a ZIP that contains a root folder (e.g. `pathmarks/` inside the archive).
- **You must unzip it locally**, then:
    1. Go inside that root folder.
    2. **Re-zip the contents of that folder** (so the manifest and other files are at the top level, not nested).

---

### 🧭 Upload the New Package to the Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Open your **Pathmarks** extension.
3. Click **“Package” → “Upload New Package”**.
4. Upload the ZIP file you just prepared.
5. Click **“Publish”** to submit the new version for review.

---

## 🧩 Configuration Example

You can define your setup in the **Options** page like this:

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
```

---

Happy coding! ✨  
– The Pathmarks Team
