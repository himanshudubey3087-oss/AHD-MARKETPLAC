/* =========================================
   AHD SEARCH SYSTEM
========================================= */


/*
   Frontend search data.

   NO localStorage
   NO sessionStorage

   Later this data will come from backend/API.
*/


const searchProducts = [

    {
        id: 1,
        name: "iPhone 13 128GB",
        price: 42000,
        category: "Mobiles",
        condition: "Like New",
        location: "Agra, Uttar Pradesh",
        posted: "Today",

        description:
            "iPhone 13 in excellent condition.",

        image:
            "https://images.unsplash.com/photo-1592286927505-2fdc8d9e8b7f?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 2,
        name: "HP Laptop Core i5",
        price: 32000,
        category: "Electronics",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        posted: "Yesterday",

        description:
            "HP laptop for students and office work.",

        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 3,
        name: "Royal Enfield Classic 350",
        price: 145000,
        category: "Vehicles",
        condition: "Good",
        location: "Mathura, Uttar Pradesh",
        posted: "2 days ago",

        description:
            "Royal Enfield Classic 350 in good condition.",

        image:
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 4,
        name: "Wooden Sofa Set",
        price: 18000,
        category: "Furniture",
        condition: "Good",
        location: "Firozabad, Uttar Pradesh",
        posted: "3 days ago",

        description:
            "Premium wooden sofa set.",

        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 5,
        name: "Samsung Galaxy S23",
        price: 38000,
        category: "Mobiles",
        condition: "Good",
        location: "Agra, Uttar Pradesh",
        posted: "Today",

        description:
            "Samsung Galaxy S23 smartphone.",

        image:
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 6,
        name: "Dell Gaming Laptop",
        price: 55000,
        category: "Electronics",
        condition: "Like New",
        location: "Agra, Uttar Pradesh",
        posted: "Yesterday",

        description:
            "Powerful gaming laptop for gaming and work.",

        image:
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 7,
        name: "Honda Activa 6G",
        price: 72000,
        category: "Vehicles",
        condition: "Good",
        location: "Firozabad, Uttar Pradesh",
        posted: "4 days ago",

        description:
            "Honda Activa scooter in good condition.",

        image:
            "https://images.unsplash.com/photo-1558980394-0c7c2f0c9c1b?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 8,
        name: "Modern Study Table",
        price: 5500,
        category: "Furniture",
        condition: "New",
        location: "Agra, Uttar Pradesh",
        posted: "Today",

        description:
            "Modern study table for home and office.",

        image:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 9,
        name: "Men's Casual Jacket",
        price: 1800,
        category: "Fashion",
        condition: "New",
        location: "Agra, Uttar Pradesh",
        posted: "Today",

        description:
            "Men's stylish casual jacket.",

        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    },


    {
        id: 10,
        name: "Sony Bluetooth Headphones",
        price: 4500,
        category: "Electronics",
        condition: "Like New",
        location: "Mathura, Uttar Pradesh",
        posted: "2 days ago",

        description:
            "Sony wireless Bluetooth headphones.",

        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    }

];


let currentSearchQuery = "";

let currentResults = [];


/* =========================================
   GET QUERY FROM URL
========================================= */

function getSearchQuery() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("q")
        || ""
    ).trim();

}


/* =========================================
   START SEARCH PAGE
========================================= */

async function initializeSearch() {
    const params = new URLSearchParams(window.location.search);
    currentSearchQuery = (params.get("q") || "").trim();
    const categoryParam = (params.get("category") || "").trim();

    // Sync input fields
    const sInput = document.getElementById("searchInput");
    if (sInput) sInput.value = currentSearchQuery;

    const pInput = document.getElementById("pageSearchInput");
    if (pInput) pInput.value = currentSearchQuery;

    // Load any dynamic products from AHDApi if available
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getProducts === "function") {
            const apiProducts = await AHDApi.getProducts();
            if (apiProducts && apiProducts.length > 0) {
                // Merge with searchProducts without duplicating IDs
                apiProducts.forEach(ap => {
                    if (!searchProducts.some(p => String(p.id) === String(ap.id))) {
                        searchProducts.unshift({
                            id: ap.id,
                            name: ap.name,
                            price: ap.price,
                            category: ap.category || "General",
                            condition: ap.condition || "Like New",
                            location: ap.location || "Agra, Uttar Pradesh",
                            posted: "Recently",
                            description: ap.description || "",
                            image: (ap.images && ap.images[0]) ? ap.images[0] : (ap.icon || "https://images.unsplash.com/photo-1592286927505-2fdc8d9e8b7f?auto=format&fit=crop&w=800&q=80")
                        });
                    }
                });
            }
        }
    } catch (err) {
        console.warn("API products load note:", err);
    }

    // Apply category parameter if present
    if (categoryParam) {
        const catBoxes = document.querySelectorAll(".category-check");
        catBoxes.forEach(cb => {
            if (cb.value.toLowerCase() === categoryParam.toLowerCase()) {
                cb.checked = true;
            }
        });

        // Highlight matching subnav chip
        const chips = document.querySelectorAll(".cat-chip");
        chips.forEach(chip => {
            if (chip.textContent.toLowerCase().includes(categoryParam.toLowerCase())) {
                chip.classList.add("active");
            } else if (chip.textContent.includes("All")) {
                chip.classList.remove("active");
            }
        });
    }

    if (categoryParam) {
        applySearchFilters();
    } else {
        performSearchLogic();
    }
}


