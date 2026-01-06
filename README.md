🚀 Deployment Guide – Eat A Fruit Challenge

This document explains how to deploy the Eat A Fruit Challenge Flyer Generator to production.

🌐 Deployment Overview

Frontend → Vercel

Backend (API) → Render

Database → MongoDB Atlas

Image Storage → Cloudinary

📁 Repository Structure (Required)
eat-a-fruit-challenge/
│
├── client/      # Frontend (HTML, CSS, JS)
├── server/      # Backend (Node.js, Express)
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   └── assets/template.png
│
├── .gitignore
└── README.md

🔐 Environment Variables (Backend)

Set the following on Render (NOT locally):

CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
MONGO_URI


Do NOT commit .env to GitHub.

🚀 Deploy Backend (Render)

Go to Render

Click New Web Service

Connect GitHub repository

Select the repo

Configure:

Root Directory: server

Build Command: npm install

Start Command: npm start

Runtime: Node

Add environment variables

Click Deploy

Backend URL example:

https://eat-a-fruit-api.onrender.com

🌍 Deploy Frontend (Vercel)

Go to Vercel

Click New Project

Import GitHub repository

Configure:

Framework Preset: Other

Root Directory: client

Deploy

Frontend URL example:

https://eat-a-fruit-challenge.vercel.app

🔗 Connect Frontend to Backend

Inside client/script.js and admin.js, update API base URL:

const API_BASE_URL = "https://your-render-backend-url";

🖼 Flyer Template Requirements

File location:

server/assets/template.png


Size:

1024 × 1536 px


Must include:

Empty circular space for image

Empty space for name text

📦 Required Files (Must Exist)

✅ package.json
✅ package-lock.json
✅ template.png
❌ .env
❌ node_modules/









