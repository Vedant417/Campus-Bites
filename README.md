# 🍔 Campus Bites — College Café Ordering Platform

A full-stack **MERN-based campus food ordering platform** designed to simplify food ordering and pickup across college cafés.

**Campus Bites** allows students to browse café menus, add items to their cart, place **Dine-In** or **Parcel** orders, complete digital checkout, track order preparation, view order history, and rate their experience.

The platform also provides dedicated interfaces for **café staff** and **administrators** to manage menus, orders, cafés, payments, users, and operational workflows.

---

## 🚀 Live Deployment

### 🌐 Frontend

**Vercel**

https://campus-bites-pied.vercel.app/

### ⚙️ Backend API

**Render**

https://campus-bites-zukq.onrender.com/

### 🗄️ Database

**MongoDB Atlas**

---

## 🏗️ Deployment Architecture

```text
                    ┌──────────────────────────┐
                    │       Campus Bites       │
                    │     React / Vite App     │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │     Node.js + Express    │
                    │        Backend API       │
                    └────────────┬─────────────┘
                                 │
                                 │ Mongoose
                                 ▼
                    ┌──────────────────────────┐
                    │       MongoDB Atlas      │
                    │       Cloud Database     │
                    └──────────────────────────┘

Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

---

# ✨ Key Features

## 🎓 Student Platform

- Student registration and login
- JWT-based authentication
- Browse available campus cafés
- Browse café menus and categories
- Add and remove items from cart
- Multi-café cart conflict protection
- Dine-In and Parcel ordering
- Checkout workflow
- Payment processing architecture
- Order confirmation
- Live order status tracking
- Order history
- Order details and bill receipt
- Profile management
- Food and café ratings
- Mobile-friendly navigation

---

## 👨‍🍳 Café Staff Dashboard

Dedicated dashboard for café staff to manage daily café operations.

- View active orders
- Monitor kitchen order queues
- Update order preparation status
- Manage café-specific workflow
- Access café order information
- Track order progress through different preparation stages

---

## 🛠️ Admin Dashboard

Administrative interface for managing the overall Campus Bites platform.

- Dashboard overview
- Café management
- Menu management
- Order monitoring
- Payment monitoring
- User management
- Platform-level administration

---

# 📂 Project Structure

```text
Campus-Bites/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cafeController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── ratingController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Cafe.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   ├── Rating.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cafeRoutes.js
│   │   ├── cafeStaffRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── ratingRoutes.js
│   │
│   ├── services/
│   │   └── printerService.js
│   │
│   ├── scripts/
│   │   └── seed.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── ConflictModal.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RatingModal.jsx
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── StatusTimeline.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BillReceiptPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── StaffDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 🛠️ Technologies Used

## Frontend

- **React.js** — Component-based user interface
- **Vite** — Fast frontend development and build tooling
- **React Router** — Client-side routing
- **Tailwind CSS** — Responsive UI styling
- **Axios** — REST API communication
- **Lucide React** — UI iconography
- **Context API** — Global authentication and cart state management

## Backend

- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **JWT** — Authentication and authorization
- **bcryptjs** — Password hashing
- **dotenv** — Environment configuration
- **CORS** — Cross-origin API communication

## Database

- **MongoDB**
- **MongoDB Atlas**
- **Mongoose** — MongoDB object modeling

## Deployment

- **Vercel** — Frontend deployment
- **Render** — Backend API deployment
- **MongoDB Atlas** — Cloud database

---

# 🧩 Core System Architecture

Campus Bites follows a three-layer full-stack architecture:

