# PG Life - Deployment Guide

This repository is split into `frontend` (for **Vercel**), `backend` (for **Render**), and `database` (for MySQL).

---

## 1. Database Setup (MySQL)
Host your MySQL database for free on **Aiven**, **Clever Cloud**, or **Railway**:
1. Create a MySQL service on your cloud provider.
2. Import `database/pglife.sql`:
   ```bash
   mysql -h <HOST> -u <USER> -p -P <PORT> <DB_NAME> < database/pglife.sql
   ```
   *Tables included: `amenities`, `cities`, `interested_users_properties`, `properties`, `properties_amenities`, `testimonials`, `users`.*
   *Default login: Email: `test@pglife.com` | Password: `password123`*

---

## 2. Backend Deployment on Render
1. Push this project to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Docker` (uses `backend/Dockerfile`)
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `DB_HOST`: Your cloud MySQL host
   - `DB_USER`: Your cloud MySQL user
   - `DB_PASSWORD`: Your cloud MySQL password
   - `DB_NAME`: `pglife` (or your DB name)
   - `DB_PORT`: `3306` (or your DB port)
6. Click **Deploy Web Service** and copy your backend URL (e.g. `https://pglife-backend.onrender.com`).

---

## 3. Frontend Deployment on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) -> **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure Project Settings:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
4. Under **Environment Variables**, add:
   - `REACT_APP_API_BASE_URL`: `https://your-backend-name.onrender.com` *(from step 2)*
5. Click **Deploy**.
