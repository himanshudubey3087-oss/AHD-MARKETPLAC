/* =========================================
   AHD MATCHES MODULE
========================================= */


/* =========================================
   GLOBAL DATA
========================================= */

let currentRequest = null;
let matchedProducts = [];

const MATCH_DATA = [

    {
        id: "P001",
        name: "Samsung Galaxy S23",
        category: "Mobile",
        condition: "Like New",
        price: 42000,
        location: "Agra",
        distance: 3,
        brand: "Samsung",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
        seller: "Rahul Sharma",
        rating: 4.7
    },

    {
        id: "P002",
        name: "iPhone 13 128GB",
        category: "Mobile",
        condition: "Good",
        price: 38000,
        location: "Agra",
        distance: 5,
        brand: "Apple",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1592286927505-2fd4b5e8c2e7?auto=format&fit=crop&w=800&q=80",
        seller: "Aman Gupta",
        rating: 4.6
    },

    {
        id: "P003",
        name: "Dell Inspiron Laptop",
        category: "Laptop",
        condition: "Good",
        price: 35000,
        location: "Agra",
        distance: 8,
        brand: "Dell",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=800&q=80",
        seller: "Vikas Singh",
        rating: 4.5
    },

    {
        id: "P004",
        name: "HP Gaming Laptop",
        category: "Laptop",
        condition: "Like New",
        price: 55000,
        location: "Mathura",
        distance: 55,
        brand: "HP",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        seller: "Rohit Kumar",
        rating: 4.8
    },

    {
        id: "P005",
        name: "Wooden Study Table",
        category: "Furniture",
        condition: "Good",
        price: 4500,
        location: "Agra",
        distance: 6,
        brand: "Local",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?auto=format&fit=crop&w=800&q=80",
        seller: "Mohit Verma",
        rating: 4.4
    },

    {
        id: "P006",
        name: "Office Chair",
        category: "Furniture",
        condition: "Good",
        price: 2800,
        location: "Agra",
        distance: 4,
        brand: "Local",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
        seller: "Amit Yadav",
        rating: 4.3
    }

];


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadRequest();

    document
        .getElementById("matchSort")
        .addEventListener("change", function () {

            sortMatches(this.value);

            renderMatches();

        });

});


/* =========================================
   GET REQUEST
========================================= */

async function loadRequest() {

    const params = new URLSearchParams(window.location.search);

    const requestId = params.get("requestId");

    if (requestId && window.AHDApi && typeof window.AHDApi.getRequestById === "function") {
        try {
            const savedReq = await window.AHDApi.getRequestById(requestId);
            if (savedReq) {
                currentRequest = savedReq;
            }
        } catch (e) {
            console.log("Note loading request from API:", e.message);
        }
    }

    if (!currentRequest) {

        if (window.AHDCurrentRequest) {

            currentRequest = window.AHDCurrentRequest;

        } else {

            currentRequest = createFallbackRequest();

        }

    }

    if (window.AHDApi && typeof window.AHDApi.getProducts === "function") {
        try {
            const dbProducts = await window.AHDApi.getProducts();
            if (dbProducts && dbProducts.length > 0) {
                dbProducts.forEach(p => {
                    if (!MATCH_DATA.some(m => String(m.id) === String(p.id))) {
                        MATCH_DATA.push(p);
                    }
                });
            }
        } catch (e) {}
    }

    displayRequest();

    calculateMatches();

}


/* =========================================
   FALLBACK REQUEST
========================================= */

function createFallbackRequest() {

    return {

        requestId: "REQ-" + Date.now(),

        status: "Pending",

        requirement: {

            product: "Mobile",

            category: "Mobile",

            preferredCondition: "Any",

            maximumBudget: 50000,

            quantity: 1,

            details: "",

            preferredBrand: ""

        },

        purchaseRequest: {

            offerPrice: 0,

            quantity: 1,

            buyerLocation: "Agra",

            delivery: "Seller & Buyer Decide",

            contact: ""

        }

    };

}


/* =========================================
   DISPLAY REQUEST
========================================= */

