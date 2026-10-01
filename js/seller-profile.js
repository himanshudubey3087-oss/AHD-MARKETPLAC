/* =========================================================
   AHD MARKETPLACE - SELLER / SERVICE PROFILE CONTROLLER (js/seller-profile.js)
   Distinguishes between Owner View (editable) and Public Viewer
   (read-only with direct contact & booking options).
   ========================================================= */

// Known Verified Service Providers Seed Data
const VERIFIED_PROVIDERS = {
    "neha beauty studio": {
        name: "Neha Beauty Studio",
        category: "Beauty & Makeup Artist",
        rating: 4.8,
        reviews: 87,
        startingPrice: 999,
        location: "Agra, Uttar Pradesh",
        experience: "5+ Years",
        phone: "9876501234",
        email: "neha@ahd.in",
        photo: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80",
        about: "Professional bridal makeup, party makeup, hairstyling, and skincare in Agra. High-end products, home service, and salon appointments available.",
        available: true,
        services: [
            { name: "Bridal HD Makeup Package", price: 7999, description: "Full bridal makeup with hair styling, saree/lehenga draping, and eyelashes." },
            { name: "Party Glam Makeup & Hair", price: 1999, description: "Flawless evening party makeup with designer hair styling." },
            { name: "Facial & Skin Glow Treatment", price: 999, description: "Hydrating facial with herbal polish and tan removal." },
            { name: "Mehendi & Nail Art Package", price: 1499, description: "Organic bridal mehendi and customized gel nail art." }
        ]
    },
    "ramesh electrician": {
        name: "Ramesh Electrician",
        category: "Electrician & Wiring",
        rating: 4.9,
        reviews: 142,
        startingPrice: 299,
        location: "Agra, Uttar Pradesh",
        experience: "8+ Years",
        phone: "9812345678",
        email: "ramesh@ahd.in",
        photo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        about: "Certified technician specializing in home wiring, short-circuit repair, inverter setup, and appliance installation.",
        available: true,
        services: [
            { name: "General Electrical Inspection", price: 299, description: "Checking switches, wiring faults, and circuit breaker health." },
            { name: "Inverter & Battery Setup", price: 599, description: "Full installation and testing of home inverter and batteries." },
            { name: "Ceiling Fan / Light Fitting", price: 199, description: "Safe installation of ceiling fans, chandeliers, and decorative lights." }
        ]
    }
};

let currentProfileData = null;

