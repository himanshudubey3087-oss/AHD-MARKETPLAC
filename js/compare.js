/* =====================================================
   AHD MARKETPLACE
   COMPARE PRODUCTS
===================================================== */


/* =====================================================
   SAMPLE FRONTEND DATA
   Backend connect hone ke baad yahi data API se aayega.
===================================================== */

const compareProducts = [

    {
        id: 1,

        name: "iPhone 13 128GB",

        price: 42000,

        category: "Mobiles",

        condition: "Like New",

        location: "Agra, Uttar Pradesh",

        distance: "2.4 km",

        seller: "Rahul Sharma",

        rating: 4.8,

        reviews: 124,

        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80",

        description:
            "iPhone 13 in excellent condition. Battery health is good and phone is fully functional.",

        delivery: "Pickup / Delivery",

        warranty: "No Warranty",

        posted: "2 days ago"
    },


    {
        id: 2,

        name: "Samsung Galaxy S23",

        price: 39000,

        category: "Mobiles",

        condition: "Like New",

        location: "Agra, Uttar Pradesh",

        distance: "4.1 km",

        seller: "Amit Verma",

        rating: 4.7,

        reviews: 96,

        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80",

        description:
            "Samsung Galaxy S23 with excellent performance, clean condition and original accessories.",

        delivery: "Pickup / Delivery",

        warranty: "3 Months",

        posted: "1 day ago"
    },


    {
        id: 3,

        name: "OnePlus 12",

        price: 45000,

        category: "Mobiles",

        condition: "New",

        location: "Mathura, Uttar Pradesh",

        distance: "48 km",

        seller: "Tech Store",

        rating: 4.9,

        reviews: 215,

        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",

        description:
            "Brand new OnePlus 12 with powerful processor, excellent camera and fast charging.",

        delivery: "Delivery Available",

        warranty: "1 Year",

        posted: "Today"
    },


    {
        id: 4,

        name: "Dell Inspiron Laptop",

        price: 52000,

        category: "Electronics",

        condition: "Good",

        location: "Agra, Uttar Pradesh",

        distance: "6.2 km",

        seller: "Vikas Singh",

        rating: 4.5,

        reviews: 72,

        image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=700&q=80",

        description:
            "Dell laptop suitable for office work, coding, study and everyday use.",

        delivery: "Pickup",

        warranty: "No Warranty",

        posted: "5 days ago"
    },


    {
        id: 5,

        name: "Honda Activa 6G",

        price: 68000,

        category: "Vehicles",

        condition: "Good",

        location: "Agra, Uttar Pradesh",

        distance: "7.8 km",

        seller: "Mohit Yadav",

        rating: 4.6,

        reviews: 48,

        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80",

        description:
            "Honda Activa 6G in good condition with regular servicing and valid documents.",

        delivery: "Pickup",

        warranty: "No Warranty",

        posted: "3 days ago"
    },


    {
        id: 6,

        name: "Wooden Study Table",

        price: 4500,

        category: "Furniture",

        condition: "Good",

        location: "Agra, Uttar Pradesh",

        distance: "3.5 km",

        seller: "Neeraj Furniture",

        rating: 4.4,

        reviews: 31,

        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b0?auto=format&fit=crop&w=700&q=80",

        description:
            "Strong wooden study table with storage drawer. Suitable for students and home office.",

        delivery: "Pickup",

        warranty: "No Warranty",

        posted: "4 days ago"
    },


    {
        id: 7,

        name: "Nike Running Shoes",

        price: 2800,

        category: "Fashion",

        condition: "New",

        location: "Agra, Uttar Pradesh",

        distance: "5.3 km",

        seller: "AHD Fashion Store",

        rating: 4.8,

        reviews: 188,

        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",

        description:
            "Brand new comfortable running shoes suitable for running, gym and daily use.",

        delivery: "Delivery Available",

        warranty: "7 Days",

        posted: "Today"
    }

];



/* =====================================================
   GET PRODUCT IDS FROM URL
===================================================== */

function getCompareIds() {

    const params = new URLSearchParams(window.location.search);

    const ids = params.get("products");

    if (!ids) {
        return [];
    }

    return ids
        .split(",")
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));

}



/* =====================================================
   GET SELECTED PRODUCTS
===================================================== */

