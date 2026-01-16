# 🚀 Railway Deployment Guide

Complete guide to deploy NettoyagePlus Backend to Railway.app (FREE)

---

## Prerequisites

- ✅ Backend code tested and working
- ✅ Supabase PostgreSQL database ready
- ✅ Git repository (GitHub/GitLab)
- ✅ Railway account (free)

---

## Step-by-Step Deployment

### **Step 1: Prepare Git Repository** (5 minutes)

1. **Initialize Git (if not already done):**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit - NettoyagePlus Backend"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `nettoyageplus-backend`
   - Set to Private
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/nettoyageplus-backend.git
   git branch -M main
   git push -u origin main
   ```

---

### **Step 2: Create Railway Account** (2 minutes)

1. **Sign up:**
   - Go to https://railway.app
   - Click "Login" → "GitHub" (recommended)
   - Authorize Railway to access GitHub

2. **Verify account:**
   - Railway gives you **$5 free credit** (≈ 500 hours/month)
   - No credit card required for free tier

---

### **Step 3: Deploy to Railway** (3 minutes)

1. **Create New Project:**
   - Click "New Project" on Railway dashboard
   - Select "Deploy from GitHub repo"
   - Choose `nettoyageplus-backend` repository
   - Click "Deploy Now"

2. **Configure Build:**
   - Railway will auto-detect Dockerfile
   - Build will start automatically
   - Wait 2-3 minutes for build to complete

---

### **Step 4: Configure Environment Variables** (3 minutes)

1. **Open Project Settings:**
   - Click on your deployed service
   - Go to "Variables" tab

2. **Add Environment Variables:**

   **Required Variables:**
   ```bash
   DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

   **Get your Supabase DATABASE_URL:**
   - Go to Supabase Dashboard
   - Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password

   **Generate JWT_SECRET:**
   ```bash
   # Option 1: Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Option 2: PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```

3. **Add CORS Configuration (Optional):**
   ```bash
   CORS_ORIGIN=https://your-frontend-domain.com,http://localhost:5173
   ```

4. **Click "Deploy" after adding variables**

---

### **Step 5: Get Your API URL** (1 minute)

1. **Find your deployment URL:**
   - Go to "Settings" tab
   - Scroll to "Domains"
   - Your API URL: `https://nettoyageplus-backend-production-XXXX.up.railway.app`

2. **Add custom domain (optional):**
   - Click "Generate Domain" or "Custom Domain"
   - Railway provides: `something.up.railway.app`

---

### **Step 6: Test Your Deployed API** (2 minutes)

1. **Health Check:**
   ```bash
   curl https://your-railway-url.up.railway.app/api
   # Expected: {"message":"NettoyagePlus API is running","version":"1.0.0"}
   ```

2. **Test Authentication:**
   - Use Postman/Thunder Client
   - POST to: `https://your-railway-url.up.railway.app/api/auth/login`
   - Body: `{"email": "your-email", "password": "your-password"}`

3. **Check Logs:**
   - Railway dashboard → "Deployments"
   - Click latest deployment
   - View real-time logs

---

## Post-Deployment Configuration

### **Update Frontend API URL:**

In your frontend `.env` file:
```bash
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

### **Enable CORS in Backend (if needed):**

Already configured in `src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
});
```

---

## Monitoring & Maintenance

### **View Logs:**
- Railway Dashboard → Your Project → "Deployments"
- Real-time log streaming
- Error tracking

### **Database Backups:**
- Supabase automatically backs up your database
- Manual backup: Project Settings → Database → "Database Backups"

### **Auto-Deploy on Git Push:**
- Every push to `main` branch triggers auto-deploy
- Railway rebuilds and redeploys automatically

### **Resource Usage:**
- Dashboard shows CPU, Memory, Network usage
- Free tier: 512MB RAM, 1 CPU shared
- Enough for MVP and development

---

## Troubleshooting

### **Build Fails:**
```bash
# Check Dockerfile syntax
# Verify package.json scripts
# Review Railway build logs
```

### **Database Connection Error:**
```bash
# Verify DATABASE_URL is correct
# Check Supabase project is active
# Test connection string locally first
```

### **API Not Responding:**
```bash
# Check deployment logs for errors
# Verify PORT environment (Railway sets automatically)
# Check CORS settings if frontend can't connect
```

### **Memory Issues:**
```bash
# Optimize TypeORM queries
# Enable pagination everywhere
# Consider upgrading Railway plan if needed
```

---

## Cost Management (FREE Tier)

### **Railway Free Tier Includes:**
- ✅ $5 credit/month (~500 hours)
- ✅ Unlimited projects
- ✅ Auto-scaling
- ✅ SSL certificates
- ✅ Custom domains

### **Tips to Stay Free:**
- Deploy only production version
- Use Supabase for database (separate free tier)
- Monitor usage in Railway dashboard
- Pause projects when not testing

### **When to Upgrade:**
- Heavy production traffic (>500 hours/month)
- Need more RAM/CPU
- Custom enterprise features

---

## Alternative FREE Deployment Options

If you need more free resources:

### **Render.com:**
```bash
# Free tier: 750 hours/month
# PostgreSQL included (90 days)
# Similar to Railway
```

### **Fly.io:**
```bash
# Free tier: 3 VMs, 160GB storage
# More generous free tier
# Requires Dockerfile (already created)
```

---

## Quick Commands Reference

```bash
# Local development
npm run start:dev

# Build for production
npm run build

# Start production server locally
npm run start:prod

# Run tests
npm run test:all

# Check deployment status
railway status

# View logs (if Railway CLI installed)
railway logs

# Redeploy manually
git push origin main
```

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use Railway's secure variable storage
   - Rotate JWT_SECRET regularly

2. **Database Security:**
   - Use Supabase Row Level Security (RLS)
   - Restrict database connections to Railway IP
   - Regular backups

3. **API Security:**
   - Rate limiting (already implemented)
   - JWT expiration (7 days default)
   - HTTPS only (Railway provides SSL)
   - CORS properly configured

---

## Success Checklist

After deployment, verify:

- [ ] API responds at Railway URL
- [ ] Authentication works (login endpoint)
- [ ] Database connection successful
- [ ] All 120 endpoints accessible
- [ ] CORS allows frontend requests
- [ ] Environment variables set correctly
- [ ] Logs show no errors
- [ ] SSL certificate active
- [ ] Frontend can connect to API

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Supabase Docs:** https://supabase.com/docs
- **NestJS Deploy Guide:** https://docs.nestjs.com/faq/deployment

---

**Estimated Total Time:** 15-20 minutes  
**Cost:** FREE (Railway $5 credit + Supabase free tier)  
**Next Steps:** Test API → Connect Frontend → Deploy Frontend

---

**Deployment Status:** 🟢 Ready to Deploy  
**Last Updated:** January 16, 2026
