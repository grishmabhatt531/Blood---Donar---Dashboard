# 🩸 BloodPulse — Lifeline Donor Network & Regional Supply Control

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AWS API Gateway](https://img.shields.io/badge/AWS_API_Gateway-Live-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![CSS3](https://img.shields.io/badge/Vanilla_CSS3-Design_System-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

<p align="center">
  <b>A state-of-the-art enterprise blood donor management system & regional geo-knowledge network.</b>
  <br />
  Streamlining blood inventory tracking, universal donor dispatch readiness, and regional supply logistics.
</p>

---

</div>

## 📌 Executive Summary

**BloodPulse** (HaemoGrid) is a clinical healthcare management web application engineered for regional blood banks, hospitals, and emergency dispatch centers. Built with **React**, **Vite**, and connected to a live **AWS API Gateway** serverless backend, BloodPulse delivers high-contrast visual telemetry, live blood group compatibility intelligence, and interactive geographic network inspection.

---

## ✨ Key Features

### 📊 1. Executive Telemetry Dashboard
- **Live Inventory Metrics**: Real-time counters for Total Donors, Ready Donors, Universal (O-) Donors, and Regional City Hub coverage.
- **Blood Inventory Breakdown**: Visual progress distribution bars across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- **Compatibility Intelligence Engine**: Interactive matrix highlighting recipient and donor compatibility rules for critical dispatch decisions.
- **Emergency Priority Alerts**: Automated detection highlights critical shortages in Universal Donors (O-).

### 🗺️ 2. Regional Geo-Knowledge Network (`Geo Graph`)
- **Interactive Knowledge Topology**: Visual SVG hub-and-spoke node canvas showing logistics connections between the Central Supply Base and regional city hubs (`Lalitpur`, `Chennai`, etc.).
- **Node Telemetry Inspector**: Clickable regional node cards with **Dispatch Readiness Scores (0–100%)**, universal donor availability tags, and blood type inventories.
- **Instant Type Filtering**: Filter network nodes by specific blood groups with a single click.

### 📋 3. Donor Management Registry
- **Instant Search & Filter**: Search donors by Name, Donor ID, Phone Number, or City Hub.
- **Full CRUD Operations**:
  - **Register Donor**: Add new donor records with blood group, city hub, phone number, last donation date, and health notes.
  - **View Profile**: Inspect complete clinical node profiles and donation eligibility timers (90-day cooldown rules).
  - **Edit & Update**: Modify existing donor data with instant API sync.
  - **Delete Record**: Safely remove inactive records with confirmation modal verification.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite SPA) |
| **Typography** | Plus Jakarta Sans (Google Fonts) |
| **Styling & Theme** | Custom Vanilla CSS (Design Tokens, Medical Crimson Theme) |
| **Cloud Architecture** | AWS API Gateway (REST API) |
| **Icons & Assets** | Custom SVG Glyphs & Vector Graphics |
| **Build System** | Vite 8 + ESBuild |

---

## ⚡ API Specification

BloodPulse communicates directly with the AWS API Gateway backend endpoints:

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/donor` | Fetch all registered donor records from AWS database |
| `POST` | `/donor` | Register a new donor record |
| `GET` | `/donor/{donorId}` | Fetch granular details for a specific donor ID |
| `PUT` | `/donor/{donorId}` | Update an existing donor record |
| `DELETE` | `/donor/{donorId}` | Delete a donor record from the system |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/oyyPoodles/Blood---Donar---Dashboard.git
cd Blood---Donar---Dashboard
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_URL=https://e7q5zdmvb3.execute-api.us-east-1.amazonaws.com/dev
```
> ⚠️ **Note**: Do not commit `.env` to public version control. It is listed in `.gitignore`.

### 4. Run Locally
Start the Vite local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Production Deployment

To build the production bundle for deployment (e.g. AWS S3 / CloudFront):

```bash
npm run build
```

This compiles optimized assets into the `dist/` directory:
```
dist/
├── assets/
│   ├── index-*.css
│   └── index-*.js
└── index.html
```

Upload the contents of `dist/` to your AWS S3 bucket configured for static web hosting.

---

<div align="center">

<b>BloodPulse — Empowering Lifesaving Logistics</b>
<br />
Developed for regional healthcare & blood donor networks.

</div>
