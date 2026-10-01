/* =========================================================
   AHD MARKETPLACE - MODERN ACCOUNT DASHBOARD CONTROLLER (js/account.js)
   Renders user profile, dynamic stats, deals tracker, and listings.
   Supports instant 1-click demo preview if not logged in.
   ========================================================= */

// Global Tab Switcher
function showDashboardTab(tabName) {
    const tabs = ["overview", "deals", "listings"];
    tabs.forEach(t => {
        const tabBtn = document.getElementById("tab" + t.charAt(0).toUpperCase() + t.slice(1));
        const section = document.getElementById("section" + t.charAt(0).toUpperCase() + t.slice(1));
        if (tabBtn) tabBtn.classList.remove("active");
        if (section) section.style.display = "none";
    });

    const activeBtn = document.getElementById("tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    const activeSec = document.getElementById("section" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");
    if (activeSec) activeSec.style.display = "block";
}

// 1-Click Demo Login to Preview Dashboard
async function previewDemoAccount(role = "customer") {
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.login === "function") {
            const email = (role === "seller") ? "seller@ahd.in" : "customer@ahd.in";
            await AHDApi.login(email, "123456", role);
        } else if (typeof AHDAuth !== "undefined") {
            const email = (role === "seller") ? "seller@ahd.in" : "customer@ahd.in";
            await AHDAuth.login(email, "123456", role);
        }
        window.location.reload();
    } catch (err) {
        console.error("Demo preview error:", err);
        window.location.href = "login.html";
    }
}

// Display Guest Welcome Screen
function showGuestWelcome() {
    const mainContainer = document.getElementById("accountMainContainer");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <section class="guest-card">
            <div class="guest-icon">👤</div>
            <h2>Welcome to AHD Marketplace</h2>
            <p>
                Sign in to manage your active deals, view reverse match requests,
                contact local sellers, or manage your product inventory.
            </p>
            <div class="guest-actions">
                <button type="button" class="primary-btn" onclick="window.location.href='customer-login.html'">
                    👤 Customer Login
                </button>
                <button type="button" class="secondary-btn" onclick="window.location.href='seller-login.html'">
                    🏪 Seller Login
                </button>
            </div>
            <div>
                <button type="button" class="guest-demo-btn" onclick="previewDemoAccount('customer')">
                    ⚡ Instant 1-Click Demo Preview
                </button>
            </div>
        </section>
    `;
}

// Helper to set element text
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Main Loader
async function initAccount() {
    try {
        let user = null;
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            user = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            user = await AHDAuth.getUser();
        }

        if (!user) {
            showGuestWelcome();
            return;
        }

        renderUserData(user);
        loadUserDeals(user);
        loadUserListings(user);
        loadNotifications(user);

    } catch (err) {
        console.error("Error initializing account:", err);
        showGuestWelcome();
    }
}

async function loadNotifications(user) {
    const badge = document.getElementById("notificationBadge");
    if (!badge || !user) return;
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getNotifications === "function") {
            const notifs = await AHDApi.getNotifications(user.email || user.id);
            const unread = notifs.filter(n => !n.read).length;
            badge.textContent = unread;
            badge.style.display = unread > 0 ? "inline-block" : "none";
        }
    } catch (_) {}
}

// Render User Profile & Stats
function renderUserData(user) {
    const isSeller = (user.role === "seller");
    const displayName = (isSeller && user.businessName) ? user.businessName : (user.name || "AHD User");

    setText("profileName", displayName);
    setText("infoName", user.name || displayName);
    setText("infoMobile", user.phone || "Not provided");
    setText("infoEmail", user.email || "Not provided");
    setText("infoAccountType", isSeller ? "Verified Seller" : "Customer");
    setText("profileType", isSeller ? "🏪 Seller Account" : "👤 Customer Account");

    const loc = user.location || "Agra, Uttar Pradesh";
    setText("infoLocation", loc);
    setText("userLocation", loc);

    // Member Year
    let year = "2026";
    if (user.createdAt) {
        const d = new Date(user.createdAt);
        if (!isNaN(d.getTime())) year = d.getFullYear();
    }
    setText("memberSince", year);

    // Role-specific sections and styling
    const profileCard = document.getElementById("profileCardSection");
    const custSec = document.getElementById("customerSection");
    const sellSec = document.getElementById("sellerSection");

    if (isSeller) {
        if (profileCard) profileCard.classList.add("seller-card");
        if (custSec) custSec.style.display = "none";
        if (sellSec) sellSec.style.display = "block";
    } else {
        if (profileCard) profileCard.classList.remove("seller-card");
        if (custSec) custSec.style.display = "block";
        if (sellSec) sellSec.style.display = "none";
    }

    // Avatar Initials or Photo
    const photoEl = document.getElementById("profilePhoto");
    if (photoEl) {
        if (user.profilePhoto) {
            photoEl.style.backgroundImage = `url("${user.profilePhoto}")`;
            photoEl.style.backgroundSize = "cover";
            photoEl.style.backgroundPosition = "center";
            photoEl.textContent = "";
        } else {
            const initials = (user.name || "A")
                .split(" ")
                .map(n => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
            photoEl.textContent = initials || (isSeller ? "🏪" : "👤");
        }
    }
}

// Load Deals Tracker
async function loadUserDeals(user) {
    const dealsContainer = document.getElementById("dealsListContainer");
    if (!dealsContainer) return;

    try {
        let deals = [];
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getDeals === "function") {
            deals = await AHDApi.getDeals(user.email);
        }

        setText("purchaseCount", deals.length);

        if (!deals || deals.length === 0) {
            dealsContainer.innerHTML = `
                <div style="text-align: center; padding: 35px 20px; background: #f8fafc; border-radius: 14px; border: 1px dashed var(--border);">
                    <div style="font-size: 32px; margin-bottom: 8px;">🤝</div>
                    <strong style="display: block; font-size: 15px; color: var(--text-primary); margin-bottom: 4px;">No Deals Yet</strong>
                    <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 16px;">
                        When you request a product or accept an offer, live deals appear here.
                    </p>
                    <a href="matches.html" class="primary-btn" style="display: inline-flex; width: auto; font-size: 13.5px; padding: 9px 18px;">
                        Find Matching Deals
                    </a>
                </div>
            `;
            return;
        }

        dealsContainer.innerHTML = deals.map(d => {
            const status = (d.status || "pending").toLowerCase();
            const statusClass = (status === "completed") ? "deal-status-completed" :
                                (status === "accepted") ? "deal-status-accepted" : "deal-status-pending";
            return `
                <div class="deal-item-card">
                    <div class="deal-info">
                        <h3>${d.productName || d.product?.name || "Deal Item"}</h3>
                        <p>ID: ${d.dealId} • Counterparty: ${d.seller?.name || d.customer?.name || "Verified User"}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <span class="deal-price">₹${Number(d.price || d.finalPrice || 0).toLocaleString("en-IN")}</span>
                        <span class="deal-status-pill ${statusClass}">${d.status || "Pending"}</span>
                        <a href="deal.html?id=${d.dealId}" class="outline-btn" style="padding: 6px 12px; font-size: 12.5px;">
                            View Deal
                        </a>
                    </div>
                </div>
            `;
        }).join("");

    } catch (err) {
        console.warn("Deals load notice:", err);
        dealsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Unable to load deals.</p>`;
    }
}

