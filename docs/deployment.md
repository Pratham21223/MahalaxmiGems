# Deployment & Containerisation Guide

This guide covers deploying the **Mahalaxmi Gems** MERN platform using:
1. **Vercel** (Serverless + Edge CDN)
2. **Docker** (Containerised standalone / VPS deployment)

---

## 1. Vercel Deployment

### Architecture Overview

When deployed to Vercel:
- **Frontend SPA**: React 19 + Vite static build (`frontend/dist`) served from Vercel's global Edge CDN.
- **Backend API**: Express API wrapped as a Serverless Function (`api/index.js`) executing via `@vercel/node`.
- **Database**: External **MongoDB Atlas** database cluster (required, as serverless cannot connect to `localhost:27017`).

---

### Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
2. Create a free **M0 Sandbox** cluster (shared).
3. Under **Security > Database Access**:
   - Create a database user (e.g. `gems_user`) with a strong password.
   - Assign the **Read and write to any database** role.
4. Under **Security > Network Access**:
   - Click **Add IP Address**.
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) — required for Vercel's dynamic serverless IP pool.
5. In your cluster dashboard, click **Connect > Drivers > Node.js**:
   - Copy the connection string:
     ```text
     mongodb+srv://gems_user:<password>@cluster0.abcde.mongodb.net/gemstone_store?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password and specify the database name (`gemstone_store`).

---

### Step 2: Push Repository to GitHub

Ensure your latest changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: add containerisation and vercel deployment config"
git push origin main
```

---

### Step 3: Create Project on Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New... > Project**.
3. Import your GitHub repository (`MahalaxmiGems`).
4. Vercel will automatically detect `vercel.json` from the repository root:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build --workspace frontend` (configured in `vercel.json`)
   - **Output Directory**: `frontend/dist` (configured in `vercel.json`)

---

### Step 4: Configure Environment Variables in Vercel

In the Vercel project configuration (before or after clicking Deploy), add the following **Environment Variables**:

| Variable | Value | Description |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode & security |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | *(random 32+ char string)* | Generate using `openssl rand -base64 32` |
| `CORS_ORIGIN` | `https://<your-project>.vercel.app` | Your Vercel production domain (or custom domain) |
| `RAZORPAY_KEY_ID` | `rzp_live_...` or `rzp_test_...` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | `...` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET`| `...` | Razorpay webhook secret |
| `ADMIN_EMAIL` | *(optional)* `admin@example.com` | Automatically bootstraps first admin |
| `ADMIN_PASSWORD` | *(optional)* *(strong password)* | Password for the initial admin account |

> **Note on CORS_ORIGIN**: On Vercel, requests to `/api/*` and static assets originate from the same domain (`https://<project>.vercel.app`). Setting `CORS_ORIGIN` to match your Vercel URL ensures that credentials/session cookies are accepted correctly.

---

### Step 5: Deploy & Configure Razorpay Webhook

1. Click **Deploy**.
2. Once the build finishes, verify your deployment:
   - **Health Check**: `https://<your-project>.vercel.app/health` → should return `{"status":"ok"}`.
   - **Frontend**: `https://<your-project>.vercel.app/` → loads the gemstone homepage.
   - **API Catalog**: `https://<your-project>.vercel.app/api/products` → returns products list.
3. Update your **Razorpay Webhook**:
   - Go to [Razorpay Dashboard > Settings > Webhooks](https://dashboard.razorpay.com/app/webhooks).
   - Add new webhook URL: `https://<your-project>.vercel.app/api/orders/webhook`.
   - Secret: Enter the same secret set in `RAZORPAY_WEBHOOK_SECRET`.
   - Events: `order.paid`, `payment.captured`, `payment.failed`.

---

## 2. Docker Deployment (Local / VPS)

For self-hosting or running locally without managing Node or MongoDB versions:

### Option A: Complete Stack with Docker Compose (Recommended)

Starts both the full MERN application and MongoDB 7 in isolated containers:

```bash
# Start MongoDB and Application
docker compose up -d --build

# View logs
docker compose logs -f

# Check health
curl http://localhost:4000/health

# Stop stack
docker compose down
```

The application will be accessible at `http://localhost:4000`.

### Option B: Build and Run Standalone Docker Image

If using an external MongoDB (e.g. Atlas or existing database server):

```bash
# 1. Build the Docker image
docker build -t mahalaxmi-gems:latest .

# 2. Run the container
docker run -d \
  --name mahalaxmi-gems \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e PORT=4000 \
  -e MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/gemstone_store" \
  -e SESSION_SECRET="your-secure-session-secret" \
  -e CORS_ORIGIN="http://localhost:4000" \
  mahalaxmi-gems:latest

# 3. Check logs and health
docker logs -f mahalaxmi-gems
curl http://localhost:4000/health
```

---

## 3. Seed Production / Remote Catalog

To populate categories and products in your remote MongoDB Atlas cluster:

```bash
# From the project root, point MONGODB_URI to Atlas and run the additive catalog seed:
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/gemstone_store" \
  npm run seed:catalog --workspace backend -- --dry-run
```
Remove `--dry-run` to execute the import.

