# 🛒 AHD Marketplace

> **"Sell anything, buy anything — Buy • Sell • Request • Match • Deal"**

AHD Marketplace is a hyperlocal platform combining an e-commerce marketplace (OLX style), an on-demand gig/worker service directory (Urban Company style), and a reverse-bidding **Request & Match** engine where buyers specify what they need, and the platform matches them with nearby sellers and service providers.

---

## 🌟 Key Features

### 1. 🔄 The "Request - Match - Deal" Engine
* **Request ([`request.html`](request.html))**: When buyers can't find an item or need a specific deal, they post a requirement specifying their budget, preferred condition, and quantity.
* **Match ([`matches.html`](matches.html))**: An intelligent matching algorithm scores and filters inventory based on category, price tolerance, and location.
* **Deal ([`deal.html`](deal.html))**: Real-time deal lifecycle tracking (`Pending` ➔ `Accepted` ➔ `Completed`) with star reviews and contact sharing.

### 2. 🛍️ Hyperlocal Marketplace
* Browse categories: Mobiles, Electronics, Vehicles, Furniture, Fashion, and more.
* Seller listings with image preview, condition tag, price, and geolocation.
* Side-by-side product comparison ([`compare.html`](compare.html)).

### 3. 🛠️ Services & Jobs Hub
* Hire verified local workers: Electricians, Plumbers, Carpenters, Painters, and Technicians.
* Dedicated worker profiles with reviews, badges, and contact options ([`worker-profile.html`](worker-profile.html)).
* Job board for local gigs and hiring ([`jobs.html`](jobs.html)).

### 4. 🔐 Secure Authentication & Strict Privacy
* Distinct portals for **Customers** and **Sellers**.
* **Zero localStorage / Zero sessionStorage constraint**: All client-side persistence is strictly handled via **IndexedDB** (`AHDMarketplaceDB` v4).
* **Salted Password Hashing**: Passwords are securely hashed using Node.js `crypto.scrypt` with random 16-byte salts.
* Transparent offline-first architecture: Works both connected to the Express backend and standalone in the browser.

---

## 🏗️ Architecture & Technology Stack

```
AHD_CREATE_ACCOUNT_FIXED/
├── AHD-BACKEND/               # Node.js + Express REST API
│   ├── data/                  # Persistent JSON storage (users, products, requests, deals)
│   ├── dataStore.js           # Atomic datastore & scrypt password hasher
│   ├── package.json           # Backend dependencies (Express 5)
│   └── server.js              # REST endpoints + CORS + static hosting (:5000)
├── css/                       # Modular page styles
│   ├── style.css              # Global styles & design system
│   ├── signup.css             # Auth layouts
│   └── ...                    # Individual page stylesheets
├── js/                        # Client-side JavaScript modules
│   ├── api.js                 # Unified API client & IndexedDB bridge
│   ├── auth.js                # IndexedDB v4 Auth engine
│   ├── product.js             # Dynamic product rendering
│   ├── sell.js                # Product publishing & persistence
│   ├── request.js             # Requirement submission
│   ├── matches.js             # Proximity & price matching engine
│   └── deal.js                # Deal lifecycle manager
├── index.html                 # Splash landing screen
├── home.html                  # Main marketplace dashboard
├── customer-signup.html       # Customer registration
├── seller-signup.html         # Seller registration
└── ... (25+ HTML pages)
```

---

## 🚀 How to Run

### Option A: Full-Stack Mode (Recommended)

1. Open your terminal in the backend directory:
   ```bash
   cd AHD-BACKEND
   ```

2. Start the Express server:
   ```bash
   npm start
   # or: node server.js
   ```

3. Open your browser at:
   ```
   http://localhost:5000
   ```
   *The Express server automatically serves both the REST API at `/api/...` and all frontend pages!*

### Option B: Standalone / Live Server Mode

You can open [`index.html`](index.html) or [`home.html`](home.html) directly in any modern browser or using VS Code Live Server.
* The frontend automatically detects if the backend is offline and seamlessly uses **IndexedDB** (`AHDMarketplaceDB`) as a local database!

---

## 📡 REST API Reference

The backend runs on `http://localhost:5000/api`.

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user with salted password hash |
| `POST` | `/api/auth/login` | Authenticate user & issue session token |
| `POST` | `/api/auth/update-password` | Reset / update password |

### Products & Marketplace
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Get products (supports `?search=` and `?category=`) |
| `GET` | `/api/products/:id` | Get product details by ID |
| `POST` | `/api/products` | Create a new product listing |

### Requests & Matching
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/requests` | Submit buyer requirement |
| `GET` | `/api/requests/:id` | Get requirement by ID |
| `GET` | `/api/matches/:requestId` | Compute matches for a requirement |

### Deals & Messages
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/deals` | Fetch deals (supports `?user=`) |
| `POST` | `/api/deals` | Create or update deal status |
| `GET` | `/api/messages` | Get user chat messages |
| `POST` | `/api/messages` | Send a chat message |

---

## 🔒 Security & Privacy Notes

* **No localStorage / sessionStorage**: Adheres to strict sandboxing requirements.
* **Salted Password Hashing**: Passwords stored on disk in `data/users.json` are cryptographically hashed using `crypto.scryptSync` with unique salts.
* **CORS Enabled**: Flexible development across different local ports and environments.
