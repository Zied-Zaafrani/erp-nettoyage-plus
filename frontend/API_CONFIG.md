# API Endpoint Configuration

## Overview
The application can be configured to connect to either your local backend or the Railway production backend. This is controlled via environment variables.

## Local Development

### Use Local Backend (Default)
This is the default configuration. The frontend connects to `http://localhost:3000/api`.

```bash
# Start the frontend (uses .env.local by default in development)
npm run dev
```

The `.env.local` file contains:
```
VITE_API_URL=http://localhost:3000/api
```

**Make sure your backend is running:**
```bash
cd backend
npm run start:dev
```

---

## Production / Remote Backend (Railway)

### Use Railway Backend

Edit `.env.local` and change:
```
VITE_API_URL=https://nettoyageplus-api.up.railway.app/api
```

Then start the frontend:
```bash
npm run dev
```

The `.env.production` file also contains the Railway URL for production builds.

---

## Switching Between Environments

### Quick Switch Script
Create a script `switch-api.sh` (or `.bat` for Windows):

**Linux/Mac:**
```bash
#!/bin/bash
if [ "$1" == "local" ]; then
  sed -i 's|VITE_API_URL=.*|VITE_API_URL=http://localhost:3000/api|' .env.local
  echo "✓ Switched to LOCAL API"
elif [ "$1" == "railway" ]; then
  sed -i 's|VITE_API_URL=.*|VITE_API_URL=https://nettoyageplus-api.up.railway.app/api|' .env.local
  echo "✓ Switched to RAILWAY API"
else
  echo "Usage: ./switch-api.sh [local|railway]"
fi
```

**Windows PowerShell:**
```powershell
# save as switch-api.ps1
param([string]$env)

$envFile = ".env.local"
$content = Get-Content $envFile

if ($env -eq "local") {
    $content = $content -replace 'VITE_API_URL=.*', 'VITE_API_URL=http://localhost:3000/api'
    Write-Host "✓ Switched to LOCAL API"
} elseif ($env -eq "railway") {
    $content = $content -replace 'VITE_API_URL=.*', 'VITE_API_URL=https://nettoyageplus-api.up.railway.app/api'
    Write-Host "✓ Switched to RAILWAY API"
} else {
    Write-Host "Usage: .\switch-api.ps1 local|railway"
    exit 1
}

$content | Set-Content $envFile
```

Usage:
```bash
# Local
./switch-api.sh local

# Railway
./switch-api.sh railway
```

---

## Troubleshooting

### "CORS" or "404 Not Found" errors?
- Verify the `VITE_API_URL` in `.env.local` is correct
- Restart your frontend dev server after changing `.env.local`
- Ensure the backend API is running and accessible

### Getting "401 Unauthorized" on Railway?
- The JWT secret might differ between local and Railway
- Try logging in again to get a fresh token
- Check that the remote database has users with correct roles

### Still seeing AGENT dashboard for all users?
- This was a bug! It's been fixed by:
  1. **Token key consistency** - Now uses `accessToken` everywhere
  2. **User persistence** - User data is stored on login/register
  3. **Token validation** - JWT validation properly checks user role

---

## Environment Variables

| Variable | Local | Railway |
|----------|-------|---------|
| `VITE_API_URL` | `http://localhost:3000/api` | `https://nettoyageplus-api.up.railway.app/api` |

