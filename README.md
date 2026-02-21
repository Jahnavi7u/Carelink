# 🏥 CareLink — Telemedicine Platform

CareLink is a modern, full-stack telemedicine platform that connects patients with verified doctors. It features secure online consultations, appointment management, medical record storage, and an AI-powered medical chatbot.

---

## ✨ Features

### 👤 For Patients
- **Account Registration** — Multi-step registration form capturing personal info, medical history, allergies, and lifestyle details.
- **Doctor Discovery** — Browse a list of verified doctors with their specializations, experience, clinic info, and consultation fees.
- **Appointment Booking** — Book appointments with preferred doctors, select time slots, and receive email confirmations.
- **Medical Records** — Upload and store prescriptions/medical reports (stored via Cloudinary), filter and sort by date.
- **AI Medical Chatbot** — Get instant answers to medical questions from a Groq-powered AI assistant.
- **OTP-based Login** — Secure login via email OTP verification.

### 🩺 For Doctors
- **Doctor Registration** — Register with medical license details, specialization, clinic info, and availability.
- **Appointment Management** — View upcoming and past appointments, confirm or cancel bookings.
- **Patient Notifications** — Patients receive email notifications when appointments are confirmed.

### 🔐 Admin
- **Doctor Verification** — Review and verify/reject doctor registrations.

---

## 🛠 Tech Stack

| Layer        | Technology                                      |
|--------------|--------------------------------------------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Framer Motion   |
| **Backend**  | Node.js, Express 4                               |
| **Database** | SQLite (via better-sqlite3) — zero config, no cloud setup |
| **AI**       | Groq API (LLaMA 3.3 70B Versatile)              |
| **Auth**     | JWT (JSON Web Tokens) + bcrypt password hashing  |
| **Email**    | Nodemailer (Gmail SMTP)                          |
| **Storage**  | Cloudinary (medical report image uploads)        |
| **Icons**    | Lucide React, React Icons                        |
| **Routing**  | React Router DOM v7                              |

---

## 📁 Project Structure

```
CareLink/
├── backend/
│   ├── controllers/          # Route handlers (auth, appointments, chatbot, etc.)
│   ├── database/
│   │   ├── db.js             # SQLite connection & table initialization
│   │   └── models/           # Data models (user, doctor, appointment, image)
│   ├── middleware/
│   │   └── authMiddleware.js # JWT token verification
│   ├── router/               # Express route definitions
│   ├── uploads/              # Temp storage for file uploads (auto-cleaned)
│   ├── utils/
│   │   └── emailService.js   # Email sending utility (Nodemailer)
│   ├── .env                  # Environment variables (not committed)
│   ├── .env.example          # Template for environment variables
│   ├── index.js              # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/               # Static assets (illustrations, SVGs)
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Footer, ChatBot, etc.)
│   │   ├── contexts/         # React contexts (UserContext)
│   │   ├── hooks/            # Custom hooks (useFetch)
│   │   └── pages/            # Page components organized by role
│   │       ├── doctor/       # Doctor dashboard & appointments
│   │       ├── forms/        # Registration forms (Patient, Doctor)
│   │       ├── static/       # Static pages (About, Terms, Cookies, Consent)
│   │       └── user/         # Patient dashboard, medical history, appointments
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CareLink.git
cd CareLink
```

