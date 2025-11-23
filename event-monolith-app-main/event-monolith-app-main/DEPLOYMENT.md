# Deployment Guide

This guide covers deploying the Event Management Application to production using Render.com.

## 📋 Pre-Deployment Checklist

- [ ] Database set up (Neon PostgreSQL recommended)
- [ ] All environment variables documented
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Git repository pushed to GitHub
- [ ] Swagger documentation working
- [ ] WebSocket functionality tested

## 🌐 Backend Deployment (Render)

### 1. Create Render Account

1. Go to [Render Dashboard](https://render.com)
2. Sign up or log in with GitHub

### 2. Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `event-monolith-backend`
- **Environment**: `Bun`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your main branch)

**Build Settings:**
- **Root Directory**: `backend-elysia`
- **Build Command**: `bun install && bunx prisma generate && bunx prisma db push`
- **Start Command**: `bun run start`

### 3. Environment Variables

Add these environment variables in Render dashboard:

```env
# Database (Required - from Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require

# JWT Secret (Required)
JWT_SECRET=your_super_secret_key_here_change_this_in_production

# Server Configuration
PORT=3000
NODE_ENV=production

# Email Settings (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=true
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

**Important Security Notes:**
- Use a strong `JWT_SECRET` (at least 32 characters)
- Never commit secrets to GitHub
- Use Render's secure environment variables

### 4. Deploy

Click **"Create Web Service"** and wait for deployment (usually 2-5 minutes).

Your backend will be available at:
```
https://your-service-name.onrender.com
```

## 🎨 Frontend Deployment (Render)

### Option 1: Deploy as Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

**Basic Settings:**
- **Name**: `event-monolith-frontend`
- **Environment**: `Node`
- **Region**: Same as backend

**Build Settings:**
- **Root Directory**: `my-app`
- **Build Command**: `cd my-app && npm install && npm run build`
- **Start Command**: `npm start` (or `node server.js` for production)

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NODE_ENV=production
```

### Option 2: Deploy as Static Site (Recommended for Next.js)

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:

**Build Settings:**
- **Build Command**: `cd my-app && npm install && npm run build && npm run export`
- **Publish Directory**: `my-app/out`

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 🔧 Post-Deployment Configuration

### 1. Update API Endpoints

Ensure your frontend `.env.local` or build-time environment variables point to the deployed backend:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 2. CORS Configuration

The backend is configured to allow all origins. For production, restrict CORS in `backend-elysia/src/index.ts`:

```typescript
.use(cors({
  origin: ["https://your-frontend.onrender.com"],
  credentials: true,
}))
```

### 3. Health Checks

Add a health check endpoint:

```typescript
// In backend-elysia/src/index.ts
.get("/health", () => {
  return { status: "ok", timestamp: new Date().toISOString() };
})
```

Configure in Render:
- **Health Check Path**: `/health`

### 4. SSL/HTTPS

Render automatically provides SSL certificates. Ensure all requests use HTTPS.

## 🧪 Testing Production Deployment

### 1. Test Backend

```bash
# Test API base
curl https://your-backend.onrender.com/

# Test Swagger
# Visit: https://your-backend.onrender.com/swagger

# Test authentication
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"ATTENDEE"}'
```

### 2. Test WebSocket

```javascript
const ws = new WebSocket('wss://your-backend.onrender.com/ws');

ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', event.data);
ws.onerror = (error) => console.error('Error:', error);
ws.onclose = () => console.log('Disconnected');
```

### 3. Test Frontend

1. Visit your deployed frontend URL
2. Test signup/login flow
3. Create an event
4. RSVP to an event
5. Verify realtime updates work

## 🔍 Monitoring & Logs

### View Logs in Render

1. Go to your service in Render dashboard
2. Click on **"Logs"** tab
3. View real-time and historical logs

### Common Issues

**Build Failures:**
```
Error: Cannot find module
→ Check dependencies in package.json
→ Verify build commands
```

**Database Connection Errors:**
```
Error: connect ECONNREFUSED
→ Check DATABASE_URL is correct
→ Ensure database allows connections from Render IPs
→ Verify SSL mode (should be 'require')
```

**WebSocket Not Connecting:**
```
Error: WebSocket is closed
→ Check backend is running
→ Verify WebSocket endpoint URL
→ Check CORS settings
```

## 🚀 Continuous Deployment

Render automatically redeploys on every push to your repository.

To enable/disable auto-deploy:
1. Go to service settings
2. Toggle **"Auto-Deploy"**

To deploy manually:
1. Go to service in dashboard
2. Click **"Manual Deploy"**
3. Select branch/commit

## 📊 Database Management (Neon)

### Connecting from Production

Use the connection string from Neon dashboard:
```
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

### Database Migrations

Migrations run automatically during build:
```bash
bunx prisma db push
```

For production changes:
1. Modify `schema.prisma` locally
2. Test locally
3. Push to GitHub
4. Render will auto-deploy with new schema

### Database Backups

Neon automatically backs up your database. To restore:
1. Go to Neon dashboard
2. Select your project
3. Click **"Backups"**
4. Choose restore point

## 🔐 Security Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Never expose secrets in logs or code
- [ ] Enable HTTPS only
- [ ] Restrict CORS to known origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (consider adding)
- [ ] Use prepared statements (Prisma handles this)
- [ ] Keep dependencies updated

## 📈 Performance Optimization

### Backend

1. Enable database connection pooling (Prisma does this)
2. Use Redis for caching (optional)
3. Add rate limiting
4. Optimize database queries

### Frontend

1. Enable Next.js production optimizations
2. Use CDN for static assets
3. Implement lazy loading
4. Optimize images

## 🧹 Maintenance

### Regular Tasks

1. **Update Dependencies**:
   ```bash
   bun update  # Backend
   npm update   # Frontend
   ```

2. **Monitor Logs**: Check Render dashboard daily

3. **Database Cleanup**: Remove old events/RSVPs periodically

4. **Backup**: Neon handles this automatically

## 🆘 Support

If you encounter issues:

1. Check Render logs
2. Test locally first
3. Verify environment variables
4. Check API documentation
5. Consult Elysia.js/Prisma documentation

## 🎉 Deployment Complete!

Your application is now live at:
- Backend: `https://your-backend.onrender.com`
- Frontend: `https://your-frontend.onrender.com`
- Swagger: `https://your-backend.onrender.com/swagger`

**Next Steps:**
1. Test all features in production
2. Monitor logs for errors
3. Set up monitoring/alerts (optional)
4. Document any production-specific configurations

