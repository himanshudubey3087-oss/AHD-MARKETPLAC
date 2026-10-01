const express = require("express");
const path = require("path");
const dataStore = require("./dataStore");

// Crash prevention: prevent uncaught errors from stopping the process
process.on("uncaughtException", (err) => {
    console.error("⚠️ Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
    console.error("⚠️ Unhandled Rejection:", reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE (CORS & REQUEST LOGGER & BODY PARSER)
========================================================= */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// Real-time request logging in VS Code terminal
app.use((req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve frontend static files
const frontendPath = path.join(__dirname, "..");
if (!process.env.VERCEL) {
    app.use(express.static(frontendPath));
}

/* =========================================================
   HEALTH CHECK
========================================================= */
app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        name: "AHD Marketplace API",
        version: "2.0.0",
        timestamp: new Date().toISOString()
    });
});

/* =========================================================
   AUTH & OTP ROUTES
========================================================= */
app.post("/api/auth/send-otp", (req, res) => {
    try {
        const { target, phone, email, type } = req.body;
        const actualTarget = target || phone || email;
        const actualType = type || (phone ? "phone" : (email ? "email" : (actualTarget && actualTarget.includes("@") ? "email" : "phone")));

        if (!actualTarget) {
            return res.status(400).json({ error: "Please enter a phone number or email to receive OTP." });
        }

        const otpRecord = dataStore.generateOtp(actualTarget, actualType);
        res.json({
            success: true,
            message: `OTP sent successfully to ${otpRecord.target}.`,
            target: otpRecord.target,
            type: otpRecord.type,
            otp: otpRecord.otp,
            expiresAt: otpRecord.expiresAt
        });
    } catch (error) {
        console.error("Send OTP Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post("/api/auth/verify-otp", (req, res) => {
    try {
        const { target, phone, email, otp } = req.body;
        const actualTarget = target || phone || email;
        if (!actualTarget || !otp) {
            return res.status(400).json({ error: "Both target and OTP are required." });
        }

        const result = dataStore.verifyOtp(actualTarget, otp);
        if (!result.valid) {
            return res.status(400).json({ error: result.error });
        }
        res.json({ success: true, message: result.message });
    } catch (error) {
        console.error("Verify OTP Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post("/api/auth/register", (req, res) => {
    try {
        const { name, fullName, email, phone, password, role, location, businessName, serviceCategory, bio, profilePhoto, phoneOtp, emailOtp } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ error: "Email or phone number is required." });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters." });
        }

        // Verify Phone OTP if provided
        if (phone && phoneOtp) {
            const checkPhone = dataStore.verifyOtp(phone, phoneOtp);
            if (!checkPhone.valid) {
                return res.status(400).json({ error: "Phone OTP verification failed: " + checkPhone.error });
            }
        }

        // Verify Email OTP if provided
        if (email && emailOtp) {
            const checkEmail = dataStore.verifyOtp(email, emailOtp);
            if (!checkEmail.valid) {
                return res.status(400).json({ error: "Email OTP verification failed: " + checkEmail.error });
            }
        }

        const user = dataStore.createUser({
            name: name || fullName,
            email,
            phone,
            password,
            role: role || "customer",
            location,
            businessName: businessName || (role === "seller" ? (name || fullName) : ""),
            serviceCategory,
            bio,
            profilePhoto
        });

        const authResult = dataStore.authenticateUser(email || phone, password, role);

        res.status(201).json({
            message: "Account created successfully and saved to database.",
            user: authResult.user,
            token: authResult.token
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post("/api/auth/login", (req, res) => {
    try {
        const { identifier, password, role } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: "Please enter your email/phone and password." });
        }

        const result = dataStore.authenticateUser(identifier, password, role);
        res.json({
            message: "Login successful.",
            user: result.user,
            token: result.token
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(401).json({ error: error.message });
    }
});

app.post("/api/auth/login-otp", (req, res) => {
    try {
        const { phone, identifier, otp, role } = req.body;
        const target = phone || identifier;

        if (!target || !otp) {
            return res.status(400).json({ error: "Please enter your mobile number and the OTP received." });
        }

        // Verify OTP from SQLite otps table
        const check = dataStore.verifyOtp(target, otp);
        if (!check.valid) {
            return res.status(400).json({ error: check.error || "Invalid OTP. Please check the SMS sent to your phone." });
        }

        // Find or create user by phone in database
        let user = dataStore.findUserByEmailOrPhone(target);
        if (!user) {
            const cleanPhone = String(target).replace(/\D/g, "").slice(-10);
            user = dataStore.createUser({
                name: `User ${cleanPhone.slice(-4)}`,
                phone: cleanPhone,
                role: role || "customer",
                location: "Agra, Uttar Pradesh"
            });
        }

        if (role && user.role && user.role !== role && user.role !== "both") {
            return res.status(400).json({ error: `This account is registered as '${user.role}'. Please select the correct tab.` });
        }

        const token = dataStore.createSession(user.id);

        res.json({
            message: "Login successful with Phone OTP.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                location: user.location,
                businessName: user.businessName,
                profilePhoto: user.profilePhoto
            },
            token
        });
    } catch (error) {
        console.error("Login OTP Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/auth/me", (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : (req.query.token || req.headers["x-access-token"]);
        if (!token) {
            return res.status(401).json({ error: "No session token provided." });
        }

        const user = dataStore.getUserByToken(token);
        if (!user) {
            return res.status(401).json({ error: "Session invalid or expired. Please login again." });
        }

        res.json({ user });
    } catch (error) {
        console.error("Auth me error:", error.message);
        res.status(500).json({ error: "Failed to verify session." });
    }
});

app.post("/api/auth/logout", (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : (req.body.token || req.query.token);
        if (token) {
            dataStore.deleteSession(token);
        }
        res.json({ message: "Logged out successfully." });
    } catch (error) {
        res.status(500).json({ error: "Logout failed." });
    }
});

app.post("/api/auth/update-password", (req, res) => {
    try {
        const { identifier, newPassword } = req.body;
        if (!identifier || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "Valid identifier and min 6-character new password required." });
        }

        dataStore.updatePassword(identifier, newPassword);
        res.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Update Password Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

const handleProfileUpdate = (req, res) => {
    try {
        const { email, phone, ...profileData } = req.body;
        const identifier = email || phone;
        if (!identifier) {
            return res.status(400).json({ error: "User identifier (email or phone) is required." });
        }

        const updatedUser = dataStore.updateUserProfile(identifier, profileData);
        res.json({
            message: "Profile updated successfully.",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(400).json({ error: error.message });
    }
};

app.post("/api/auth/profile", handleProfileUpdate);
app.put("/api/auth/profile", handleProfileUpdate);

app.get("/api/users/:identifier", (req, res) => {
    try {
        const user = dataStore.findUserByEmailOrPhone(req.params.identifier) || dataStore.findUserById(req.params.identifier);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const { passwordHash, passwordSalt, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user." });
    }
});

/* =========================================================
   PRODUCTS ROUTES
========================================================= */
app.get("/api/products", (req, res) => {
    try {
        const { search, category, location, minPrice, maxPrice, sellerEmail } = req.query;
        let products = dataStore.getProducts({ search, category, location, minPrice, maxPrice });
        if (sellerEmail) {
            products = products.filter(p => (p.sellerEmail || p.seller?.email || "").toLowerCase() === sellerEmail.toLowerCase());
        }
        res.json(products);
    } catch (error) {
        console.error("Get Products Error:", error.message);
        res.status(500).json({ error: "Failed to fetch products." });
    }
});

app.get("/api/products/:id", (req, res) => {
    try {
        const product = dataStore.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }
        res.json(product);
    } catch (error) {
        console.error("Get Product Error:", error.message);
        res.status(500).json({ error: "Failed to fetch product." });
    }
});

app.post("/api/products", (req, res) => {
    try {
        const { name, price, category } = req.body;
        if (!name || !price) {
            return res.status(400).json({ error: "Product name and price are required." });
        }

        const newProduct = dataStore.createProduct(req.body);
        res.status(201).json({
            message: "Product listed successfully.",
            product: newProduct
        });
    } catch (error) {
        console.error("Create Product Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.put("/api/products/:id", (req, res) => {
    try {
        const updated = dataStore.updateProduct(req.params.id, req.body);
        res.json({ message: "Product updated successfully.", product: updated });
    } catch (error) {
        console.error("Update Product Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.delete("/api/products/:id", (req, res) => {
    try {
        dataStore.deleteProduct(req.params.id);
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Delete Product Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

/* =========================================================
   SERVICES & SELLERS ROUTES
========================================================= */
app.get("/api/services", (req, res) => {
    try {
        const services = dataStore.getServices(req.query.category);
        res.json(services);
    } catch (error) {
        console.error("Get Services Error:", error.message);
        res.status(500).json({ error: "Failed to fetch services." });
    }
});

app.get("/api/services/:id", (req, res) => {
    try {
        const service = dataStore.getServiceById(req.params.id);
        if (!service) return res.status(404).json({ error: "Service not found." });
        res.json(service);
    } catch (error) {
        console.error("Get Service Error:", error.message);
        res.status(500).json({ error: "Failed to fetch service." });
    }
});

app.post("/api/services", (req, res) => {
    try {
        const service = dataStore.createService(req.body);
        res.status(201).json({ message: "Service added successfully.", service });
    } catch (error) {
        console.error("Add Service Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/sellers/:sellerName", (req, res) => {
    try {
        const seller = dataStore.getSellerProfile(req.params.sellerName);
        res.json(seller);
    } catch (error) {
        console.error("Get Seller Error:", error.message);
        res.status(500).json({ error: "Failed to fetch seller profile." });
    }
});

/* =========================================================
   REQUESTS & MATCHES ROUTES
========================================================= */
app.get("/api/requests", (req, res) => {
    try {
        const requests = dataStore.getRequests(req.query.userEmail || req.query.email);
        res.json(requests);
    } catch (error) {
        console.error("Get Requests Error:", error.message);
        res.status(500).json({ error: "Failed to fetch requests." });
    }
});

app.post("/api/requests", (req, res) => {
    try {
        const request = dataStore.createRequest(req.body);
        res.status(201).json({
            message: "Buyer request created successfully.",
            request
        });
    } catch (error) {
        console.error("Create Request Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/requests/:id", (req, res) => {
    try {
        const request = dataStore.getRequestById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: "Request not found." });
        }
        res.json(request);
    } catch (error) {
        console.error("Get Request Error:", error.message);
        res.status(500).json({ error: "Failed to fetch request." });
    }
});

app.get("/api/matches/:requestId", (req, res) => {
    try {
        const matches = dataStore.findMatchesForRequest(req.params.requestId);
        res.json({
            requestId: req.params.requestId,
            count: matches.length,
            matches
        });
    } catch (error) {
        console.error("Matches Error:", error.message);
        res.status(500).json({ error: "Failed to find matches." });
    }
});

/* =========================================================
   DEALS & MESSAGES ROUTES
========================================================= */
app.get("/api/deals", (req, res) => {
    try {
        const { user } = req.query;
        const deals = dataStore.getDeals(user);
        res.json(deals);
    } catch (error) {
        console.error("Get Deals Error:", error.message);
        res.status(500).json({ error: "Failed to fetch deals." });
    }
});

app.get("/api/deals/:id", (req, res) => {
    try {
        const deal = dataStore.getDealById(req.params.id);
        if (!deal) return res.status(404).json({ error: "Deal not found." });
        res.json(deal);
    } catch (error) {
        console.error("Get Deal Error:", error.message);
        res.status(500).json({ error: "Failed to fetch deal." });
    }
});

app.post("/api/deals", (req, res) => {
    try {
        const deal = dataStore.createOrUpdateDeal(req.body);
        res.json({ message: "Deal saved successfully.", deal });
    } catch (error) {
        console.error("Save Deal Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.put("/api/deals/:id", (req, res) => {
    try {
        const deal = dataStore.createOrUpdateDeal({ ...req.body, dealId: req.params.id });
        res.json({ message: "Deal updated successfully.", deal });
    } catch (error) {
        console.error("Update Deal Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/messages", (req, res) => {
    try {
        const { user } = req.query;
        const messages = dataStore.getMessages(user);
        res.json(messages);
    } catch (error) {
        console.error("Get Messages Error:", error.message);
        res.status(500).json({ error: "Failed to fetch messages." });
    }
});

app.post("/api/messages", (req, res) => {
    try {
        const msg = dataStore.createMessage(req.body);
        res.status(201).json({ message: "Message sent.", data: msg });
    } catch (error) {
        console.error("Send Message Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

/* =========================================================
   NOTIFICATIONS ROUTES
========================================================= */
app.get("/api/notifications", (req, res) => {
    try {
        const notifications = dataStore.getNotifications(req.query.userId || req.query.email);
        res.json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error.message);
        res.status(500).json({ error: "Failed to fetch notifications." });
    }
});

app.post("/api/notifications", (req, res) => {
    try {
        const notif = dataStore.createNotification(req.body);
        res.status(201).json({ message: "Notification sent.", notification: notif });
    } catch (error) {
        console.error("Send Notification Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post("/api/notifications/:id/read", (req, res) => {
    try {
        dataStore.markNotificationRead(req.params.id);
        res.json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Read Notification Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

/* =========================================================
   SETTINGS ALIASES & DIRECT ASSET SERVERS
========================================================= */
app.get(["/setting.html", "/settings.html"], (req, res) => {
    res.type("text/html").sendFile(path.join(frontendPath, "settings.html"));
});

app.get(["/setting.css", "/settings.css", "/css/setting.css", "/css/settings.css"], (req, res) => {
    res.type("text/css").sendFile(path.join(frontendPath, "css", "settings.css"));
});

app.get(["/setting.js", "/settings.js", "/js/setting.js", "/js/settings.js"], (req, res) => {
    res.type("application/javascript").sendFile(path.join(frontendPath, "js", "settings.js"));
});

/* =========================================================
   FALLBACK ROUTE & ERROR HANDLING
========================================================= */
app.use((req, res) => {
    if (process.env.VERCEL) {
        return res.status(404).json({ error: "API endpoint not found", path: req.originalUrl });
    }
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
            res.status(404).send("Page not found");
        }
    });
});

app.use((err, req, res, next) => {
    console.error("Express Global Error:", err.stack || err.message);
    if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" });
    }
});

if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`=========================================`);
        console.log(`🚀 AHD Marketplace Backend is Running!`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`📡 Alternative: http://127.0.0.1:${PORT}`);
        console.log(`📂 Serving Frontend & REST APIs`);
        console.log(`=========================================`);
    });
}

module.exports = app;