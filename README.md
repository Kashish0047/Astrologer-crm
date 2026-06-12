# AstroManager 🌌

AstroManager is a premium, professional, and secure Client Relation Manager (CRM) designed specifically for astrologers. It provides a unified, aesthetically stunning workspace for tracking client birth coordinates, organizing reading appointments, logging payments, and leveraging Google Gemini AI to synthesize raw session notes into client-ready summaries.

---

## 🚀 Key Features

* **Client Natal Archives:** Securely store detailed client profiles, email/phone details, and precise birth coordinates (date, time, location).
* **Cosmic Scheduling:** Manage consultation schedules with dynamic status indicators (Scheduled, Completed, Cancelled).
* **AI Reading Synthesizer:** Instantly generate professional, structured summaries of your consultations using the state-of-the-art **Gemini 2.5 Flash** model.
* **Revenue Harmonization:** Track UPI, Card, Cash, and Bank Transfer payments. See your billing records update on the visual dashboard charts.
* **Luxury Cosmic UI:** A highly responsive dark-mode dashboard themed with deep indigo/purple tones, floating ambient glow orbs, and clean typography.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React (Vite), TypeScript
* **Styling:** Tailwind CSS, Glassmorphic components, Custom Google Fonts (Cinzel & Plus Jakarta Sans)
* **Icons:** Lucide React
* **State Management & Routing:** React Query (TanStack), React Router DOM v6
* **Form & Validation:** React Hook Form, Zod resolver

### Backend
* **Core:** Node.js, Express, TypeScript
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT), BcryptJS password hashing
* **AI Engine:** Google Generative AI SDK (`@google/generative-ai`)

---

## 📐 Architecture & Notes

### Architectural Overview
AstroManager uses a clean client-server architecture:
1. **Backend (MVC & Services):**
   * **Controllers:** Handle requests and orchestrate business logic (e.g., [auth.controller.ts](file:///C:/Users/HP/.gemini/antigravity/worktrees/Astrologer%20crm/initialize-astrologer-crm-app/backend/src/controllers/auth.controller.ts), [dashboard.controller.ts](file:///C:/Users/HP/.gemini/antigravity/worktrees/Astrologer%20crm/initialize-astrologer-crm-app/backend/src/controllers/dashboard.controller.ts)).
   * **Models:** Define strictly typed MongoDB schemas (User, Client, Appointment, Consultation, Payment).
   * **Middleware:** Handle authentication (`protect`) and custom centralized error handling (`errorHandler`).
   * **Services:** Separate integrations like the [gemini.service.ts](file:///C:/Users/HP/.gemini/antigravity/worktrees/Astrologer%20crm/initialize-astrologer-crm-app/backend/src/services/gemini.service.ts).
2. **Frontend:**
   * Built as an SPA with API client files communicating with the backend.
   * Leverages React Query for automatic caching and state synchronization.

### Assumptions & Implementation Choices
* **Revenue Logic:** Only payments marked as `Paid` are added to the Dashboard's **Total Revenue** card, reflecting actual collected income rather than expected invoices.
* **Robust Aggregations:** MongoDB aggregations are designed to handle both legacy string IDs and Mongoose ObjectIds for maximum durability.
* **AI Error Handling:** If the Gemini API fails (e.g., due to an invalid API key), the backend catches the error gracefully and displays the specific error on the UI instead of throwing a generic server crash.

### Future Enhancements
* **Ephemeris API Integration:** Auto-generate natal chart graphics and planetary positions instantly based on client birth coordinates.
* **Client Portal:** Let clients book their own appointments and securely access their reading summaries.
* **Recurring Billing:** Support subscription-based celestial mentoring packages.

---

## ⚙️ Quick Start

### 1. Prerequisites
Ensure you have Node.js (v18+) and MongoDB installed (or use a MongoDB Atlas URI).

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   GEMINI_API_KEY=your_google_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
