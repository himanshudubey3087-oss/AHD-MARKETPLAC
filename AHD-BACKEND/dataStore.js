const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const DATA_DIR = process.env.VERCEL 
    ? path.join("/tmp", "ahd-data")
    : path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, "marketplace.db");

// On Vercel, copy pre-seeded database to /tmp if not already there
if (process.env.VERCEL) {
    const seedDb = path.join(__dirname, "data", "marketplace.db");
    if (fs.existsSync(seedDb) && !fs.existsSync(DB_FILE)) {
        try { fs.copyFileSync(seedDb, DB_FILE); } catch (_) {}
    }
}

// Seed Products
const SEED_PRODUCTS = [
    {
        id: "P001",
        name: "Samsung Galaxy S23 256GB",
        price: 42000,
        originalPrice: 74999,
        category: "Mobiles",
        condition: "Like New",
        location: "Agra, Uttar Pradesh",
        description: "Samsung Galaxy S23 with Snapdragon 8 Gen 2. Like-new condition with bill, box, and charger. No scratches.",
        sellerId: "USR-DEMO-SELLER",
        sellerName: "Aman Gupta",
        sellerPhone: "9123456789",
        sellerEmail: "seller@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.7,
        status: "active"
    },
    {
        id: "P002",
        name: "iPhone 13 128GB Blue",
        price: 38000,
        originalPrice: 69900,
        category: "Mobiles",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        description: "iPhone 13 128GB blue color. Battery health 87%. Display and camera in flawless condition with original cable.",
        sellerId: "USR-DEMO-SELLER",
        sellerName: "Aman Gupta",
        sellerPhone: "9123456789",
        sellerEmail: "seller@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1592286927505-2fd4b5e8c2e7?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.6,
        status: "active"
    },
    {
        id: "P003",
        name: "Dell Inspiron 15 Core i5 Laptop",
        price: 35000,
        originalPrice: 58000,
        category: "Electronics",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        description: "11th Gen Core i5, 16GB RAM, 512GB SSD. Perfect for coding, office work, and daily browsing.",
        sellerId: "USR-DEMO-SELLER",
        sellerName: "Aman Gupta",
        sellerPhone: "9123456789",
        sellerEmail: "seller@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.5,
        status: "active"
    },
    {
        id: "P004",
        name: "HP Victus Gaming Laptop",
        price: 54000,
        originalPrice: 76000,
        category: "Electronics",
        condition: "Like New",
        location: "Mathura, Uttar Pradesh",
        description: "Ryzen 5 5600H, GTX 1650, 144Hz IPS display, 16GB RAM. Mint condition with original box.",
        sellerId: "USR-DEMO-SELLER",
        sellerName: "Aman Gupta",
        sellerPhone: "9123456789",
        sellerEmail: "seller@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.8,
        status: "active"
    },
    {
        id: "P005",
        name: "Solid Wooden Study Table & Chair",
        price: 4500,
        originalPrice: 8500,
        category: "Furniture",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        description: "Sturdy Sheesham wood study desk with 2 storage drawers and ergonomic chair. Selling due to relocation.",
        sellerId: "USR-DEMO-CUSTOMER",
        sellerName: "Rahul Sharma",
        sellerPhone: "9876543210",
        sellerEmail: "customer@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.4,
        status: "active"
    },
    {
        id: "P006",
        name: "Royal Enfield Classic 350 Gunmetal",
        price: 145000,
        originalPrice: 210000,
        category: "Vehicles",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        description: "Classic 350 Gunmetal Grey, single owner, comprehensive insurance, regular authorized service.",
        sellerId: "USR-DEMO-CUSTOMER",
        sellerName: "Rahul Sharma",
        sellerPhone: "9876543210",
        sellerEmail: "customer@ahd.in",
        images: [
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80"
        ],
        rating: 4.9,
        status: "active"
    }
];

// Seed Services
const SEED_SERVICES = [
    {
        id: "SRV-001",
        name: "Bridal Makeup & Premium Hair Styling",
        providerName: "Neha Beauty Studio",
        category: "Beauty & Salon",
        price: 3500,
        rating: 4.9,
        reviewsCount: 48,
        location: "Agra, Uttar Pradesh",
        phone: "9876543210",
        email: "neha.studio@ahd.in",
        description: "Professional bridal makeup, HD makeup, party makeover, hair spa, and skin treatments by certified makeup artists.",
        availability: "Available Today",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "SRV-002",
        name: "Complete Home Electrical Wiring & Repair",
        providerName: "Rajesh Electrical Works",
        category: "Electrician",
        price: 350,
        rating: 4.8,
        reviewsCount: 62,
        location: "Agra, Uttar Pradesh",
        phone: "9812345678",
        email: "rajesh.electric@ahd.in",
        description: "Expert electrician for short-circuit repair, MCB installation, house wiring, ceiling fan fitting, and inverter setups.",
        availability: "Available",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "SRV-003",
        name: "Plumbing Installation & Leakage Repair",
        providerName: "Sharma Plumbing Solutions",
        category: "Plumber",
        price: 299,
        rating: 4.7,
        reviewsCount: 39,
        location: "Agra, Uttar Pradesh",
        phone: "9823456789",
        email: "sharma.plumbing@ahd.in",
        description: "Fast pipe leakage repair, water motor installation, bathroom sanitary fittings, and RO water filter service.",
        availability: "Available in 30 mins",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80"
    }
];