function getSelectedProducts() {

    const ids = getCompareIds();

    return ids
        .map(id =>
            compareProducts.find(product => product.id === id)
        )
        .filter(Boolean)
        .slice(0, 3);

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(price) {

    return "₹" + Number(price).toLocaleString("en-IN");

}



/* =====================================================
   UPDATE URL
===================================================== */

function updateCompareURL(ids) {

    const url = new URL(window.location.href);

    if (ids.length > 0) {

        url.searchParams.set(
            "products",
            ids.join(",")
        );

    } else {

        url.searchParams.delete("products");

    }

    window.history.replaceState(
        {},
        "",
        url.toString()
    );

}



/* =====================================================
   REMOVE PRODUCT
===================================================== */

function removeProduct(productId) {

    const ids = getCompareIds()
        .filter(id => id !== productId);

    updateCompareURL(ids);

    renderCompare();

}



/* =====================================================
   VIEW PRODUCT
===================================================== */

function viewProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;

}



/* =====================================================
   MESSAGE SELLER
===================================================== */

function messageSeller(productId) {

    window.location.href =
        `messages.html?product=${productId}`;

}



/* =====================================================
   START DEAL
===================================================== */

function startDeal(productId) {

    window.location.href =
        `deal.html?product=${productId}`;

}



/* =====================================================
   FIND BEST VALUES
===================================================== */

function getBestPrice(products) {

    if (!products.length) {
        return null;
    }

    return Math.min(
        ...products.map(product => product.price)
    );

}


function getBestDistance(products) {

    if (!products.length) {
        return null;
    }

    const distances = products.map(product => {

        return parseFloat(
            String(product.distance)
                .replace("km", "")
                .trim()
        );

    });

    return Math.min(...distances);

}


function getBestRating(products) {

    if (!products.length) {
        return null;
    }

    return Math.max(
        ...products.map(product => product.rating)
    );

}



/* =====================================================
   PRODUCT HEADER
===================================================== */

function createProductHeader(product, bestPrice) {

    const bestBadge =
        product.price === bestPrice
            ? `<span class="best-product">✓ Best Price</span>`
            : "";

    return `

        <th class="product-column">

            <button
                class="remove-product"
                onclick="removeProduct(${product.id})"
                title="Remove"
            >
                ×
            </button>

            <img
                class="product-image"
                src="${escapeHTML(product.image)}"
                alt="${escapeHTML(product.name)}"
            >

            <div class="product-name">
                ${escapeHTML(product.name)}
            </div>

            <div class="product-price">
                ${formatPrice(product.price)}
            </div>

            ${bestBadge}

        </th>

    `;

}



/* =====================================================
   VALUE CELL
===================================================== */

function valueCell(value, extraClass = "") {

    return `
        <td class="value-cell ${extraClass}">
            ${value}
        </td>
    `;

}



/* =====================================================
   SELLER CELL
===================================================== */

function sellerCell(product) {

    return `

        <td class="value-cell">

            <div class="seller-info">

                <div class="seller-avatar">
                    👤
                </div>

                <div>

                    <div class="seller-name">
                        ${escapeHTML(product.seller)}
                    </div>

                    <div class="seller-rating">
                        ⭐ ${product.rating}
                        (${product.reviews} reviews)
                    </div>

                </div>

            </div>

        </td>

    `;

}



/* =====================================================
   ACTION CELL
===================================================== */

function actionCell(product) {

    return `

        <td>

            <div class="compare-actions">

                <button
                    class="compare-action-btn view-btn"
                    onclick="viewProduct(${product.id})"
                >
                    👁 View Product
                </button>


                <button
                    class="compare-action-btn message-btn"
                    onclick="messageSeller(${product.id})"
                >
                    💬 Message Seller
                </button>


                <button
                    class="compare-action-btn deal-btn"
                    onclick="startDeal(${product.id})"
                >
                    🤝 Start Deal
                </button>

            </div>

        </td>

    `;

}



/* =====================================================
   CREATE ROW
===================================================== */

function createRow(label, products, callback) {

    return `

        <tr>

            <th class="attribute-column">
                ${label}
            </th>

            ${products.map(callback).join("")}

        </tr>

    `;

}



/* =====================================================
   RENDER TABLE
===================================================== */