/* =========================================
   SEARCH LOGIC
========================================= */

function performSearchLogic() {
    const query = currentSearchQuery.toLowerCase().trim();

    if (!query) {
        currentResults = [...searchProducts];
        updateSearchSummary("Showing all products on AHD Marketplace.");
        displaySearchResults();
        return;
    }

    const words = query.split(/\s+/);

    currentResults =
        searchProducts.filter(
            product => {

                const searchableText = [

                    product.name,

                    product.category,

                    product.condition,

                    product.location,

                    product.description

                ]
                .join(" ")
                .toLowerCase();


                return words.every(
                    word =>
                        searchableText.includes(word)
                );

            }
        );


    /*
       Nearby/location relevance:

       Agra products get higher priority
       if search contains Agra.
    */

    currentResults.sort(
        (a, b) => {

            const aText =
                `${a.name} ${a.category} ${a.location}`
                    .toLowerCase();

            const bText =
                `${b.name} ${b.category} ${b.location}`
                    .toLowerCase();


            const aMatch =
                aText.includes(query)
                    ? 1
                    : 0;

            const bMatch =
                bText.includes(query)
                    ? 1
                    : 0;


            return bMatch - aMatch;

        }
    );


    updateSearchSummary(
        `Search results for "${currentSearchQuery}"`
    );


    displaySearchResults();

}


/* =========================================
   DISPLAY RESULTS
========================================= */

function displaySearchResults(
    products = currentResults
) {

    currentResults =
        [...products];


    const grid =
        document.getElementById(
            "searchProductGrid"
        );


    const empty =
        document.getElementById(
            "searchEmpty"
        );


    const count =
        document.getElementById(
            "resultCount"
        );


    grid.innerHTML = "";


    count.textContent =
        currentResults.length;


    if (
        currentResults.length === 0
    ) {

        empty.classList.add("show");

        return;

    }


    empty.classList.remove("show");


    currentResults.forEach(
        product => {

            const card =
                document.createElement("article");


            card.className =
                "search-product-card";


            card.onclick =
                function() {

                    openSearchProduct(
                        product.id
                    );

                };


            const imgUrl = (product.images && product.images[0]) || product.image || "📦";
            const isImg = typeof imgUrl === "string" && (imgUrl.startsWith("http") || imgUrl.startsWith("data:") || imgUrl.startsWith("images/"));

            card.innerHTML = `
                <div class="search-card-image">
                    ${isImg ? `<img src="${imgUrl}" alt="${product.name}" loading="lazy">` : `<span class="product-fallback-icon">${imgUrl}</span>`}
                    <span class="search-condition">${product.condition || "Used"}</span>
                    <button class="search-save" onclick="event.stopPropagation(); toggleSearchSave(this)" title="Save to favorites">♡</button>
                </div>
                <div class="search-card-info">
                    <h3>${product.name}</h3>
                    <div class="search-card-price">₹${Number(product.price || 0).toLocaleString("en-IN")}</div>
                    <div class="search-card-category">${product.category || "General"}</div>
                    <div class="search-card-location">📍 ${product.location || "Agra, Uttar Pradesh"}</div>
                    <div class="search-card-posted">Posted ${product.posted || "Recently"}</div>
                </div>
            `;


            grid.appendChild(card);

        }
    );

}