function displayRequest() {

    const requirement =
        currentRequest.requirement || {};


    document.getElementById("needProduct").textContent =
        requirement.product || "-";


    document.getElementById("needCategory").textContent =
        requirement.category || "Any Category";


    document.getElementById("needBudget").textContent =
        requirement.maximumBudget
            ? "₹" + Number(requirement.maximumBudget).toLocaleString("en-IN")
            : "No Limit";


    document.getElementById("needCondition").textContent =
        requirement.preferredCondition || "Any";


    document.getElementById("needQuantity").textContent =
        requirement.quantity || 1;


    document.getElementById("needBrand").textContent =
        requirement.preferredBrand || "Any Brand";


    document.getElementById("needDetails").textContent =
        requirement.details ||
        "No additional details provided.";


    const status =
        document.getElementById("requestStatus");


    status.textContent =
        currentRequest.status || "Pending";

}


/* =========================================
   CALCULATE MATCHES
========================================= */

function calculateMatches() {

    const requirement =
        currentRequest.requirement || {};


    matchedProducts =
        MATCH_DATA.map(product => {

            const result =
                calculateMatchScore(
                    product,
                    requirement
                );

            return {

                ...product,

                matchScore: result.score,

                reasons: result.reasons

            };

        });


    matchedProducts =
        matchedProducts
            .filter(product => product.matchScore >= 35);


    sortMatches("match");

    renderMatches();

}


/* =========================================
   MATCHING ALGORITHM
========================================= */

function calculateMatchScore(
    product,
    requirement
) {

    let score = 0;

    const reasons = [];


    /* CATEGORY - 25 */

    if (
        requirement.category &&
        product.category.toLowerCase() ===
        requirement.category.toLowerCase()
    ) {

        score += 25;

        reasons.push("Category matches");

    }


    /* PRODUCT / NEED - 20 */

    const need =
        String(requirement.product || "")
            .toLowerCase();

    const productName =
        String(product.name || "")
            .toLowerCase();


    if (
        productName.includes(need) ||
        need.includes(product.category.toLowerCase()) ||
        need.includes(productName)
    ) {

        score += 20;

        reasons.push("Product matches your need");

    } else if (
        product.category.toLowerCase() ===
        need
    ) {

        score += 15;

        reasons.push("Product type matches");

    }


    /* BUDGET - 20 */

    const budget =
        Number(requirement.maximumBudget);


    if (budget > 0) {

        if (product.price <= budget) {

            score += 20;

            reasons.push("Within your budget");

        } else if (
            product.price <= budget * 1.10
        ) {

            score += 10;

            reasons.push("Slightly above budget");

        }

    } else {

        score += 20;

        reasons.push("No budget restriction");

    }


    /* CONDITION - 10 */

    const condition =
        String(
            requirement.preferredCondition || "Any"
        ).toLowerCase();


    if (
        condition === "any" ||
        condition === "" ||
        condition === product.condition.toLowerCase()
    ) {

        score += 10;

        reasons.push("Condition matches");

    }


    /* BRAND - 10 */

    const brand =
        String(
            requirement.preferredBrand || ""
        ).toLowerCase();


    if (
        !brand ||
        brand === "any" ||
        product.brand.toLowerCase() === brand
    ) {

        score += 10;

        reasons.push("Brand preference matches");

    }


    /* LOCATION - 10 */

    const buyerLocation =
        String(
            currentRequest
                ?.purchaseRequest
                ?.buyerLocation || "Agra"
        ).toLowerCase();


    if (
        product.location.toLowerCase() ===
        buyerLocation
    ) {

        score += 10;

        reasons.push("Nearby seller");

    } else if (product.distance <= 25) {

        score += 7;

        reasons.push("Seller is nearby");

    } else if (product.distance <= 75) {

        score += 4;

        reasons.push("Seller is within extended area");

    }


    /* QUANTITY - 5 */

    const requiredQuantity =
        Number(requirement.quantity || 1);


    if (
        product.quantity >= requiredQuantity
    ) {

        score += 5;

        reasons.push("Required quantity available");

    }


    return {

        score: Math.min(score, 100),

        reasons

    };

}


/* =========================================
   SORT
========================================= */