function renderCompare() {

    const wrapper =
        document.getElementById("compareTableWrapper");

    const empty =
        document.getElementById("emptyCompare");

    const count =
        document.getElementById("compareCount");


    const products =
        getSelectedProducts();


    count.textContent = products.length;


    /* EMPTY */

    if (!products.length) {

        wrapper.innerHTML = "";

        empty.style.display = "block";

        return;

    }


    empty.style.display = "none";


    const bestPrice =
        getBestPrice(products);


    const bestDistance =
        getBestDistance(products);


    const bestRating =
        getBestRating(products);


    let table = `

        <div class="compare-table-wrapper">

            <table class="compare-table">

                <thead>

                    <tr>

                        <th class="attribute-column">
                            Product Details
                        </th>

                        ${products
                            .map(product =>
                                createProductHeader(
                                    product,
                                    bestPrice
                                )
                            )
                            .join("")
                        }

                    </tr>

                </thead>

                <tbody>

    `;


    /* PRICE */

    table += `

        <tr>

            <th class="attribute-column">
                Price
            </th>

            ${products.map(product => {

                const best =
                    product.price === bestPrice
                        ? "best-value"
                        : "";

                return `
                    <td class="value-cell ${best}">
                        <strong>
                            ${formatPrice(product.price)}
                        </strong>
                    </td>
                `;

            }).join("")}

        </tr>

    `;


    /* CATEGORY */

    table += createRow(
        "Category",
        products,
        product =>
            valueCell(
                escapeHTML(product.category)
            )
    );


    /* CONDITION */

    table += createRow(
        "Condition",
        products,
        product => `

            <td class="value-cell">

                <span class="condition-badge">

                    ${escapeHTML(product.condition)}

                </span>

            </td>

        `
    );


    /* LOCATION */

    table += createRow(
        "Location",
        products,
        product =>
            valueCell(
                "📍 " +
                escapeHTML(product.location)
            )
    );


    /* DISTANCE */

    table += `

        <tr>

            <th class="attribute-column">
                Distance
            </th>

            ${products.map(product => {

                const distance =
                    parseFloat(
                        String(product.distance)
                            .replace("km", "")
                    );

                const best =
                    distance === bestDistance
                        ? "best-value"
                        : "";

                return `

                    <td class="value-cell ${best}">

                        📍
                        <strong>
                            ${escapeHTML(product.distance)}
                        </strong>

                        ${
                            distance === bestDistance
                                ? `<span class="best-product">
                                    Nearest
                                   </span>`
                                : ""
                        }

                    </td>

                `;

            }).join("")}

        </tr>

    `;


    /* SELLER */

    table += `

        <tr>

            <th class="attribute-column">
                Seller
            </th>

            ${products
                .map(product => sellerCell(product))
                .join("")
            }

        </tr>

    `;


    /* RATING */

    table += `

        <tr>

            <th class="attribute-column">
                Seller Rating
            </th>

            ${products.map(product => {

                const best =
                    product.rating === bestRating
                        ? "best-value"
                        : "";

                return `

                    <td class="value-cell ${best}">

                        ⭐
                        <strong>
                            ${product.rating}/5
                        </strong>

                        <br>

                        <small>
                            ${product.reviews} reviews
                        </small>

                    </td>

                `;

            }).join("")}

        </tr>

    `;


    /* DELIVERY */

    table += createRow(
        "Delivery / Pickup",
        products,
        product =>
            valueCell(
                escapeHTML(product.delivery)
            )
    );


    /* WARRANTY */

    table += createRow(
        "Warranty",
        products,
        product =>
            valueCell(
                escapeHTML(product.warranty)
            )
    );


    /* POSTED */

    table += createRow(
        "Posted",
        products,
        product =>
            valueCell(
                escapeHTML(product.posted)
            )
    );


    /* DESCRIPTION */

    table += `

        <tr>

            <th class="attribute-column">
                Description
            </th>

            ${products.map(product => `

                <td class="value-cell description-cell">

                    ${escapeHTML(product.description)}

                </td>

            `).join("")}

        </tr>

    `;


    /* ACTIONS */

    table += `

        <tr>

            <th class="attribute-column">
                Actions
            </th>

            ${products
                .map(product => actionCell(product))
                .join("")
            }

        </tr>

    `;


    table += `

                </tbody>

            </table>

        </div>

    `;


    wrapper.innerHTML = table;

}



/* =====================================================
   HEADER SEARCH
===================================================== */

function setupHeaderSearch() {

    const input =
        document.getElementById("headerSearch");

    const button =
        document.getElementById("searchBtn");


    function performSearch() {

        const query =
            input.value.trim();


        if (!query) {
            return;
        }


        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;

    }


    if (button) {

        button.addEventListener(
            "click",
            performSearch
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    performSearch();

                }

            }
        );

    }

}



/* =====================================================
   LOCATION
===================================================== */

function setupLocation() {

    const locationBtn =
        document.getElementById("locationBtn");


    if (!locationBtn) {
        return;
    }


    locationBtn.addEventListener(
        "click",
        () => {

            if (
                typeof navigator !== "undefined" &&
                navigator.geolocation
            ) {

                navigator.geolocation.getCurrentPosition(

                    position => {

                        document.getElementById(
                            "userLocation"
                        ).textContent =
                            "Your current location";

                    },

                    () => {

                        alert(
                            "Location permission allow nahi hui."
                        );

                    }

                );

            } else {

                alert(
                    "Your browser does not support location."
                );

            }

        }
    );

}



/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCompare();

        setupHeaderSearch();

        setupLocation();

    }
);