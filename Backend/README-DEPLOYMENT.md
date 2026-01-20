# Backend Deployment Guide

## ⚠️ Important: Appwrite Sites Won't Work

**Appwrite Sites is for static frontend hosting only.** It cannot run Node.js/Express backends. You need to use a platform that supports Node.js.

## Recommended Deployment Platforms

### Option 1: Render.com (Easiest - Free Tier Available)

1. **Sign up** at [render.com](https://render.com)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
   - **Root Directory:** `Backend`

5. **Add Environment Variables:**
   ```
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=https://your-frontend-url.com
   API_URL=https://your-backend-url.onrender.com
   NODE_ENV=production
   ```

6. **Deploy!**

### Option 2: Railway.app (Free Tier Available)

1. **Sign up** at [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. **Select your repository** and set root directory to `Backend`
4. **Add Environment Variables** (same as above)
5. **Deploy!**

### Option 3: Fly.io (Free Tier Available)

1. **Install Fly CLI:** `npm install -g @fly/cli`
2. **Login:** `fly auth login`
3. **Initialize:** `cd Backend && fly launch`
4. **Deploy:** `fly deploy`

### Option 4: DigitalOcean App Platform

1. **Create App** → **GitHub** → Select repository
2. **Configure:**
   - Root Directory: `Backend`
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
3. **Add Environment Variables**
4. **Deploy!**

## Docker Deployment (Any Platform)

If you prefer Docker:

```bash
# Build the image
cd Backend
docker build -t wheeliz-backend .

# Run locally to test
docker run -p 5000:5000 \
  -e PORT=5000 \
  -e DATABASE_URL=your_db_url \
  -e JWT_SECRET=your_secret \
  wheeliz-backend

# Push to Docker Hub or your registry
docker tag wheeliz-backend yourusername/wheeliz-backend
docker push yourusername/wheeliz-backend
```

## Required Environment Variables

Make sure to set these in your hosting platform:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.com
API_URL=https://your-backend-domain.com
NODE_ENV=production
```

## Database Setup

You'll need a PostgreSQL database. Options:
- **Render.com** (Free PostgreSQL)
- **Supabase** (Free tier)
- **Railway** (Free PostgreSQL)
- **Neon** (Free tier)
- **ElephantSQL** (Free tier)

Update your `DATABASE_URL` with the connection string.

## Testing Your Deployment

After deployment, test these endpoints:

1. **Root:** `GET https://your-backend-url.com/`
   - Should return API info (not 404!)

2. **API Docs:** `GET https://your-backend-url.com/api-docs`
   - Should show Swagger documentation

3. **Health Check:** `GET https://your-backend-url.com/api/admin/health` (if you add one)

## Troubleshooting

### Still getting 404?
- ✅ Make sure you're deploying to a **Node.js platform**, not Appwrite Sites
- ✅ Check that `npm start` command runs `node dist/server.js`
- ✅ Verify the root route `/` is working
- ✅ Check server logs in your hosting platform

### Database Connection Issues?
- ✅ Verify `DATABASE_URL` is set correctly
- ✅ Run `npx prisma migrate deploy` if needed
- ✅ Check database is accessible from your hosting platform

### CORS Errors?
- ✅ Set `FRONTEND_URL` environment variable to your frontend domain
- ✅ Make sure it includes the protocol (`https://`)

## Quick Commands

```bash
# Build locally
cd Backend
npm install
npm run build

# Test locally
npm start

# Check if dist folder has server.js
ls dist/

# Test the API
curl http://localhost:5000/
```