function sortMatches(type) {

    if (type === "match") {

        matchedProducts.sort(
            (a, b) =>
                b.matchScore - a.matchScore
        );

    }


    if (type === "priceLow") {

        matchedProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (type === "priceHigh") {

        matchedProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (type === "distance") {

        matchedProducts.sort(
            (a, b) =>
                a.distance - b.distance
        );

    }

}


/* =========================================
   RENDER
========================================= */

function renderMatches() {

    const grid =
        document.getElementById("matchesGrid");


    const noMatch =
        document.getElementById("noMatch");


    grid.innerHTML = "";


    if (matchedProducts.length === 0) {

        grid.classList.add("hidden");

        noMatch.classList.remove("hidden");

        document.getElementById(
            "matchDescription"
        ).textContent =
            "No suitable products found.";

        return;

    }


    grid.classList.remove("hidden");

    noMatch.classList.add("hidden");


    document.getElementById(
        "matchDescription"
    ).textContent =
        `${matchedProducts.length} suitable product(s) found`;


    matchedProducts.forEach(product => {

        grid.insertAdjacentHTML(
            "beforeend",
            createMatchCard(product)
        );

    });

}


/* =========================================
   CREATE CARD
========================================= */

function createMatchCard(product) {

    let scoreClass = "low";


    if (product.matchScore >= 80) {

        scoreClass = "high";

    } else if (product.matchScore >= 60) {

        scoreClass = "medium";

    }


    const reasons =
        product.reasons
            .slice(0, 4)
            .map(reason => {

                return `
                    <div class="reason">
                        <span class="reason-icon">✓</span>
                        <span>${escapeHTML(reason)}</span>
                    </div>
                `;

            })
            .join("");


    return `

        <article class="match-card">

            <div class="product-image">

                <img
                    src="${escapeAttribute(product.image)}"
                    alt="${escapeAttribute(product.name)}"
                    onerror="this.src='https://via.placeholder.com/800x500?text=AHD+Product'"
                >

                <div class="match-percentage ${scoreClass}">
                    ${product.matchScore}% Match
                </div>

            </div>


            <div class="match-content">

                <div class="product-category">
                    ${escapeHTML(product.category)}
                </div>


                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-price">
                    ₹${Number(product.price).toLocaleString("en-IN")}
                </div>


                <div class="product-meta">

                    <span class="meta-tag">
                        ${escapeHTML(product.condition)}
                    </span>

                    <span class="meta-tag">
                        ${escapeHTML(product.location)}
                    </span>

                    <span class="meta-tag">
                        ${product.distance} km away
                    </span>

                </div>


                <div class="match-reasons">

                    <div class="match-reasons-title">
                        Why this matches
                    </div>

                    ${reasons}

                </div>


                <div class="seller-row">

                    <div class="seller-avatar">
                        ${getInitials(product.seller)}
                    </div>

                    <div class="seller-info">

                        <strong>
                            ${escapeHTML(product.seller)}
                        </strong>

                        <span>
                            ⭐ ${product.rating} · ${product.location}
                        </span>

                    </div>

                </div>


                <div class="card-actions">

                    <button
                        class="card-btn view-btn"
                        onclick="viewProduct('${product.id}')"
                    >
                        View Product
                    </button>


                    <button
                        class="card-btn message-btn"
                        onclick="messageSeller('${product.id}')"
                    >
                        Contact Seller
                    </button>


                    <button
                        class="card-btn deal-btn"
                        onclick="startDeal('${product.id}')"
                    >
                        Start Deal
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   VIEW PRODUCT
========================================= */

function viewProduct(productId) {

    window.location.href =
        `product.html?id=${encodeURIComponent(productId)}`;

}


/* =========================================
   CONTACT SELLER
========================================= */

function messageSeller(productId) {

    const product =
        matchedProducts.find(
            item => item.id === productId
        );


    if (!product) return;


    window.location.href =
        `messages.html?seller=${encodeURIComponent(product.seller)}&product=${encodeURIComponent(product.id)}`;

}


/* =========================================
   START DEAL
========================================= */

function startDeal(productId) {

    const product =
        matchedProducts.find(
            item => item.id === productId
        );


    if (!product) return;


    /*
       Frontend flow:

       MATCH → DEAL

       Actual deal creation will later
       happen through backend/API.
    */

    const dealId =
        "DEAL-" +
        Date.now();


    window.location.href =
        `deal.html?dealId=${encodeURIComponent(dealId)}&productId=${encodeURIComponent(product.id)}&requestId=${encodeURIComponent(currentRequest.requestId)}`;

}


/* =========================================
   EDIT REQUEST
========================================= */

function editRequest() {

    const requestId =
        currentRequest?.requestId || "";

    window.location.href =
        `request.html?requestId=${encodeURIComponent(requestId)}`;

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href = "home.html";

}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    if (!name) return "A";

    return name
        .split(" ")
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");

}


/* =========================================
   SECURITY HELPERS
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return escapeHTML(value);

}