```text
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│                                             │
│ React + Vite + Tailwind + Context API      │
│                                             │
│ Student │ Staff │ Admin Interfaces         │
└──────────────────────┬──────────────────────┘
                       │
                       │ Axios / REST API
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│ Node.js + Express                           │
│                                             │
│ Routes → Controllers → Services             │
│                    ↓                        │
│              JWT Middleware                 │
└──────────────────────┬──────────────────────┘
                       │
                       │ Mongoose
                       ▼
┌─────────────────────────────────────────────┐
│                DATABASE                     │
│                                             │
│              MongoDB Atlas                  │
│                                             │
│ Users │ Cafes │ Menus │ Orders              │
│ Payments │ Ratings                          │
└─────────────────────────────────────────────┘
```

---

# 🔐 Authentication & Authorization

Campus Bites uses **JWT-based authentication** for secure user authentication and protected API access.

The authentication flow is:

```text
User
  │
  ▼
Login / Register
  │
  ▼
Express Authentication API
  │
  ▼
Password Verification
  │
  ▼
JWT Token Generated
  │
  ▼
Frontend Authentication Context
  │
  ▼
Protected API Requests
  │
  ▼
JWT Middleware
  │
  ▼
Authorized Resource
```

Different application areas are available depending on the authenticated user's role.

```text
Student
   └── Browse → Cart → Checkout → Orders → Tracking → Ratings

Café Staff
   └── Staff Dashboard → Active Orders → Order Status

Admin
   └── Admin Dashboard → Platform Management
```

---

# 🛒 Ordering Workflow

The primary student ordering flow is:

```text
Landing Page
      ↓
Login / Register
      ↓
Browse Cafés
      ↓
Select Café
      ↓
Browse Menu
      ↓
Add Items to Cart
      ↓
Cart Validation
      ↓
Checkout
      ↓
Payment
      ↓
Order Creation
      ↓
Order Confirmation
      ↓
Order Tracking
      ↓
Order Completed
      ↓
Rating / Review
```

---

# 🏪 Multi-Café Cart Protection

Campus Bites supports multiple cafés while preventing accidental mixing of items from different cafés in a single cart.

For example:

```text
Cart
 │
 ├── Mayuri
 │    ├── Burger
 │    └── Cold Coffee
 │
 └── Bistro
      └── Sandwich
```

When a user attempts to add an item from another café while the cart already contains items from a different café, the application displays a **Conflict Modal**.

The user can then choose whether to clear the existing cart and switch cafés.

---

# 💳 Payment Architecture

The backend contains a dedicated payment controller and payment routes.

The payment workflow is structured around:

```text
Checkout
   ↓
Payment Request
   ↓
Payment Processing
   ↓
Payment Verification
   ↓
Order Creation
   ↓
Payment Record
   ↓
Order Confirmation
```

Payment-related functionality is isolated from the order logic so that the payment provider can be replaced or expanded later.

---

# 🧾 Receipt & Printer Architecture

Campus Bites includes a printer-service abstraction for café receipt and order tickets.

```text
                    Cloud Backend
                         │
                         ▼
                  Order Confirmed
                         │
                         ▼
                 Printer Service
                         │
                         ▼
                Formatted Receipt
                         │
                         ▼
             Café Printer Integration
                         │
                         ▼
              Physical Thermal Printer
```

The printer layer is intentionally separated from the core ordering system so that physical printer integration can be added without tightly coupling hardware logic to the order controller.

---

# ⭐ Rating System

After completing an order, students can provide feedback through the rating system.

The platform contains:

- Rating model
- Rating controller
- Rating routes
- Rating modal
- Order-based rating workflow

This allows the platform to collect feedback for cafés and menu experiences.

---

# 📊 Application Modules

| Module | Description |
|---|---|
| **Authentication** | Registration, login and JWT authentication |
| **Café Management** | Café information and management |
| **Menu Management** | Café menu items and categories |
| **Cart** | Item selection and multi-café protection |
| **Checkout** | Order review and checkout flow |
| **Payments** | Payment processing and verification |
| **Orders** | Order creation and management |
| **Tracking** | Preparation and order status tracking |
| **Ratings** | Customer feedback and ratings |
| **Staff Dashboard** | Café order management |
| **Admin Dashboard** | Platform-level administration |
| **Printer Service** | Receipt and kitchen ticket abstraction |