### 2. Setup the Backend

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
PORT=8080
JWT_SECRET=any_random_secret_string_here
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **📌 How to get each value:**
>
> | Variable       | How to Get It |
> |----------------|---------------|
> | `PORT`         | Default is `8080`. Change if needed. |
> | `JWT_SECRET`   | Any random string (e.g. `mysecretkey123`). Used to sign auth tokens. |
> | `GROQ_API_KEY` | Sign up at [console.groq.com](https://console.groq.com) → API Keys → Create. Free tier available. |
> | `EMAIL_USER`   | Your Gmail address (used to send appointment notifications & OTPs). |
> | `EMAIL_PASS`   | A Gmail **App Password** — [Generate one here](https://myaccount.google.com/apppasswords). Requires 2FA enabled. |
>
> ⚠️ `EMAIL_USER` and `EMAIL_PASS` are **optional** — the app works without them, but email notifications (appointment confirmations, OTP login) won't be sent.

Start the backend server:

```bash
npm run dev
```

You should see:
```
SQLite database initialized successfully
Server running on port 8080
```

> The SQLite database (`carelink.db`) is automatically created in the `database/` folder on first run.  No database installation required.

### 3. Setup the Frontend

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

You should see:
```
VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 4. Open the App

Open your browser and go to **[http://localhost:5173](http://localhost:5173)**

---

## 📖 Usage Guide

### Getting Started

1. **Register as a Patient** — Click "Register as a Patient" on the homepage. Fill out the multi-step form (personal details → medical history → terms acceptance).

2. **Register as a Doctor** — Click "Register as a Doctor". Provide your medical license number, specialization, clinic info, availability slots, and consultation fee.

3. **Login** — Use your email + password, or use the OTP option (email required in `.env`).

### Patient Workflow

1. **Browse Doctors** — After login, go to the doctor listing page to see all verified doctors.
2. **Book Appointment** — Click on a doctor card, pick a date & time slot, and confirm. Both you and the doctor receive email notifications.
3. **View Appointments** — Check upcoming and past appointments from your dashboard.
4. **Upload Medical Records** — Go to Medical Records, pick a date, enter the reason, and upload a prescription image.
5. **AI Chatbot** — Click the chatbot icon (bottom-right) to ask medical questions.

### Doctor Workflow

1. **Wait for Verification** — After registration, an admin must verify your account.
2. **View Appointments** — See your upcoming bookings and past consultations.
3. **Confirm/Cancel** — Confirm or cancel patient appointments (patients get email notifications).

### Admin Workflow

1. **Login as Admin** — Navigate to `/admin` to access the admin panel.
2. **Verify Doctors** — Review pending doctor applications and approve/reject them.

---

## � API Endpoints

All API routes are prefixed with `/v1`.

### Authentication
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/register`     | Register a new patient   |
| POST   | `/registerdoc`  | Register a new doctor    |
| POST   | `/login`        | Login (email + password) |
| POST   | `/get-otp`      | Request OTP via email    |
| POST   | `/verify-otp`   | Verify OTP               |

### Users & Doctors
| Method | Endpoint         | Description                        | Auth |
|--------|------------------|------------------------------------|------|
| GET    | `/current-user`  | Get logged-in user/doctor profile  | ✅   |
| GET    | `/getverified`   | List all verified doctors          | ❌   |
| GET    | `/getunder`      | List doctors under review (admin)  | ❌   |
| PUT    | `/change-verify` | Verify/reject a doctor (admin)     | ❌   |

### Appointments
| Method | Endpoint                      | Description                         | Auth |
|--------|-------------------------------|-------------------------------------|------|
| POST   | `/book-appointment`           | Book a new appointment              | ❌   |
| PATCH  | `/update-appointment-status`  | Confirm/cancel an appointment       | ❌   |
| GET    | `/past-appointments`          | Get patient's past appointments     | ✅   |
| GET    | `/upcomming-appointments`     | Get patient's upcoming appointments | ✅   |
| GET    | `/past-doc-appointments`      | Get doctor's past appointments      | ✅   |
| GET    | `/upcomming-doc-appointments` | Get doctor's upcoming appointments  | ✅   |

### Medical Records
| Method | Endpoint   | Description                    | Auth |
|--------|------------|--------------------------------|------|
| POST   | `/upload`  | Upload a prescription image    | ✅   |
| POST   | `/images`  | Get user's prescription images | ❌   |

### Other
| Method | Endpoint   | Description                  |
|--------|------------|------------------------------|
| POST   | `/chatbot` | Send a prompt to AI chatbot  |
| POST   | `/maps`    | Get Google Maps directions   |

---

## 🧪 Testing

### Quick Smoke Test

1. Start both backend and frontend (see setup above).
2. Open `http://localhost:5173` — you should see the CareLink landing page.
3. Open `http://localhost:8080` — you should see "CareLink API is running!".
4. Register a test patient and log in.
5. Click the chatbot icon and type "What are symptoms of flu?" to test the AI.

---

## 📝 License

ISC License
