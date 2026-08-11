# Campus Bites — College Café Ordering Platform (MERN Stack MVP)

Campus Bites is a modern, Gen-Z styled cashless food-ordering application developed for our college's Special Block. The platform coordinates ordering and pickup queues across three campus hubs: **Mayuri**, **Bistro**, and **AB Dakshin**.

Students can browse cafe menus, place Dine-In or Parcel orders, complete mock checkout transactions, and track their preparation status in real-time. Cafe kitchen staff can view active queues on a Kanban dashboard and update cooking states.

---

## Folder Structure

```text
college-cafe-ordering/
├── frontend/             # React/Vite Client
│   ├── src/
│   │   ├── components/   # Shared components (Timeline, Skeletons, conflict alerts)
│   │   ├── context/      # AuthContext & CartContext (multi-cafe guards)
│   │   ├── pages/        # Student screens & Staff Kitchen board
│   │   ├── services/     # Axios client configuration
│   │   ├── index.css     # Tailwind custom styling & glassmorphic panels
│   │   └── App.jsx       # Route settings & Role guards
│   ├── package.json
│   └── .env.example
│
├── backend/              # Node/Express API Server
│   ├── config/           # Mongoose DB connector
│   ├── controllers/      # Auth, Cafe, Order, and Payment controllers
│   ├── middleware/       # JWT Auth verification
│   ├── models/           # Mongoose database schemas
│   ├── routes/           # REST endpoints
│   ├── services/         # Printer integration abstractions
│   ├── scripts/          # DB Seeding script
│   ├── server.js         # Express app entry
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## Technology Stack

- **Frontend**: React.js (Vite), JavaScript, React Router, Tailwind CSS, Axios, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, bcryptjs, dotenv, CORS
- **Database**: MongoDB (Mongoose ODM)

---

## Getting Started

### 1. MongoDB Database Setup
Ensure you have a local MongoDB daemon running, or set up a cloud MongoDB Atlas cluster. By default, the application connects to a local database named `campus_bites`.

### 2. Environment Configurations
Rename `.env.example` to `.env` in both folders and fill in values.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_bites
JWT_SECRET=super_secret_jwt_key_campus_bites_2026
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Installation

Run dependency installations in separate terminals:

**To Install Backend Dependencies:**
```bash
cd backend
npm install
```

**To Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

---

## Database Seeding (Important Step)

Run the seeding script to wipe the database and pre-populate Cafes (Mayuri, Bistro, AB Dakshin), full categories menus, staff login accounts, and a student account:

```bash
cd backend
node scripts/seed.js
```

### Mock Login Accounts Seeded:
- **Student User**: `student@bites.edu` / Password: `student123`
- **Mayuri Kitchen Staff**: `mayuri@bites.edu` / Password: `staff123`
- **Bistro Kitchen Staff**: `bistro@bites.edu` / Password: `staff123`
- **AB Dakshin Kitchen Staff**: `dakshin@bites.edu` / Password: `staff123`
- **Admin**: `admin@bites.edu` / Password: `admin123`

---

## Running the Application

Start the development servers for both folders:

**Start Backend Server:**
```bash
cd backend
npm start     # Runs on http://localhost:5000
```
*(Note: If nodemon is preferred, install it locally or use standard `npm start` which runs `node server.js`).*

**Start Frontend Client:**
```bash
cd frontend
npm run dev   # Runs on http://localhost:5173
```

---

## Key Core Architectures

### 1. Payment Integration (Razorpay/Stripe Ready)
Payment routes are separated into `POST /api/payments/create` and `POST /api/payments/verify`. 
- `payments/create` creates a transaction session and returns a checkout ID.
- `payments/verify` takes transaction details. If verified successfully (mocked for development), it generates a unique order number, creates the `Order` model in MongoDB, stores the transaction in the `Payment` collection, and triggers the print ticket service.
- **Security Rule**: The order is *only* instantiated in MongoDB after the payment confirmation has been validated on the backend. Raw UPI PINs or card CVVs are never processed or saved.

### 2. Thermal Receipt Printer Architecture
We implement the printer system using a decoupled bridge model:
```text
Cloud API Server (backend) 
       ↓ logs/sends formatted ESC/POS print string
Local Café Printer Agent (listening on port/websockets)
       ↓ USB / LAN interface
Physical Thermal Printer (58mm/80mm)
```
In `backend/services/printerService.js`, a `printOrderTicket` method converts order details (student ID, item counts, payment status) into a monospaced thermal receipt format. During development, this prints a beautiful layout ticket directly to the node console.

---

## Future Enhancements
1. **Real-time Updates**: Replace polling with Socket.io on the student tracking page.
2. **College-Only Domain Restrictions**: Check registered student email domains against configured extensions (e.g. `@college.edu`) or integrate student ID card scanners during registration.
3. **Printer Agent Bridge**: Establish a lightweight Electron/Node.js desktop tool running at the cafe cash registers to monitor websockets from our backend server and directly spool ESC/POS receipt prints.
