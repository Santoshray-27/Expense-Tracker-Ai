# SmartWealth AI — Interactive Personal Wealth Coach 💰🤖

An intelligent, state-of-the-art Personal Expense Tracker and Wealth Advisor constructed using the **MERN** stack (MongoDB, Express, React, Node.js) with deep integration of **Google Gemini AI**.

This application represents a modern financial hub that allows users to record daily cash flows, allocate monthly category boundaries, view real-time compliance progress meters, and consult an AI wealth coach to audit spending and receive hyper-personalized saving recommendations.

---

## ✨ Features Included

1. **Modern OKLCH Design System**
   - Migrated from legacy teal/amber to a dynamic, semantic **OKLCH-based design tokens** color scheme.
   - Built-in **Light/Dark mode support** (persisted in local storage, defaulting to Light mode).
   - Premium interface aesthetics featuring glassmorphism (`glass-panel`), shadow glows (`glow-primary`), and fluid transitions.
2. **Secure Email/Password JWT Session Authentication**
   - Hashed password management via `bcryptjs` on the server.
   - Protected client state router using JWT browser tokens.
   - Smart redirection that forwards unauthenticated users back to the landing page.
3. **Hybrid Intelligent Record Entry**
   - **Manual Inputs**: Traditional dropdown category selection, values, dates, and vendor notes.
   - **AI Conversational NLP Input**: Write regular phrases like *"spent 45 bucks on dinner tonight with colleagues"* or *"received 500 dollars as freelance design bonus"* and click **Parse**. The backend AI extracts and populates standard database schema values instantly.
4. **Interactive Analytical Graphics (Recharts)**
   - Beautiful responsive **Pie Charts** reflecting proportional category spending, dynamically styled with OKLCH CSS variables for perfect light/dark theme compatibility.
   - Comparative dual-column **Bar Charts** charting Category Budgets vs. Actual monthly spending.
5. **Dynamic Budget Guardrails**
   - Create, edit, and wipe monthly category-level limits.
   - Interactive progress bars color-coded dynamically based on consumption levels (**Green** for safe, **Orange** for >80% warnings, **Red** for >100% exceeded limits).
6. **SmartWealth AI™ Financial Coaching Audit**
   - Aggregates user's cash-flows, budget limits, category breakdowns, and latest transaction history into an advanced context.
   - Requests **Google Gemini AI** to produce a personalized, professional financial advisory review, featuring empathetic feedback, budget violation diagnostics, and exactly 3 actionable, custom wealth strategies.
7. **Graceful Offline Simulator Fallback**
   - If a Google Gemini API Key is not set up, the application continues to run in a **Simulation Mode** using local regex parsing and statistical analysis. This means you can run, log, test, and view custom insights **with zero API keys required out of the box!**

---

## 📂 Project Architecture

The workspace is structured as a concurrent monorepo:
```
├── package.json               # Root scripts to install, build, and run client & server concurrently
├── README.md                  # This documentation guide
├── .gitignore                 # Monorepo git ignore file (node_modules, builds, .env)
├── server/                    # Node.js + Express backend service
│   ├── package.json
│   ├── .env                   # DB secrets, port, and Gemini API keys
│   └── src/
│       ├── index.js           # Server application bootstrapper
│       ├── config/            # Mongoose DB and Gemini AI setups
│       ├── models/            # User, Transaction, and Budget schemas
│       ├── middleware/        # JWT validation interceptors
│       └── routes/            # Auth, transaction, budget, and AI coach API routes
└── client/                    # React + Vite + Tailwind CSS frontend service
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx           # React virtual DOM anchor
        ├── App.jsx            # App view manager, session gatekeeper, and dark mode provider
        ├── index.css          # Core design system stylesheet (OKLCH variables, scrollbars, etc.)
        ├── context/           # Session context and automated token injection axios
        └── components/        # Dashboard, Navbar, Forms, Charts, and AI advisor components
```

---

## 🚀 How to Set Up and Run the App

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (A local running MongoDB database instance or a free MongoDB Atlas connection string)

### 2. Install All Dependencies
We've set up a fast script in the root package to install both the frontend client and backend server packages automatically with a single command. 
Run the following in the project root:
```bash
npm run install-all
```

### 3. Add Your Credentials
Create or edit the `server/.env` configuration file and adjust your settings:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=supersecretkeyforjwtauthentication
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
```
*💡 Note: If you leave `GEMINI_API_KEY` empty, the system automatically runs the intelligence features using high-fidelity local models and simulations, allowing instant testing.*

### 4. Run Both Apps Concurrently (Development)
To start both the Node server (port `5000`) and the Vite React app (port `3000`) concurrently, run:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to begin tracking, budgeting, and consulting your new wealth advisor!

### 5. Build for Production
To bundle and compile the static client-side React assets for deployment, run:
```bash
npm run build
```
This outputs production-optimized, minified JS, HTML, and CSS assets to the `client/dist/` directory.

---

## ☁️ Deployment

This project is configured as a fully deployable MERN monorepo. The server automatically serves the compiled frontend client on production builds.

### Deploying to Render / Railway / Heroku

1. **Create a Web Service / App** on your chosen platform and link this Git repository.
2. **Configure Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure string for session hashing.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `NODE_ENV`: `production`
3. **Configure Build & Start Commands**:
   - **Build Command**: `npm run build` (This installs all dependencies and compiles the client assets).
   - **Start Command**: `npm start` (This starts the Express server which serves the API and the React build).

---

## 🛡️ License
SmartWealth AI is free and open-source software.
