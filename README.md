# 🚀 LoanFlow Admin

> A full-stack internal admin panel for managing loan products, applicant eligibility, and role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-green)

---

## 📖 Overview

LoanFlow Admin is an internal dashboard built for lending businesses to manage loan products and automatically determine applicant eligibility.

The application evaluates every applicant against all available loan products using a backend eligibility engine. Applicants who qualify for at least one product are marked **Active**, while others are marked **Rejected**.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT Authentication
- Secure httpOnly Cookie Authentication
- Role-Based Access Control (RBAC)
- Protected API Routes
- Protected Frontend Routes

### 📦 Product Management

- View Loan Products
- Create New Products
- Edit Existing Products
- Configure Eligibility Criteria
- Automatic Applicant Re-evaluation after Product Changes

### 👥 Applicant Management

- Add New Applicants
- View Applicant List
- Active / Rejected Status
- Search & Filter Applicants
- View Eligible Products for Each Applicant

### ⚙️ Eligibility Engine

Every applicant is evaluated using:

- Age Range
- Minimum Credit Score
- Employment Type
- Salary Type
- Minimum Monthly Salary

A user is eligible only when **all criteria** are satisfied.

---

# 🏗 Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Database

- MySQL

## Authentication

- JWT
- httpOnly Cookies
- Role-Based Access Control

---

# 📂 Project Structure

```
LoanFlow-Admin/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

---

# ⚡ Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>

cd LoanFlow-Admin
```

---

# 🔧 Backend Setup

```bash
cd backend

npm install

cp .env.example .env

npm run prisma:generate

npm run prisma:migrate

npm run seed

npm run dev
```

Backend will start at:

```
http://localhost:5000
```

---

## Backend Environment Variables

```env
PORT=5000

DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/loanflow"

JWT_SECRET="change-this-secret"

JWT_EXPIRES_IN="7d"

CLIENT_URL="http://localhost:3000"
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will start at:

```
http://localhost:3000
```

---

## Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

---

# 🔑 Demo Login Credentials

## 👑 Admin

| Email | Password |
|--------|----------|
| `admin@loanpanel.com` | `Admin@123` |

### Permissions

- View Products
- Add Products
- Edit Products
- View Applicants
- Add Applicants
- View Eligible Products

---

## 👀 Viewer

| Email | Password |
|--------|----------|
| `viewer@loanpanel.com` | `Viewer@123` |

### Permissions

- View Products
- View Applicants
- View Eligible Products

Cannot:

- Add Products
- Edit Products
- Add Applicants

---

# 🧠 Eligibility Rules

Applicants are evaluated using the following conditions:

| Criteria | Rule |
|-----------|------|
| Age | Between Product Min & Max Age |
| Credit Score | Greater than or Equal to Product Minimum |
| Employment Type | Must Match Product Criteria |
| Salary Type | Must Be Allowed |
| Monthly Salary | Greater than or Equal to Product Minimum |

An applicant becomes **Active** if they qualify for **at least one** product.

Otherwise:

```
Status = Rejected
```

---

# 🔄 Automatic Re-evaluation

The eligibility engine automatically re-runs whenever:

- A new applicant is created
- A new loan product is added
- A loan product is updated

This ensures applicant statuses always remain accurate.

---

# 🛡 Role-Based Access

| Feature | Admin | Viewer |
|----------|:-----:|:------:|
| View Products | ✅ | ✅ |
| Add Products | ✅ | ❌ |
| Edit Products | ✅ | ❌ |
| View Applicants | ✅ | ✅ |
| Add Applicants | ✅ | ❌ |
| View Eligible Products | ✅ | ✅ |

---

# 🧪 API Highlights

### Authentication

```
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Products

```
GET    /api/v1/products
POST   /api/v1/products
PATCH  /api/v1/products/:id
```

### Applicants

```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id/eligible-products
```

---

# 📌 Assignment Highlights

- ✅ Clean Frontend & Backend Separation
- ✅ Backend Eligibility Engine
- ✅ Deterministic Eligibility Evaluation
- ✅ Role-Based Authorization
- ✅ Automatic Applicant Re-evaluation
- ✅ Prisma ORM
- ✅ TypeScript
- ✅ Modern UI with Next.js & shadcn/ui