/* =========================================
   SEARCH SUMMARY
========================================= */

function updateSearchSummary(text) {

    document.getElementById(
        "searchSummary"
    ).textContent = text;

}


/* =========================================
   RUN SEARCH
========================================= */

function runSearch() {

    const value =
        document.getElementById(
            "searchInput"
        ).value.trim();


    goToSearch(value);

}


function runPageSearch() {

    const value =
        document.getElementById(
            "pageSearchInput"
        ).value.trim();


    goToSearch(value);

}


function goToSearch(query) {

    window.location.href =
        `search.html?q=${encodeURIComponent(query)}`;

}


/* =========================================
   ENTER SEARCH
========================================= */

function searchOnEnter(event) {

    if (
        event.key === "Enter"
    ) {

        runSearch();

    }

}


function pageSearchEnter(event) {

    if (
        event.key === "Enter"
    ) {

        runPageSearch();

    }

}


/* =========================================
   SORT RESULTS
========================================= */

function sortSearchResults() {

    const value =
        document.getElementById(
            "searchSort"
        ).value;


    let sorted =
        [...currentResults];


    if (value === "low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (value === "high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else if (value === "latest") {

        /*
           Current frontend data is already
           arranged approximately latest first.
        */

        sorted =
            [...sorted];

    }


    displaySearchResults(
        sorted
    );

}


/* =========================================
   FILTER
========================================= */

function applySearchFilters() {

    const query =
        currentSearchQuery
            .toLowerCase()
            .trim();


    let products =
        searchProducts.filter(
            product => {

                if (!query) {

                    return true;

                }


                const text = [

                    product.name,

                    product.category,

                    product.condition,

                    product.location,

                    product.description

                ]
                .join(" ")
                .toLowerCase();


                return query
                    .split(/\s+/)
                    .every(
                        word =>
                            text.includes(word)
                    );

            }
        );


    /* CATEGORY */

    const categories =
        Array.from(
            document.querySelectorAll(
                ".category-check:checked"
            )
        )
        .map(
            checkbox =>
                checkbox.value
        );


    if (
        categories.length > 0
    ) {

        products =
            products.filter(
                product =>
                    categories.includes(
                        product.category
                    )
            );

    }


    /* CONDITION */

    const conditions =
        Array.from(
            document.querySelectorAll(
                ".condition-check:checked"
            )
        )
        .map(
            checkbox =>
                checkbox.value
        );


    if (
        conditions.length > 0
    ) {

        products =
            products.filter(
                product =>
                    conditions.includes(
                        product.condition
                    )
            );

    }


    /* MIN PRICE */

    const min =
        Number(
            document.getElementById(
                "searchMinPrice"
            ).value
        );


    if (
        min > 0
    ) {

        products =
            products.filter(
                product =>
                    product.price >= min
            );

    }


    /* MAX PRICE */

    const max =
        Number(
            document.getElementById(
                "searchMaxPrice"
            ).value
        );


    if (
        max > 0
    ) {

        products =
            products.filter(
                product =>
                    product.price <= max
            );

    }


    displaySearchResults(
        products
    );

}


/* =========================================
   CLEAR FILTERS
========================================= */

function clearSearchFilters() {

    document.querySelectorAll(
        ".category-check"
    )
    .forEach(
        checkbox =>
            checkbox.checked = false
    );


    document.querySelectorAll(
        ".condition-check"
    )
    .forEach(
        checkbox =>
            checkbox.checked = false
    );


    document.getElementById(
        "searchMinPrice"
    ).value = "";


    document.getElementById(
        "searchMaxPrice"
    ).value = "";


    document.getElementById(
        "searchSort"
    ).value = "relevance";


    performSearchLogic();

}


/* =========================================
   OPEN PRODUCT
========================================= */

function openSearchProduct(id) {

    window.location.href =
        `product.html?id=${id}`;

}


/* =========================================
   SAVE
========================================= */

function toggleSearchSave(button) {

    if (
        button.textContent.trim()
        === "♡"
    ) {

        button.textContent = "♥";

        button.style.color =
            "#e53935";

    }

    else {

        button.textContent = "♡";

        button.style.color = "";

    }

}


/* =========================================
   HEADER NAVIGATION
========================================= */

function goHome() {

    window.location.href =
        "home.html";

}


function goToSell() {

    window.location.href =
        "sell.html";

}


function openAccount() {

    window.location.href =
        "account.html";

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeSearch
);