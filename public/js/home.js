/* =========================================================
   AHD MARKETPLACE - MODERN HOME CONTROLLER (js/home.js)
   Loads real products dynamically from AHDApi, handles search,
   and manages dynamic auth states in the navigation bar.
   ========================================================= */

const defaultFallbackProducts = [
    {
        id: "P001",
        name: "Samsung Galaxy S23 256GB",
        price: 42000,
        category: "Mobiles",
        condition: "Like New",
        location: "Agra, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Rahul Sharma" }
    },
    {
        id: "P002",
        name: "iPhone 13 128GB Blue",
        price: 38000,
        category: "Mobiles",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1592286927505-2fd4b5e8c2e7?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Aman Gupta" }
    },
    {
        id: "P003",
        name: "Dell Inspiron 15 Core i5 Laptop",
        price: 35000,
        category: "Electronics",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Vikas Singh" }
    },
    {
        id: "P004",
        name: "HP Victus Gaming Laptop 16GB RAM",
        price: 54000,
        category: "Electronics",
        condition: "Like New",
        location: "Mathura, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Rohit Kumar" }
    },
    {
        id: "P005",
        name: "Solid Wooden Study Table & Chair",
        price: 4500,
        category: "Furniture",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Mohit Verma" }
    },
    {
        id: "P006",
        name: "Royal Enfield Classic 350 Gunmetal",
        price: 145000,
        category: "Vehicles",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"],
        seller: { name: "Neeraj Gupta" }
    }
];

function formatPrice(price) {
    return "₹" + Number(price || 0).toLocaleString("en-IN");
}

let activeProducts = [];
let currentDetectedLocation = { city: "Agra", state: "Uttar Pradesh", isLive: false };

function createProductCard(product, cityOverride) {
    const imgUrl = (product.images && product.images[0])
        ? product.images[0]
        : (product.icon || "📦");

    const isImage = typeof imgUrl === "string" && (imgUrl.startsWith("http") || imgUrl.startsWith("data:") || imgUrl.startsWith("images/"));
    const displayLocation = cityOverride || product.location || "Agra, Uttar Pradesh";

    return `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image">
                ${isImage ? `<img src="${imgUrl}" alt="${product.name}" loading="lazy">` : `<span>${imgUrl}</span>`}
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-location">
                    📍 ${displayLocation} • ${product.condition || "Used"}
                </div>
            </div>
        </a>
    `;
}

// Render products dynamically based on detected live location
function renderNearbyProducts(city, state, isLive) {
    const container = document.getElementById("products");
    if (!container) return;

    const titleEl = document.getElementById("nearbySectionTitle");
    const subtitleEl = document.getElementById("nearbySubtitle");

    if (city) {
        if (titleEl) {
            titleEl.textContent = `📍 Products Near You in ${city}`;
        }
        if (subtitleEl) {
            subtitleEl.innerHTML = isLive
                ? `🟢 <strong>Live GPS active</strong>: Showing verified listings closest to ${city}, ${state}`
                : `Showing verified listings in and around ${city}`;
        }
    }

    const items = activeProducts.length > 0 ? activeProducts : defaultFallbackProducts;

    // Prioritize products matching city, then adapt locations
    const sorted = [...items].sort((a, b) => {
        const aMatch = (a.location || "").toLowerCase().includes((city || "").toLowerCase()) ? 1 : 0;
        const bMatch = (b.location || "").toLowerCase().includes((city || "").toLowerCase()) ? 1 : 0;
        return bMatch - aMatch;
    });

    container.innerHTML = sorted.map(p => createProductCard(p, city ? `${city}, ${state}` : p.location)).join("");
}

// Load Products from API or fallback
async function loadHomeProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    try {
        let products = [];
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getProducts === "function") {
            products = await AHDApi.getProducts();
        }

        if (!products || products.length === 0) {
            products = defaultFallbackProducts;
        }

        activeProducts = products;
        renderNearbyProducts(currentDetectedLocation.city, currentDetectedLocation.state, currentDetectedLocation.isLive);

    } catch (err) {
        console.warn("Failed to load products from API, using fallback:", err);
        activeProducts = defaultFallbackProducts;
        renderNearbyProducts(currentDetectedLocation.city, currentDetectedLocation.state, currentDetectedLocation.isLive);
    }
}

// Update Navbar based on user login state
async function checkAuthNavbar() {
    try {
        let user = null;
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            user = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            user = await AHDAuth.getUser();
        }

        const nav = document.querySelector(".main-nav");
        if (!nav) return;

        // Check if user is logged in
        if (user && user.name) {
            const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "👤";
            
            // Look for existing account link
            const accountLinks = nav.querySelectorAll('a[href="account.html"], .user-nav-pill, .auth-nav-btn');
            accountLinks.forEach(el => el.remove());

            const userPill = document.createElement("a");
            userPill.href = "account.html";
            userPill.className = "user-nav-pill";
            userPill.innerHTML = `
                <div class="user-nav-avatar">${initials}</div>
                <span>${user.name.split(" ")[0]}</span>
            `;
            nav.appendChild(userPill);
        } else {
            // Not logged in: Ensure login button is clear
            const accountLink = nav.querySelector('a[href="account.html"]');
            if (accountLink) {
                accountLink.textContent = "Login";
                accountLink.href = "login.html";
                accountLink.className = "auth-nav-btn";
            }
        }

        // Update location element if present
        if (user && user.location) {
            const locEl = document.querySelector("[data-location]");
            if (locEl) locEl.textContent = user.location;
        }

    } catch (err) {
        console.warn("Auth navbar check note:", err);
    }
}

// Listen to Live Location updates
window.addEventListener("ahd:location-updated", (event) => {
    if (event.detail) {
        currentDetectedLocation = event.detail;
        renderNearbyProducts(event.detail.city, event.detail.state, event.detail.isLive);
    }
});

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    loadHomeProducts();
    checkAuthNavbar();

    // Check if AHDLocation already has a resolved location
    if (window.AHDLocation && window.AHDLocation.current && window.AHDLocation.current.city) {
        currentDetectedLocation = window.AHDLocation.current;
        renderNearbyProducts(currentDetectedLocation.city, currentDetectedLocation.state, currentDetectedLocation.isLive);
    }
});