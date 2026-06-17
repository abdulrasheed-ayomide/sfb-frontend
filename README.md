# Spring Financial Bank (SFB) — Frontend

A complete React + Vite frontend for Spring Financial Bank: a professional
public site, customer authentication (register/OTP/login/reset), a banking
dashboard (balance, transfers, transaction history, receipts, notifications,
profile & security), and a separate admin portal (analytics, customer
management, transaction oversight & reversal, audit logs).

Built with **custom CSS only** — no Tailwind, Bootstrap, or Material UI — per
the project specification. Includes light/dark mode.

---

## 1. Project Structure

```
sfb-frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx                 # routing
    ├── context/
    │   ├── AuthContext.jsx      # customer auth state
    │   ├── AdminAuthContext.jsx # admin auth state
    │   ├── ThemeContext.jsx     # light/dark mode
    │   └── ToastContext.jsx     # toast notifications
    ├── services/
    │   ├── api.js               # axios instances + token refresh
    │   ├── authService.js
    │   ├── bankingService.js    # accounts, transactions, profile, notifications
    │   └── adminService.js
    ├── utils/
    │   └── format.js            # currency/date formatting helpers
    ├── styles/                   # custom CSS design system (tokens, layout,
    │                             #  buttons, forms, components, public,
    │                             #  auth, dashboard, admin)
    ├── components/
    │   ├── common/               # Logo, PageLoader, StatusBadge, Pagination,
    │   │                          # EmptyState, PasswordInput, ConfirmModal
    │   ├── layout/                # PublicLayout, AuthLayout, DashboardLayout,
    │   │                          # AdminLayout, sidebars, topbars, route guards
    │   └── admin/                 # AdminSidebar, AdminTopbar
    └── pages/
        ├── public/                # Landing, Privacy Policy, Terms
        ├── auth/                  # Register, VerifyOtp, Login, Forgot/Reset password
        ├── dashboard/             # Overview, Transfer, Transactions, Notifications, Profile
        └── admin/                 # Login, Overview, Users, UserDetail, Transactions,
                                    # TransactionDetail, AuditLogs
```

---

## 2. Setup

### 2.1 Install dependencies

```bash
cd sfb-frontend
npm install
```

### 2.2 Configure the API URL

```bash
cp .env.example .env
```

By default this points to `http://localhost:5000/api/v1` (the SFB backend
running locally). Update `VITE_API_BASE_URL` if your backend runs elsewhere.

### 2.3 Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:3000`. The Vite dev server proxies
`/api` and `/uploads` requests to `http://localhost:5000` (see
`vite.config.js`), so you can also leave `VITE_API_BASE_URL` unset and use
relative `/api/v1` paths if preferred.

### 2.4 Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## 3. Connecting to the Backend

This frontend expects the SFB backend (Node/Express/MongoDB) to be running
and reachable at `VITE_API_BASE_URL`. Make sure:

1. The backend's `CLIENT_URL` (in its `.env`) is set to this frontend's
   origin (e.g. `http://localhost:3000`) — required for CORS and cookie
   handling (refresh tokens are sent as `httpOnly` cookies).
2. Both servers are running:
   ```bash
   # Terminal 1
   cd sfb-backend && npm run dev

   # Terminal 2
   cd sfb-frontend && npm run dev
   ```
3. To access the admin portal, seed a superadmin in the backend
   (`npm run seed:admin`), then visit `/admin/login`.

---

## 4. Key Flows

### Customer
- **Register** (`/register`) → **Verify OTP** (`/verify-otp`) → account
  activated, banking Account created → **Log in** (`/login`) →
  **Dashboard** (`/dashboard`).
- **Transfer** (`/dashboard/transfer`): 3-step flow — verify recipient
  account, enter amount/narration, confirm. On success, shows a receipt
  download link.
- **Transactions** (`/dashboard/transactions`): searchable, filterable,
  paginated history with per-transaction PDF receipt downloads.
- **Notifications** (`/dashboard/notifications`): in-app notification
  center with unread counts and mark-as-read.
- **Profile & Security** (`/dashboard/profile`): update name/phone, upload
  profile photo, change password, view account/KYC status.

### Admin
- **Login** (`/admin/login`) — separate auth system from customers.
- **Overview** (`/admin`): user and transaction stats, 14-day activity chart.
- **Customers** (`/admin/users`): search/filter, view details, change
  account status (active/suspended/frozen) and KYC status.
- **Transactions** (`/admin/transactions`): search/filter all transactions,
  view full state history, manually reverse successful transactions with a
  required reason.
- **Audit Logs** (`/admin/audit-logs`): searchable, filterable audit trail.

---

## 5. Design System

All styling is custom CSS using CSS custom properties defined in
`src/styles/tokens.css`:

- **Colors**: navy (`--sfb-navy`), steel blue accent (`--sfb-blue`), neutral
  grays, and semantic success/danger/warning/info colors — each with a dark
  mode override via `[data-theme="dark"]`.
- **Typography**: `Source Serif 4` for headings (gives the brand gravitas),
  `Inter` for body/UI text, and `IBM Plex Mono` for account numbers,
  balances, and transaction references — a consistent "ledger" motif used
  throughout the public site, dashboard, and admin portal.
- **Components**: buttons, forms, cards, badges (including
  transaction-lifecycle-specific status badges), tables, alerts, toasts,
  modals, pagination, and skeleton loaders — all in `src/styles/components.css`,
  `buttons.css`, and `forms.css`.

Toggle dark mode via the sun/moon icon in the navbar or dashboard topbar;
the preference is saved to `localStorage` and respects the user's OS
preference on first load.