---

# ⚙️ Environment Configuration

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_bites
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

For production, use your MongoDB Atlas connection string and production frontend URL.

---

## Frontend

Create:

```text
frontend/.env
```

### Local Development

```env
VITE_API_URL=http://localhost:5000/api
```

### Production

```env
VITE_API_URL=https://campus-bites-zukq.onrender.com/api
```

---

# 💻 Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Vedant417/Campus-Bites.git

cd Campus-Bites
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure the backend `.env` file.

Start the backend:

```bash
npm start
```

The backend will run locally on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🌱 Database Seeding

The project includes a database seeding script for development and testing.

From the backend directory:

```bash
node scripts/seed.js
```

The seed script populates the database with the initial café, menu, user, and staff data required for testing the platform.

> ⚠️ **Warning:** The seed script is intended for development/testing environments. Do not run it against a production database unless you intentionally want to reset or repopulate the seeded data.

---

# 🔄 API Structure

The backend follows a modular REST API architecture.

```text
/api
│
├── /auth
│   └── Authentication & user access
│
├── /cafes
│   └── Café and menu operations
│
├── /orders
│   └── Order creation & management
│
├── /payments
│   └── Payment processing
│
├── /ratings
│   └── Rating & feedback operations
│
└── /cafe-staff
    └── Staff-specific operations
```

The frontend communicates with these APIs through the centralized API service:

```text
frontend/src/services/api.js
```

---

# 🚀 Production Deployment

Campus Bites is deployed using separate frontend and backend services.

## Frontend

```text
React + Vite
       ↓
     Vercel
       ↓
https://campus-bites-pied.vercel.app/
```

## Backend

```text
Node.js + Express
       ↓
     Render
       ↓
https://campus-bites-zukq.onrender.com/
```

## Database

```text
Express Backend
       ↓
MongoDB / Mongoose
       ↓
MongoDB Atlas
```

The production frontend communicates with the deployed backend using:

```env
VITE_API_URL=https://campus-bites-zukq.onrender.com/api
```

---

# 📱 Responsive Experience

The frontend is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile devices

A dedicated `MobileNav` component provides mobile navigation while the main application layout adapts to smaller screen sizes.

---

# 🔮 Future Enhancements

Possible future improvements include:

- Real-time order updates using **WebSockets / Socket.IO**
- Production payment gateway integration
- Digital college ID verification
- College email domain restrictions
- Push notifications for order status
- Café-specific analytics
- Admin analytics dashboard
- Advanced order queue optimization
- Thermal printer hardware integration
- QR-based order pickup
- Customer loyalty and reward system
- Order preparation time analytics
- Cloud-based printer agent for café counters

---

# 🧠 How Campus Bites Works

```text
1. Student opens Campus Bites
             ↓
2. Student authenticates
             ↓
3. Student selects a café
             ↓
4. Student browses the menu
             ↓
5. Items are added to the cart
             ↓
6. Cart validates café consistency
             ↓
7. Student proceeds to checkout
             ↓
8. Payment is processed
             ↓
9. Backend creates the order
             ↓
10. Café staff receives the order
             ↓
11. Staff updates preparation status
             ↓
12. Student tracks the order
             ↓
13. Order is completed
             ↓
14. Student can submit a rating
```

---

# 🎯 Project Objective

Campus Bites was developed to provide a centralized digital ordering experience for college cafés.

The platform aims to:

- Reduce physical queues
- Simplify café order management
- Provide transparent order tracking
- Improve the student ordering experience
- Centralize multiple campus cafés into one platform
- Create a scalable foundation for a complete campus food ecosystem

---

# 👨‍💻 Developed With

## Campus Bites

A full-stack **MERN college café ordering platform**.

| Layer | Technology |
|---|---|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel + Render |

---

# 📄 License

This project is intended for **educational and demonstration purposes**.