// Public Action Handler for Visitors
function contactSellerAction(actionType) {
    if (!currentProfileData) return;

    if (actionType === "call") {
        const phone = currentProfileData.phone || "9876543210";
        if (confirm(`Call ${currentProfileData.name} at ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    } else if (actionType === "message") {
        window.location.href = `messages.html?user=${encodeURIComponent(currentProfileData.email || currentProfileData.name)}`;
    } else if (actionType === "deal" || actionType === "book") {
        window.location.href = `request.html?category=services&title=${encodeURIComponent("Booking for " + currentProfileData.name)}`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const sellerParam = (urlParams.get("seller") || urlParams.get("id") || "").trim();

    // DOM Elements
    const backBtn = document.getElementById("backBtn");
    const sellerPhoto = document.getElementById("sellerPhoto");
    const sellerName = document.getElementById("sellerName");
    const sellerCategory = document.getElementById("sellerCategory");
    const sellerRating = document.getElementById("sellerRating");
    const reviewCount = document.getElementById("reviewCount");
    const sellerLocation = document.getElementById("sellerLocation");
    const experience = document.getElementById("experience");
    const startingPrice = document.getElementById("startingPrice");
    const serviceCount = document.getElementById("serviceCount");
    const memberSince = document.getElementById("memberSince");
    const aboutText = document.getElementById("aboutText");
    const servicesList = document.getElementById("servicesList");
    const availabilityToggle = document.getElementById("availabilityToggle");
    const statusText = document.getElementById("statusText");
    const availabilityDot = document.getElementById("availabilityDot");

    // Owner vs Visitor Controls
    const ownerControlsTop = document.getElementById("ownerControlsTop");
    const ownerAvailabilityWrapper = document.getElementById("ownerAvailabilityWrapper");
    const publicStatusBadge = document.getElementById("publicStatusBadge");
    const publicActionButtons = document.getElementById("publicActionButtons");
    const ownerAddServiceWrapper = document.getElementById("ownerAddServiceWrapper");
    const ownerBottomActions = document.getElementById("ownerBottomActions");
    const pageHeading = document.getElementById("pageHeading");
    const pageSubheading = document.getElementById("pageSubheading");

    // Check logged in user
    let currentUser = null;
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            currentUser = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            currentUser = await AHDAuth.getUser();
        }
    } catch (_) {}

    // Check if the current viewer is the owner of this profile
    let isOwner = false;
    if (currentUser) {
        if (!sellerParam) {
            // No seller in query => viewing own seller profile
            isOwner = (currentUser.role === "seller");
        } else {
            const paramLower = sellerParam.toLowerCase();
            const currNameLower = (currentUser.name || "").toLowerCase();
            const currEmailLower = (currentUser.email || "").toLowerCase();
            isOwner = (currNameLower === paramLower || currEmailLower === paramLower);
        }
    }

    // Toggle Owner vs Visitor UI
    if (!isOwner) {
        // VISITOR MODE: Read-Only, no editing!
        if (ownerControlsTop) ownerControlsTop.style.display = "none";
        if (ownerAvailabilityWrapper) ownerAvailabilityWrapper.style.display = "none";
        if (publicStatusBadge) publicStatusBadge.style.display = "inline-flex";
        if (publicActionButtons) publicActionButtons.style.display = "flex";
        if (ownerAddServiceWrapper) ownerAddServiceWrapper.style.display = "none";
        if (ownerBottomActions) ownerBottomActions.style.display = "none";
        if (pageHeading) pageHeading.textContent = "Service Provider Details";
        if (pageSubheading) pageSubheading.textContent = "Verified Local Professional";
    } else {
        // OWNER MODE: Full editing permissions
        if (ownerControlsTop) ownerControlsTop.style.display = "block";
        if (ownerAvailabilityWrapper) ownerAvailabilityWrapper.style.display = "block";
        if (publicStatusBadge) publicStatusBadge.style.display = "none";
        if (publicActionButtons) publicActionButtons.style.display = "none";
        if (ownerAddServiceWrapper) ownerAddServiceWrapper.style.display = "inline";
        if (ownerBottomActions) ownerBottomActions.style.display = "flex";
        if (pageHeading) pageHeading.textContent = "My Service Profile";
        if (pageSubheading) pageSubheading.textContent = "Manage your listings and availability";
    }

    // Prepare Profile Data
    let profile = null;
    const lookupKey = sellerParam.toLowerCase();

    // Check backend API first for live seller details from SQLite
    if (sellerParam && window.AHDApi && typeof window.AHDApi.getSellerProfile === "function") {
        try {
            const apiRes = await window.AHDApi.getSellerProfile(sellerParam);
            if (apiRes && apiRes.sellerName) {
                profile = {
                    name: apiRes.sellerName,
                    category: apiRes.category,
                    location: apiRes.location,
                    experience: "5+ Years",
                    startingPrice: 499,
                    about: apiRes.bio || `${apiRes.sellerName} is a verified service provider on AHD Marketplace.`,
                    rating: apiRes.rating || 4.9,
                    reviews: apiRes.reviewsCount || 48,
                    photo: apiRes.profilePhoto || "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80",
                    available: apiRes.availability !== "Unavailable",
                    phone: apiRes.phone || "9876501234",
                    email: apiRes.email || "seller@ahd.in",
                    services: VERIFIED_PROVIDERS[lookupKey]?.services || [
                        { name: "Professional Service Package", price: 799, description: "Full on-site consultation and service." }
                    ]
                };
            }
        } catch (_) {}
    }

    if (!profile) {
        if (!isOwner && VERIFIED_PROVIDERS[lookupKey]) {
            profile = VERIFIED_PROVIDERS[lookupKey];
        } else if (!isOwner && sellerParam) {
            // Custom or dynamic seller name
            profile = {
                name: sellerParam,
                category: "Verified Service Specialist",
                location: "Agra, Uttar Pradesh",
                experience: "3+ Years",
                startingPrice: 499,
                about: `${sellerParam} is a verified local service provider on AHD Marketplace offering on-demand home and commercial services.`,
                rating: 4.8,
                reviews: 24,
                photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                available: true,
                phone: "9876543210",
                services: [
                    { name: "Standard Consultation & Inspection", price: 299, description: "In-person visit and initial inspection." },
                    { name: "Full Service Package", price: 999, description: "Complete professional service with guarantee." }
                ]
            };
        }
    } else if (currentUser) {
        // Owner's own profile
        profile = {
            name: currentUser.name || "Aman Gupta",
            category: currentUser.category || "Electronics & Services",
            location: currentUser.location || "Agra, Uttar Pradesh",
            experience: currentUser.experience || "4 Years",
            startingPrice: currentUser.startingPrice || 499,
            about: currentUser.about || "Verified local seller on AHD Marketplace.",
            rating: currentUser.rating || 4.9,
            reviews: currentUser.reviews || 12,
            photo: currentUser.profilePhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            available: currentUser.available !== false,
            phone: currentUser.phone || "9123456789",
            services: currentUser.services || [
                { name: "Product Delivery & Demo", price: 199, description: "Express same-day delivery with on-site product demo." }
            ]
        };
    } else {
        // Guest with no seller param => fallback to Neha Beauty Studio preview
        profile = VERIFIED_PROVIDERS["neha beauty studio"];
    }

    currentProfileData = profile;

    // Render Data to Page
    if (sellerName) sellerName.textContent = profile.name;
    if (sellerCategory) sellerCategory.textContent = profile.category;
    if (sellerLocation) sellerLocation.textContent = profile.location;
    if (experience) experience.textContent = profile.experience;
    if (startingPrice) startingPrice.textContent = "₹" + Number(profile.startingPrice || 0).toLocaleString("en-IN");
    if (sellerRating) sellerRating.textContent = Number(profile.rating || 5).toFixed(1);
    if (reviewCount) reviewCount.textContent = `(${profile.reviews || 0} reviews)`;
    if (aboutText) aboutText.textContent = profile.about;
    if (sellerPhoto && profile.photo) sellerPhoto.src = profile.photo;

    const sList = profile.services || [];
    if (serviceCount) serviceCount.textContent = `${sList.length} ${sList.length === 1 ? 'Service' : 'Services'}`;

    // Availability update
    const isAvail = profile.available !== false;
    if (availabilityToggle) availabilityToggle.checked = isAvail;
    if (statusText) statusText.textContent = isAvail ? "Available for work" : "Currently Unavailable";
    if (availabilityDot) availabilityDot.style.background = isAvail ? "#10b981" : "#ef4444";
    if (publicStatusBadge) {
        publicStatusBadge.textContent = isAvail ? "● Available for Bookings" : "● Currently Busy";
        publicStatusBadge.style.color = isAvail ? "#059669" : "#dc2626";
        publicStatusBadge.style.background = isAvail ? "#ecfdf5" : "#fef2f2";
    }

    // Render Services List
    renderServicesList(sList, isOwner);

    // Event Listeners for Owner
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "services.html";
        });
    }

    if (availabilityToggle) {
        availabilityToggle.addEventListener("change", () => {
            const avail = availabilityToggle.checked;
            if (statusText) statusText.textContent = avail ? "Available for work" : "Currently Unavailable";
            if (availabilityDot) availabilityDot.style.background = avail ? "#10b981" : "#ef4444";
        });
    }

    // Modal controls for owner
    const addServiceBtn = document.getElementById("addServiceBtn");
    const serviceModal = document.getElementById("serviceModal");
    const closeModal = document.getElementById("closeModal");
    const saveServiceBtn = document.getElementById("saveServiceBtn");

    if (addServiceBtn && serviceModal) {
        addServiceBtn.addEventListener("click", () => { serviceModal.style.display = "flex"; });
    }
    if (closeModal && serviceModal) {
        closeModal.addEventListener("click", () => { serviceModal.style.display = "none"; });
    }
    if (saveServiceBtn && serviceModal) {
        saveServiceBtn.addEventListener("click", () => {
            const name = document.getElementById("serviceNameInput")?.value.trim();
            const price = Number(document.getElementById("servicePriceInput")?.value || 0);
            const desc = document.getElementById("serviceDescriptionInput")?.value.trim();
            if (!name) return alert("Please enter a service name.");

            if (!profile.services) profile.services = [];
            profile.services.push({ name, price, description: desc });
            renderServicesList(profile.services, true);
            serviceModal.style.display = "none";
        });
    }
});

function renderServicesList(services, isOwner) {
    const container = document.getElementById("servicesList");
    if (!container) return;

    if (!services || services.length === 0) {
        container.innerHTML = `
            <div class="empty-service" style="padding: 24px; text-align: center; color: #64748b;">
                <p>No individual services listed yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = services.map(s => `
        <div class="service-item" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f1f5f9;">
            <div>
                <strong style="font-size: 15px; color: #0f172a; display: block; margin-bottom: 4px;">${s.name}</strong>
                <p style="font-size: 13px; color: #64748b; margin: 0;">${s.description || "High quality service guaranteed."}</p>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 17px; font-weight: 800; color: #4f46e5;">₹${Number(s.price || 0).toLocaleString("en-IN")}</span>
                ${!isOwner ? `
                    <button type="button" class="primary-btn" onclick="contactSellerAction('book')" style="padding: 6px 14px; font-size: 12.5px; height: auto;">
                        Book
                    </button>
                ` : ''}
            </div>
        </div>
    `).join("");
}