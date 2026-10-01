/* =========================================
   AHD CATEGORY SYSTEM
========================================= */


/*
   Frontend product data.

   IMPORTANT:
   localStorage/sessionStorage का इस्तेमाल नहीं है।

   बाद में यही data backend/database/API
   से आएगा।
*/


const categoryProducts = [

    {
        id: 1,

        name: "iPhone 13 128GB",

        price: 42000,

        category: "Mobiles",

        condition: "Like New",

        location: "Agra, Uttar Pradesh",

        posted: "Today",

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

        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    }

];


let currentCategory = "All";

let displayedProducts = [];


/* =========================================
   GET CATEGORY FROM URL
========================================= */

function getCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");

    if (!category) {

        return "All";

    }

    return category;

}


/* =========================================
   CATEGORY INFORMATION
========================================= */

function getCategoryDescription(category) {

    const descriptions = {

        Mobiles:
            "Find smartphones and mobile phones from sellers near you.",

        Electronics:
            "Buy and sell laptops, headphones, gadgets and electronics.",

        Vehicles:
            "Find bikes, scooters and other vehicles available nearby.",

        Furniture:
            "Discover sofas, tables, chairs and other furniture.",

        Fashion:
            "Explore clothes, jackets, shoes and fashion products.",

        Jobs:
            "Find jobs and work opportunities near your location.",

        All:
            "Explore products available on AHD Marketplace."

    };


    return descriptions[category]
        || `Explore ${category} products available on AHD Marketplace.`;

}


/* =========================================
   LOAD CATEGORY
========================================= */

function loadCategory() {

    currentCategory =
        getCategoryFromURL();


    document.getElementById(
        "categoryTitle"
    ).textContent =
        currentCategory === "All"
            ? "All Products"
            : currentCategory;


    document.getElementById(
        "breadcrumbCategory"
    ).textContent =
        currentCategory === "All"
            ? "All Products"
            : currentCategory;


    document.getElementById(
        "categoryDescription"
    ).textContent =
        getCategoryDescription(
            currentCategory
        );


    highlightCategory();


    displayCategoryProducts();

}


/* =========================================
   HIGHLIGHT ACTIVE CATEGORY
========================================= */

function highlightCategory() {

    const links =
        document.querySelectorAll(
            "[data-category]"
        );


    links.forEach(link => {

        link.classList.remove(
            "active-category"
        );


        if (
            link.dataset.category
                .toLowerCase()
            ===
            currentCategory.toLowerCase()
        ) {

            link.classList.add(
                "active-category"
            );

        }

    });

}


/* =========================================
   GET CATEGORY PRODUCTS
========================================= */

function getFilteredCategoryProducts() {

    let products;


    if (currentCategory === "All") {

        products =
            [...categoryProducts];

    } else {

        products =
            categoryProducts.filter(
                product =>
                    product.category
                        .toLowerCase()
                    ===
                    currentCategory.toLowerCase()
            );

    }


    return products;

}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayCategoryProducts(
    products = null
) {

    displayedProducts =
        products ||
        getFilteredCategoryProducts();


    const grid =
        document.getElementById(
            "productGrid"
        );


    const noProducts =
        document.getElementById(
            "noProducts"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    grid.innerHTML = "";


    resultCount.textContent =
        displayedProducts.length;


    if (
        displayedProducts.length === 0
    ) {

        noProducts.classList.add(
            "show"
        );

        return;

    }


    noProducts.classList.remove(
        "show"
    );


    displayedProducts.forEach(
        product => {

            const card =
                document.createElement("article");


            card.className =
                "category-product-card";


            card.onclick =
                function() {

                    openProduct(
                        product.id
                    );

                };


            card.innerHTML = `

                <div class="category-product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <span class="card-condition">
                        ${product.condition}
                    </span>

                    <button
                        class="card-save"
                        onclick="event.stopPropagation(); saveCardProduct(this)"
                        aria-label="Save product"
                    >
                        ♡
                    </button>

                </div>


                <div class="category-product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="category-product-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>

                    <div class="category-product-location">
                        📍 ${product.location}
                    </div>

                    <div class="category-product-posted">
                        Posted ${product.posted}
                    </div>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


/* =========================================
   OPEN PRODUCT DETAILS
========================================= */

function openProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;

}


/* =========================================
   SORT
========================================= */

function sortProducts() {

    const sortValue =
        document.getElementById(
            "sortProducts"
        ).value;


    let products =
        [...displayedProducts];


    if (sortValue === "low") {

        products.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (sortValue === "high") {

        products.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else {

        /*
           Frontend में अभी product list
           latest order में है।
        */

        products =
            [...products];

    }


    displayCategoryProducts(
        products
    );

}


/* =========================================
   APPLY FILTERS
========================================= */

function applyFilters() {

    let products =
        getFilteredCategoryProducts();


    /* CONDITION */

    const selectedConditions =
        Array.from(
            document.querySelectorAll(
                ".condition-filter:checked"
            )
        )
        .map(
            checkbox =>
                checkbox.value
        );


    if (
        selectedConditions.length > 0
    ) {

        products =
            products.filter(
                product =>
                    selectedConditions.includes(
                        product.condition
                    )
            );

    }


    /* MIN PRICE */

    const minPrice =
        Number(
            document.getElementById(
                "minPrice"
            ).value
        );


    if (
        minPrice &&
        minPrice > 0
    ) {

        products =
            products.filter(
                product =>
                    product.price >= minPrice
            );

    }


    /* MAX PRICE */

    const maxPrice =
        Number(
            document.getElementById(
                "maxPrice"
            ).value
        );


    if (
        maxPrice &&
        maxPrice > 0
    ) {

        products =
            products.filter(
                product =>
                    product.price <= maxPrice
            );

    }


    displayCategoryProducts(
        products
    );

}


/* =========================================
   CLEAR FILTERS
========================================= */

function clearFilters() {

    document.querySelectorAll(
        ".condition-filter"
    )
    .forEach(
        checkbox =>
            checkbox.checked = false
    );


    document.getElementById(
        "minPrice"
    ).value = "";


    document.getElementById(
        "maxPrice"
    ).value = "";


    document.getElementById(
        "sortProducts"
    ).value = "latest";


    displayCategoryProducts();

}


/* =========================================
   SAVE CARD
========================================= */

function saveCardProduct(button) {

    if (
        button.textContent.trim()
        ===
        "♡"
    ) {

        button.textContent = "♥";

        button.style.color =
            "#e53935";

    } else {

        button.textContent = "♡";

        button.style.color = "";

    }

}


/* =========================================
   HEADER SEARCH
========================================= */

function performSearch() {

    const input =
        document.getElementById(
            "globalSearch"
        );


    const query =
        input.value.trim();


    if (!query) {

        return;

    }


    window.location.href =
        `search.html?q=${encodeURIComponent(query)}`;

}


function handleSearch(event) {

    if (
        event.key === "Enter"
    ) {

        performSearch();

    }

}


/* =========================================
   NAVIGATION
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
    loadCategory
);