// Load User Listings / Requests
async function loadUserListings(user) {
    const container = document.getElementById("userItemsContainer");
    if (!container) return;

    try {
        let products = [];
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getProducts === "function") {
            const allProducts = await AHDApi.getProducts();
            products = allProducts.filter(p => p.seller?.email === user.email);
        }

        setText("sellingCount", products.length);
        setText("savedCount", "2");
        setText("requestCount", user.role === "customer" ? "1" : "0");

        if (products.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 35px 20px; background: #f8fafc; border-radius: 14px; border: 1px dashed var(--border);">
                    <div style="font-size: 32px; margin-bottom: 8px;">📦</div>
                    <strong style="display: block; font-size: 15px; color: var(--text-primary); margin-bottom: 4px;">No Active Listings</strong>
                    <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 16px;">
                        ${user.role === "seller" ? "Post your first item to start receiving buyer inquiries." : "Post a custom request for items you want to buy."}
                    </p>
                    <a href="${user.role === "seller" ? "sell.html" : "request.html"}" class="primary-btn" style="display: inline-flex; width: auto; font-size: 13.5px; padding: 9px 18px;">
                        ${user.role === "seller" ? "+ Add Product" : "+ Post Request"}
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="product-grid" style="margin-top: 10px;">
                ${products.map(p => `
                    <div class="product-card">
                        <div class="product-image">
                            ${p.images && p.images[0] ? `<img src="${p.images[0]}" alt="${p.name}">` : "📦"}
                        </div>
                        <div class="product-info">
                            <div class="product-title">${p.name}</div>
                            <div class="product-price">₹${Number(p.price).toLocaleString("en-IN")}</div>
                            <div class="product-location">📍 ${p.location || "Agra"}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (err) {
        console.warn("Listings load notice:", err);
    }
}

// Actions & Navigation handlers
function editProfile() {
    window.location.href = "edit-profile.html";
}

function openSettings() {
    window.location.href = "settings.html";
}

function changeProfilePhoto() {
    window.location.href = "edit-profile.html";
}

function openCustomerRequests() {
    window.location.href = "request.html";
}

function openCustomerDeals() {
    showDashboardTab("deals");
}

function openCustomerSaved() {
    showDashboardTab("overview");
}

function openCustomerMessages() {
    window.location.href = "messages.html";
}

function openSellerProducts() {
    showDashboardTab("listings");
}

function openSellerDeals() {
    showDashboardTab("deals");
}

function openSellerAddProduct() {
    window.location.href = "sell.html";
}

function openSellerMessages() {
    window.location.href = "messages.html";
}

async function logoutAccount() {
    if (confirm("Are you sure you want to log out of your AHD account?")) {
        try {
            if (typeof AHDApi !== "undefined" && typeof AHDApi.logout === "function") {
                await AHDApi.logout();
            } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.logout === "function") {
                await AHDAuth.logout();
            }
        } catch (_) {}
        window.location.replace("login.html");
    }
}

document.addEventListener("DOMContentLoaded", initAccount);