class DatabaseEngine {
    constructor() {
        this.db = new DatabaseSync(DB_FILE);
        this.init();
    }

    init() {
        // Optimize for speed and integrity
        this.db.exec("PRAGMA journal_mode = WAL;");
        this.db.exec("PRAGMA foreign_keys = ON;");

        // Create Tables
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE,
                phone TEXT UNIQUE,
                role TEXT NOT NULL DEFAULT 'customer',
                location TEXT DEFAULT 'Agra, Uttar Pradesh',
                passwordHash TEXT NOT NULL,
                passwordSalt TEXT NOT NULL,
                profilePhoto TEXT,
                bio TEXT,
                businessName TEXT,
                serviceCategory TEXT,
                rating REAL DEFAULT 5.0,
                verified INTEGER DEFAULT 1,
                notificationsEnabled INTEGER DEFAULT 1,
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );

            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                originalPrice REAL,
                category TEXT NOT NULL,
                condition TEXT DEFAULT 'Used',
                location TEXT DEFAULT 'Agra, Uttar Pradesh',
                description TEXT,
                imagesJson TEXT,
                sellerId TEXT,
                sellerName TEXT,
                sellerPhone TEXT,
                sellerEmail TEXT,
                rating REAL DEFAULT 4.5,
                status TEXT DEFAULT 'active',
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );

            CREATE TABLE IF NOT EXISTS deals (
                dealId TEXT PRIMARY KEY,
                productId TEXT,
                productName TEXT,
                productPrice REAL,
                agreedPrice REAL,
                customerId TEXT,
                customerName TEXT,
                customerEmail TEXT,
                customerPhone TEXT,
                sellerId TEXT,
                sellerName TEXT,
                sellerEmail TEXT,
                sellerPhone TEXT,
                status TEXT DEFAULT 'initiated',
                messagesJson TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );

            CREATE TABLE IF NOT EXISTS requests (
                requestId TEXT PRIMARY KEY,
                userId TEXT,
                userName TEXT,
                userPhone TEXT,
                userEmail TEXT,
                product TEXT,
                category TEXT,
                budget REAL,
                location TEXT,
                details TEXT,
                status TEXT DEFAULT 'Pending',
                createdAt TEXT NOT NULL,
                updatedAt TEXT
            );

            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                dealId TEXT,
                sender TEXT NOT NULL,
                receiver TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                read INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                type TEXT DEFAULT 'info',
                link TEXT,
                read INTEGER DEFAULT 0,
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                providerName TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                rating REAL DEFAULT 4.8,
                reviewsCount INTEGER DEFAULT 0,
                location TEXT DEFAULT 'Agra, Uttar Pradesh',
                phone TEXT,
                email TEXT,
                description TEXT,
                availability TEXT DEFAULT 'Available',
                image TEXT,
                createdAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                expiresAt TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS otps (
                id TEXT PRIMARY KEY,
                target TEXT NOT NULL,
                type TEXT NOT NULL,
                otp TEXT NOT NULL,
                expiresAt TEXT NOT NULL,
                verified INTEGER DEFAULT 0,
                createdAt TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_otps_target ON otps(target);
        `);

        this.seedInitialData();
    }

    hashPassword(password, salt) {
        if (!salt) {
            salt = crypto.randomBytes(16).toString("hex");
        }
        const hash = crypto.scryptSync(password, salt, 64).toString("hex");
        return { hash, salt };
    }

    verifyPassword(password, hash, salt) {
        try {
            const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
            return testHash === hash;
        } catch (_) {
            return false;
        }
    }

    seedInitialData() {
        // 1. Seed Users if empty
        const userCount = this.db.prepare("SELECT COUNT(*) as count FROM users").get().count;
        if (userCount === 0) {
            const custHash = this.hashPassword("123456");
            const sellerHash = this.hashPassword("123456");

            const insertUser = this.db.prepare(`
                INSERT INTO users (
                    id, name, email, phone, role, location, passwordHash, passwordSalt, businessName, verified, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insertUser.run(
                "USR-DEMO-CUSTOMER",
                "Rahul Sharma",
                "customer@ahd.in",
                "9876543210",
                "customer",
                "Agra, Uttar Pradesh",
                custHash.hash,
                custHash.salt,
                "",
                1,
                new Date().toISOString()
            );

            insertUser.run(
                "USR-DEMO-SELLER",
                "Aman Gupta",
                "seller@ahd.in",
                "9123456789",
                "seller",
                "Agra, Uttar Pradesh",
                sellerHash.hash,
                sellerHash.salt,
                "Aman Electronics & Mobiles",
                1,
                new Date().toISOString()
            );

            // Seed Neha Beauty Studio as a verified seller
            const nehaHash = this.hashPassword("123456");
            insertUser.run(
                "USR-DEMO-NEHA",
                "Neha Beauty Studio",
                "neha.studio@ahd.in",
                "9876501234",
                "seller",
                "Agra, Uttar Pradesh",
                nehaHash.hash,
                nehaHash.salt,
                "Neha Beauty Studio",
                1,
                new Date().toISOString()
            );
        }

        // 2. Seed Products if empty
        const prodCount = this.db.prepare("SELECT COUNT(*) as count FROM products").get().count;
        if (prodCount === 0) {
            const insertProduct = this.db.prepare(`
                INSERT INTO products (
                    id, name, price, originalPrice, category, condition, location, description, imagesJson,
                    sellerId, sellerName, sellerPhone, sellerEmail, rating, status, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const p of SEED_PRODUCTS) {
                insertProduct.run(
                    p.id,
                    p.name,
                    p.price,
                    p.originalPrice || p.price,
                    p.category,
                    p.condition,
                    p.location,
                    p.description,
                    JSON.stringify(p.images),
                    p.sellerId,
                    p.sellerName,
                    p.sellerPhone,
                    p.sellerEmail,
                    p.rating,
                    p.status,
                    new Date().toISOString()
                );
            }
        }

        // 3. Seed Services if empty
        const srvCount = this.db.prepare("SELECT COUNT(*) as count FROM services").get().count;
        if (srvCount === 0) {
            const insertService = this.db.prepare(`
                INSERT INTO services (
                    id, name, providerName, category, price, rating, reviewsCount, location, phone, email, description, availability, image, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const s of SEED_SERVICES) {
                insertService.run(
                    s.id,
                    s.name,
                    s.providerName,
                    s.category,
                    s.price,
                    s.rating,
                    s.reviewsCount,
                    s.location,
                    s.phone,
                    s.email,
                    s.description,
                    s.availability,
                    s.image,
                    new Date().toISOString()
                );
            }
        }

        // 4. Seed Demo Notifications
        const notifCount = this.db.prepare("SELECT COUNT(*) as count FROM notifications").get().count;
        if (notifCount === 0) {
            const insertNotif = this.db.prepare(`
                INSERT INTO notifications (id, userId, title, message, type, link, read, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insertNotif.run(
                "NTF-001",
                "customer@ahd.in",
                "Welcome to AHD Marketplace!",
                "Explore hyperlocal products, post requests, and connect with verified local sellers.",
                "welcome",
                "home.html",
                0,
                new Date().toISOString()
            );

            insertNotif.run(
                "NTF-002",
                "customer@ahd.in",
                "Live Location Active",
                "AHD is configured to show items nearest to your detected location.",
                "location",
                "home.html",
                0,
                new Date().toISOString()
            );
        }

        this.syncToJsonFiles();
    }

    // Mirror to JSON files so they are always in sync for human review & backup
    syncToJsonFiles() {
        try {
            const users = this.getAllUsers();
            fs.writeFileSync(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2), "utf-8");

            const products = this.getProducts();
            fs.writeFileSync(path.join(DATA_DIR, "products.json"), JSON.stringify(products, null, 2), "utf-8");

            const deals = this.getDeals();
            fs.writeFileSync(path.join(DATA_DIR, "deals.json"), JSON.stringify(deals, null, 2), "utf-8");

            const requests = this.getRequests();
            fs.writeFileSync(path.join(DATA_DIR, "requests.json"), JSON.stringify(requests, null, 2), "utf-8");

            const messages = this.getMessages();
            fs.writeFileSync(path.join(DATA_DIR, "messages.json"), JSON.stringify(messages, null, 2), "utf-8");
        } catch (e) {
            console.warn("JSON sync note:", e.message);
        }
    }

    /* =====================================================
       OTP GENERATION & SQLITE PERSISTENCE
    ===================================================== */
    normalizeOtpTarget(target) {
        if (!target) return "";
        const str = String(target).trim().toLowerCase();
        if (str.includes("@")) {
            return str;
        }
        const digits = str.replace(/\D/g, "");
        if (digits.length >= 10) {
            return digits.slice(-10);
        }
        return str;
    }

    generateOtp(target, type = "phone") {
        if (!target) {
            throw new Error("Target phone number or email address is required.");
        }
        const normalizedTarget = this.normalizeOtpTarget(target);
        const resolvedType = type || (normalizedTarget.includes("@") ? "email" : "phone");

        if (resolvedType === "phone") {
            const digits = normalizedTarget.replace(/\D/g, "");
            if (digits.length < 10) {
                throw new Error("Please enter a valid 10-digit mobile number.");
            }
        } else if (resolvedType === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedTarget)) {
                throw new Error("Please enter a valid email address.");
            }
        }

        // Generate 6-digit cryptographic random OTP
        const otpNum = crypto.randomInt(100000, 999999);
        const otp = otpNum.toString();
        const id = "OTP-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

        const stmt = this.db.prepare(`
            INSERT INTO otps (id, target, type, otp, expiresAt, verified, createdAt)
            VALUES (?, ?, ?, ?, ?, 0, ?)
        `);
        stmt.run(id, normalizedTarget, resolvedType, otp, expiresAt, createdAt);

        console.log(`\n========================================\n[SIMULATED SMS / PHONE GATEWAY]\nTO: ${normalizedTarget} (${resolvedType.toUpperCase()})\nYOUR AHD VERIFICATION CODE IS: ${otp}\n========================================\n`);

        // Also add notification for user audit
        try {
            this.createNotification({
                userId: normalizedTarget,
                title: `AHD Verification Code (${resolvedType.toUpperCase()})`,
                message: `Your verification OTP is: ${otp}. Valid for 10 minutes.`,
                type: "auth",
                link: "signup.html"
            });
        } catch (_) {}

        return {
            id,
            target: normalizedTarget,
            type: resolvedType,
            otp,
            expiresAt,
            createdAt,
            message: `OTP generated and saved to database for ${normalizedTarget}.`
        };
    }

    verifyOtp(target, otp) {
        if (!target || !otp) {
            return { valid: false, error: "Target and OTP are required." };
        }
        const normalizedTarget = this.normalizeOtpTarget(target);
        const inputOtp = String(otp).trim();

        // Support demo OTP for developer convenience
        if (inputOtp === "123456") {
            return { valid: true, message: "Demo OTP verified successfully." };
        }

        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
            SELECT * FROM otps 
            WHERE target = ? AND otp = ? AND expiresAt >= ? 
            ORDER BY createdAt DESC LIMIT 1
        `);
        const row = stmt.get(normalizedTarget, inputOtp, now);

        if (!row) {
            return { valid: false, error: "Invalid or expired OTP. Please enter the generated OTP." };
        }

        // Mark OTP as verified in SQLite
        const updateStmt = this.db.prepare("UPDATE otps SET verified = 1 WHERE id = ?");
        updateStmt.run(row.id);

        return { valid: true, message: "OTP verified successfully." };
    }

    getLatestOtp(target) {
        if (!target) return null;
        const normalizedTarget = this.normalizeOtpTarget(target);
        const stmt = this.db.prepare(`
            SELECT * FROM otps WHERE target = ? ORDER BY createdAt DESC LIMIT 1
        `);
        return stmt.get(normalizedTarget) || null;
    }

    /* =====================================================
       USERS & AUTHENTICATION
    ===================================================== */
    findUserByEmailOrPhone(identifier) {
        if (!identifier) return null;
        const clean = String(identifier).trim().toLowerCase();
        const digits = clean.replace(/\D/g, "");

        let stmt;
        if (digits.length >= 10) {
            stmt = this.db.prepare("SELECT * FROM users WHERE LOWER(email) = ? OR phone = ? LIMIT 1");
            return stmt.get(clean, digits) || null;
        } else {
            stmt = this.db.prepare("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1");
            return stmt.get(clean) || null;
        }
    }

    findUserById(id) {
        if (!id) return null;
        const stmt = this.db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
        return stmt.get(String(id)) || null;
    }

    getAllUsers() {
        const stmt = this.db.prepare(`
            SELECT id, name, email, phone, role, location, profilePhoto, bio, businessName,
                   serviceCategory, rating, verified, notificationsEnabled, createdAt, updatedAt
            FROM users
        `);
        return stmt.all();
    }

    createUser(userData) {
        const email = String(userData.email || "").trim().toLowerCase();
        const phone = String(userData.phone || "").replace(/\D/g, "");
        const name = userData.name || userData.fullName || "";
        const role = userData.role || "customer";
        const location = userData.location || "Agra, Uttar Pradesh";

        if (!email && !phone) {
            throw new Error("Email or phone number is required.");
        }

        const existing = this.findUserByEmailOrPhone(email) || (phone ? this.findUserByEmailOrPhone(phone) : null);
        if (existing) {
            throw new Error("An account with this email or phone number already exists.");
        }

        const { hash, salt } = this.hashPassword(userData.password || "123456");
        const id = "USR-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        const createdAt = new Date().toISOString();

        const insert = this.db.prepare(`
            INSERT INTO users (
                id, name, email, phone, role, location, passwordHash, passwordSalt,
                profilePhoto, bio, businessName, serviceCategory, rating, verified, notificationsEnabled, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(
            id,
            name,
            email,
            phone,
            role,
            location,
            hash,
            salt,
            userData.profilePhoto || "",
            userData.bio || "",
            userData.businessName || (role === "seller" ? name : ""),
            userData.serviceCategory || "",
            5.0,
            1,
            1,
            createdAt
        );

        this.syncToJsonFiles();

        return {
            id,
            name,
            email,
            phone,
            role,
            location,
            businessName: userData.businessName || "",
            verified: 1,
            createdAt
        };
    }

    authenticateUser(identifier, password, requestedRole) {
        const user = this.findUserByEmailOrPhone(identifier);
        if (!user) {
            throw new Error("Account not found with this email or phone. Please check your credentials or register.");
        }

        if (requestedRole && user.role && user.role !== requestedRole && user.role !== "both") {
            throw new Error(`This account is registered as '${user.role}'. Please select the correct login tab.`);
        }

        let isValid = false;
        if (user.passwordHash && user.passwordSalt) {
            isValid = this.verifyPassword(password, user.passwordHash, user.passwordSalt);
        } else if (user.password) {
            isValid = (user.password === password);
        }

        if (!isValid) {
            throw new Error("Incorrect password. Please verify your password and try again.");
        }

        const token = this.createSession(user.id);
        const { passwordHash, passwordSalt, ...safeUser } = user;
        return { user: safeUser, token };
    }

    createSession(userId) {
        const token = "AHD_SESSION_" + crypto.randomBytes(24).toString("hex");
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const insertSession = this.db.prepare(`
            INSERT OR REPLACE INTO sessions (token, userId, createdAt, expiresAt)
            VALUES (?, ?, ?, ?)
        `);
        insertSession.run(token, String(userId), createdAt, expiresAt);
        return token;
    }

    getUserByToken(token) {
        if (!token) return null;
        const stmt = this.db.prepare(`
            SELECT u.* FROM users u
            JOIN sessions s ON u.id = s.userId
            WHERE s.token = ? AND s.expiresAt > datetime('now')
            LIMIT 1
        `);
        const user = stmt.get(token);
        if (!user) return null;
        const { passwordHash, passwordSalt, ...safeUser } = user;
        return safeUser;
    }

    deleteSession(token) {
        if (!token) return false;
        const stmt = this.db.prepare("DELETE FROM sessions WHERE token = ?");
        stmt.run(token);
        return true;
    }

    updateUserProfile(identifier, profileData) {
        const user = this.findUserByEmailOrPhone(identifier) || this.findUserById(identifier);
        if (!user) {
            throw new Error("User not found to update profile.");
        }

        const name = profileData.name !== undefined ? profileData.name : user.name;
        const location = profileData.location !== undefined ? profileData.location : user.location;
        const profilePhoto = profileData.profilePhoto !== undefined ? profileData.profilePhoto : user.profilePhoto;
        const bio = profileData.bio !== undefined ? profileData.bio : user.bio;
        const businessName = profileData.businessName !== undefined ? profileData.businessName : user.businessName;
        const serviceCategory = profileData.serviceCategory !== undefined ? profileData.serviceCategory : user.serviceCategory;
        const notificationsEnabled = profileData.notificationsEnabled !== undefined ? (profileData.notificationsEnabled ? 1 : 0) : user.notificationsEnabled;
        const updatedAt = new Date().toISOString();

        const stmt = this.db.prepare(`
            UPDATE users SET
                name = ?,
                location = ?,
                profilePhoto = ?,
                bio = ?,
                businessName = ?,
                serviceCategory = ?,
                notificationsEnabled = ?,
                updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(name, location, profilePhoto, bio, businessName, serviceCategory, notificationsEnabled, updatedAt, user.id);
        this.syncToJsonFiles();

        const updated = this.findUserById(user.id);
        const { passwordHash, passwordSalt, ...safeUser } = updated;
        return safeUser;
    }

    updatePassword(identifier, newPassword) {
        const user = this.findUserByEmailOrPhone(identifier);
        if (!user) {
            throw new Error("User not found.");
        }

        const { hash, salt } = this.hashPassword(newPassword);
        const updatedAt = new Date().toISOString();

        const stmt = this.db.prepare("UPDATE users SET passwordHash = ?, passwordSalt = ?, updatedAt = ? WHERE id = ?");
        stmt.run(hash, salt, updatedAt, user.id);
        this.syncToJsonFiles();
        return true;
    }

    /* =====================================================
       PRODUCTS CRUD
    ===================================================== */
    getProducts(filters = {}) {
        let sql = "SELECT * FROM products WHERE status = 'active'";
        const params = [];

        if (filters.category && filters.category !== "All" && filters.category !== "") {
            sql += " AND LOWER(category) = LOWER(?)";
            params.push(filters.category);
        }

        if (filters.search && filters.search.trim()) {
            sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)";
            const term = `%${filters.search.trim().toLowerCase()}%`;
            params.push(term, term, term);
        }

        if (filters.location && filters.location.trim()) {
            sql += " AND LOWER(location) LIKE ?";
            params.push(`%${filters.location.trim().toLowerCase()}%`);
        }

        if (filters.minPrice && Number(filters.minPrice) > 0) {
            sql += " AND price >= ?";
            params.push(Number(filters.minPrice));
        }

        if (filters.maxPrice && Number(filters.maxPrice) > 0) {
            sql += " AND price <= ?";
            params.push(Number(filters.maxPrice));
        }

        sql += " ORDER BY createdAt DESC";

        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);

        return rows.map(r => ({
            ...r,
            images: r.imagesJson ? JSON.parse(r.imagesJson) : [],
            seller: {
                name: r.sellerName,
                phone: r.sellerPhone,
                email: r.sellerEmail
            }
        }));
    }

    getProductById(id) {
        if (!id) return null;
        const stmt = this.db.prepare("SELECT * FROM products WHERE id = ? LIMIT 1");
        const r = stmt.get(String(id));
        if (!r) return null;

        return {
            ...r,
            images: r.imagesJson ? JSON.parse(r.imagesJson) : [],
            seller: {
                name: r.sellerName,
                phone: r.sellerPhone,
                email: r.sellerEmail
            }
        };
    }

    createProduct(productData) {
        const id = productData.id || ("P" + Math.floor(100000 + Math.random() * 900000));
        const createdAt = new Date().toISOString();
        const images = Array.isArray(productData.images)
            ? productData.images
            : (productData.image ? [productData.image] : []);

        const seller = productData.seller || {};
        const sellerId = productData.sellerId || seller.id || "USR-SELLER";
        const sellerName = productData.sellerName || seller.name || "AHD Verified Seller";
        const sellerPhone = productData.sellerPhone || seller.phone || "";
        const sellerEmail = productData.sellerEmail || seller.email || "";

        const stmt = this.db.prepare(`
            INSERT INTO products (
                id, name, price, originalPrice, category, condition, location,
                description, imagesJson, sellerId, sellerName, sellerPhone, sellerEmail,
                rating, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            productData.name,
            Number(productData.price || 0),
            Number(productData.originalPrice || productData.price || 0),
            productData.category || "General",
            productData.condition || "Used",
            productData.location || "Agra, Uttar Pradesh",
            productData.description || "",
            JSON.stringify(images),
            sellerId,
            sellerName,
            sellerPhone,
            sellerEmail,
            4.8,
            "active",
            createdAt
        );

        this.syncToJsonFiles();
        return this.getProductById(id);
    }

    updateProduct(id, updateData) {
        const existing = this.getProductById(id);
        if (!existing) throw new Error("Product not found to update.");

        const name = updateData.name !== undefined ? updateData.name : existing.name;
        const price = updateData.price !== undefined ? Number(updateData.price) : existing.price;
        const category = updateData.category !== undefined ? updateData.category : existing.category;
        const condition = updateData.condition !== undefined ? updateData.condition : existing.condition;
        const location = updateData.location !== undefined ? updateData.location : existing.location;
        const description = updateData.description !== undefined ? updateData.description : existing.description;
        const images = updateData.images ? JSON.stringify(updateData.images) : existing.imagesJson;
        const updatedAt = new Date().toISOString();

        const stmt = this.db.prepare(`
            UPDATE products SET
                name = ?, price = ?, category = ?, condition = ?,
                location = ?, description = ?, imagesJson = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(name, price, category, condition, location, description, images, updatedAt, id);
        this.syncToJsonFiles();
        return this.getProductById(id);
    }

    deleteProduct(id) {
        const stmt = this.db.prepare("DELETE FROM products WHERE id = ?");
        stmt.run(String(id));
        this.syncToJsonFiles();
        return true;
    }

    /* =====================================================
       BUYER REQUESTS & MATCHING
    ===================================================== */
    getRequests(userEmail) {
        let sql = "SELECT * FROM requests";
        const params = [];
        if (userEmail) {
            sql += " WHERE LOWER(userEmail) = LOWER(?)";
            params.push(userEmail);
        }
        sql += " ORDER BY createdAt DESC";
        const stmt = this.db.prepare(sql);
        return stmt.all(...params).map(r => ({
            ...r,
            requirement: {
                product: r.product,
                category: r.category,
                budget: r.budget,
                location: r.location,
                details: r.details
            }
        }));
    }

    getRequestById(requestId) {
        const stmt = this.db.prepare("SELECT * FROM requests WHERE requestId = ? LIMIT 1");
        const r = stmt.get(String(requestId));
        if (!r) return null;
        return {
            ...r,
            requirement: {
                product: r.product,
                category: r.category,
                budget: r.budget,
                location: r.location,
                details: r.details
            }
        };
    }

    createRequest(data) {
        const requestId = data.requestId || ("REQ-" + Date.now());
        const user = data.user || {};
        const req = data.requirement || {};
        const createdAt = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO requests (
                requestId, userId, userName, userPhone, userEmail,
                product, category, budget, location, details, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            requestId,
            data.userId || user.id || "USR-GUEST",
            data.userName || user.name || "Customer",
            data.userPhone || user.phone || "",
            data.userEmail || user.email || "",
            req.product || data.product || "",
            req.category || data.category || "General",
            Number(req.budget || data.budget || 0),
            req.location || data.location || "Agra, Uttar Pradesh",
            req.details || data.details || "",
            "Pending",
            createdAt
        );

        this.syncToJsonFiles();
        return this.getRequestById(requestId);
    }

    findMatchesForRequest(requestId) {
        const request = this.getRequestById(requestId);
        if (!request) return [];

        const reqCategory = (request.category || "").toLowerCase();
        const reqName = (request.product || "").toLowerCase();
        const maxBudget = Number(request.budget || 0);

        const products = this.getProducts();

        return products.filter(p => {
            const catMatch = !reqCategory || (p.category || "").toLowerCase().includes(reqCategory) || reqCategory.includes((p.category || "").toLowerCase());
            const nameMatch = !reqName || (p.name || "").toLowerCase().includes(reqName) || (p.description || "").toLowerCase().includes(reqName);
            const budgetMatch = !maxBudget || Number(p.price) <= (maxBudget * 1.25);

            return (catMatch || nameMatch) && (budgetMatch || !maxBudget);
        }).map(p => ({
            ...p,
            matchScore: Math.min(99, Math.floor(75 + Math.random() * 24))
        }));
    }

    /* =====================================================
       DEALS & NEGOTIATION
    ===================================================== */
    getDeals(userIdentifier) {
        let sql = "SELECT * FROM deals";
        const params = [];
        if (userIdentifier) {
            const clean = userIdentifier.toLowerCase();
            sql += " WHERE LOWER(customerEmail) = ? OR LOWER(sellerEmail) = ? OR customerId = ? OR sellerId = ?";
            params.push(clean, clean, userIdentifier, userIdentifier);
        }
        sql += " ORDER BY createdAt DESC";
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);

        return rows.map(d => ({
            ...d,
            customer: {
                id: d.customerId,
                name: d.customerName,
                email: d.customerEmail,
                phone: d.customerPhone
            },
            seller: {
                id: d.sellerId,
                name: d.sellerName,
                email: d.sellerEmail,
                phone: d.sellerPhone
            },
            messages: d.messagesJson ? JSON.parse(d.messagesJson) : []
        }));
    }

    getDealById(dealId) {
        if (!dealId) return null;
        const stmt = this.db.prepare("SELECT * FROM deals WHERE dealId = ? LIMIT 1");
        const d = stmt.get(String(dealId));
        if (!d) return null;
        return {
            ...d,
            customer: {
                id: d.customerId,
                name: d.customerName,
                email: d.customerEmail,
                phone: d.customerPhone
            },
            seller: {
                id: d.sellerId,
                name: d.sellerName,
                email: d.sellerEmail,
                phone: d.sellerPhone
            },
            messages: d.messagesJson ? JSON.parse(d.messagesJson) : []
        };
    }

    createOrUpdateDeal(dealData) {
        const dealId = dealData.dealId || ("DEAL-" + Date.now());
        const customer = dealData.customer || {};
        const seller = dealData.seller || {};
        const messages = Array.isArray(dealData.messages) ? dealData.messages : [];
        const updatedAt = new Date().toISOString();

        const existing = this.db.prepare("SELECT * FROM deals WHERE dealId = ?").get(dealId);

        if (existing) {
            const stmt = this.db.prepare(`
                UPDATE deals SET
                    agreedPrice = ?,
                    status = ?,
                    messagesJson = ?,
                    updatedAt = ?
                WHERE dealId = ?
            `);
            stmt.run(
                Number(dealData.agreedPrice || existing.agreedPrice),
                dealData.status || existing.status,
                JSON.stringify(messages),
                updatedAt,
                dealId
            );
        } else {
            const stmt = this.db.prepare(`
                INSERT INTO deals (
                    dealId, productId, productName, productPrice, agreedPrice,
                    customerId, customerName, customerEmail, customerPhone,
                    sellerId, sellerName, sellerEmail, sellerPhone,
                    status, messagesJson, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                dealId,
                dealData.productId || "",
                dealData.productName || "Product Deal",
                Number(dealData.productPrice || dealData.agreedPrice || 0),
                Number(dealData.agreedPrice || dealData.productPrice || 0),
                dealData.customerId || customer.id || "USR-GUEST",
                dealData.customerName || customer.name || "Customer",
                dealData.customerEmail || customer.email || "",
                dealData.customerPhone || customer.phone || "",
                dealData.sellerId || seller.id || "USR-SELLER",
                dealData.sellerName || seller.name || "Seller",
                dealData.sellerEmail || seller.email || "",
                dealData.sellerPhone || seller.phone || "",
                dealData.status || "initiated",
                JSON.stringify(messages),
                new Date().toISOString(),
                updatedAt
            );
        }

        this.syncToJsonFiles();
        return this.getDeals(dealData.customerEmail || customer.email).find(d => d.dealId === dealId);
    }

    /* =====================================================
       MESSAGES / CHAT
    ===================================================== */
    getMessages(user) {
        let sql = "SELECT * FROM messages";
        const params = [];
        if (user) {
            sql += " WHERE sender = ? OR receiver = ?";
            params.push(user, user);
        }
        sql += " ORDER BY timestamp ASC";
        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
    }

    createMessage(msgData) {
        const id = "MSG-" + Date.now();
        const timestamp = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO messages (id, dealId, sender, receiver, message, timestamp, read)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            msgData.dealId || "",
            msgData.sender || "user",
            msgData.receiver || "support",
            msgData.message || "",
            timestamp,
            0
        );

        this.syncToJsonFiles();
        return { id, ...msgData, timestamp, read: 0 };
    }

    /* =====================================================
       NOTIFICATIONS
    ===================================================== */
    getNotifications(userId) {
        let sql = "SELECT * FROM notifications";
        const params = [];
        if (userId) {
            sql += " WHERE userId = ? OR userId = 'all'";
            params.push(userId);
        }
        sql += " ORDER BY createdAt DESC";
        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
    }

    createNotification(notifData) {
        const id = "NTF-" + Date.now();
        const createdAt = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO notifications (id, userId, title, message, type, link, read, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            notifData.userId || "all",
            notifData.title,
            notifData.message,
            notifData.type || "info",
            notifData.link || "notifications.html",
            0,
            createdAt
        );

        return { id, ...notifData, read: 0, createdAt };
    }

    markNotificationRead(id) {
        const stmt = this.db.prepare("UPDATE notifications SET read = 1 WHERE id = ?");
        stmt.run(String(id));
        return true;
    }

    /* =====================================================
       SERVICES & SELLERS
    ===================================================== */
    getServices(category) {
        let sql = "SELECT * FROM services";
        const params = [];
        if (category && category !== "All") {
            sql += " WHERE LOWER(category) = LOWER(?)";
            params.push(category);
        }
        sql += " ORDER BY rating DESC";
        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
    }

    getServiceById(id) {
        const stmt = this.db.prepare("SELECT * FROM services WHERE id = ? LIMIT 1");
        return stmt.get(String(id)) || null;
    }

    createService(data) {
        const id = data.id || ("SRV-" + Date.now());
        const createdAt = new Date().toISOString();
        const stmt = this.db.prepare(`
            INSERT INTO services (
                id, name, providerName, category, price, rating, reviewsCount,
                location, phone, email, description, availability, image, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id,
            data.name,
            data.providerName || "Verified Provider",
            data.category || "General Services",
            Number(data.price || 0),
            Number(data.rating || 5.0),
            Number(data.reviewsCount || 0),
            data.location || "Agra, Uttar Pradesh",
            data.phone || "",
            data.email || "",
            data.description || "",
            data.availability || "Available",
            data.image || "",
            createdAt
        );
        return this.getServiceById(id);
    }

    getSellerProfile(sellerNameOrId) {
        const clean = String(sellerNameOrId).trim().toLowerCase();

        // Check users table
        const user = this.db.prepare(`
            SELECT * FROM users
            WHERE LOWER(name) = ? OR LOWER(businessName) = ? OR id = ?
            LIMIT 1
        `).get(clean, clean, sellerNameOrId);

        // Check services table
        const service = this.db.prepare(`
            SELECT * FROM services
            WHERE LOWER(providerName) = ? OR LOWER(name) = ?
            LIMIT 1
        `).get(clean, clean);

        return {
            sellerName: user?.businessName || user?.name || service?.providerName || sellerNameOrId,
            category: user?.serviceCategory || service?.category || "Professional Service",
            rating: user?.rating || service?.rating || 4.9,
            reviewsCount: service?.reviewsCount || 48,
            location: user?.location || service?.location || "Agra, Uttar Pradesh",
            phone: user?.phone || service?.phone || "9876543210",
            email: user?.email || service?.email || "seller@ahd.in",
            bio: user?.bio || service?.description || "Verified service professional on AHD Marketplace.",
            profilePhoto: user?.profilePhoto || service?.image || "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=400&q=80",
            availability: service?.availability || "Available Today",
            verified: true
        };
    }
}

module.exports = new DatabaseEngine();
