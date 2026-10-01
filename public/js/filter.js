/* =========================================================
   AHD MARKETPLACE
   FILTER PAGE
========================================================= */


/*
    IMPORTANT:
    No localStorage
    No sessionStorage

    Later this array will be replaced by
    Backend / Database API.
*/


const filterProducts = [

    {
        id: 1,
        title: "iPhone 13 128GB",
        price: 42000,
        category: "Mobiles",
        condition: "Like New",
        location: "Agra",
        area: "Sikandra",
        distance: 4,
        description: "Excellent condition iPhone with original box.",
        date: "2026-09-03",
        image: ""
    },

    {
        id: 2,
        title: "Samsung Galaxy S23",
        price: 39000,
        category: "Mobiles",
        condition: "Good",
        location: "Agra",
        area: "Khandari",
        distance: 7,
        description: "Samsung flagship phone in good condition.",
        date: "2026-09-02",
        image: ""
    },

    {
        id: 3,
        title: "HP Laptop 15s",
        price: 32000,
        category: "Electronics",
        condition: "Good",
        location: "Agra",
        area: "Kamla Nagar",
        distance: 9,
        description: "HP laptop suitable for study and office work.",
        date: "2026-09-01",
        image: ""
    },

    {
        id: 4,
        title: "Dell Inspiron Laptop",
        price: 28000,
        category: "Electronics",
        condition: "Like New",
        location: "Agra",
        area: "Dayalbagh",
        distance: 12,
        description: "Fast Dell laptop with SSD.",
        date: "2026-08-31",
        image: ""
    },

    {
        id: 5,
        title: "Honda Shine 125",
        price: 72000,
        category: "Vehicles",
        condition: "Good",
        location: "Agra",
        area: "Shahganj",
        distance: 6,
        description: "Well maintained Honda Shine.",
        date: "2026-08-30",
        image: ""
    },

    {
        id: 6,
        title: "Royal Enfield Classic 350",
        price: 145000,
        category: "Vehicles",
        condition: "Good",
        location: "Agra",
        area: "Sadar",
        distance: 18,
        description: "Classic 350 in excellent running condition.",
        date: "2026-08-29",
        image: ""
    },

    {
        id: 7,
        title: "2 BHK Flat",
        price: 2800000,
        category: "Property",
        condition: "Good",
        location: "Agra",
        area: "Taj Nagari",
        distance: 14,
        description: "Ready to move 2 BHK flat.",
        date: "2026-08-28",
        image: ""
    },

    {
        id: 8,
        title: "Wooden Sofa Set",
        price: 18000,
        category: "Furniture",
        condition: "Good",
        location: "Agra",
        area: "Bodla",
        distance: 11,
        description: "Premium wooden sofa set.",
        date: "2026-08-27",
        image: ""
    },

    {
        id: 9,
        title: "Men's Denim Jacket",
        price: 900,
        category: "Fashion",
        condition: "Like New",
        location: "Agra",
        area: "Rajpur Chungi",
        distance: 5,
        description: "Stylish denim jacket.",
        date: "2026-08-26",
        image: ""
    },

    {
        id: 10,
        title: "Office Assistant Job",
        price: 15000,
        category: "Jobs",
        condition: "New",
        location: "Agra",
        area: "Sanjay Place",
        distance: 8,
        description: "Full time office assistant job.",
        date: "2026-08-25",
        image: ""
    },

    {
        id: 11,
        title: "AC Repair Service",
        price: 499,
        category: "Services",
        condition: "New",
        location: "Agra",
        area: "Civil Lines",
        distance: 10,
        description: "Professional AC repair service.",
        date: "2026-08-24",
        image: ""
    },

    {
        id: 12,
        title: "Study Table",
        price: 2500,
        category: "Furniture",
        condition: "Fair",
        location: "Mathura",
        area: "Krishna Nagar",
        distance: 48,
        description: "Study table in usable condition.",
        date: "2026-08-23",
        image: ""
    }

];


/* =========================================================
   STATE
========================================================= */

let currentProducts = [...filterProducts];

let currentLocation = "Agra";

let currentFilters = {

    location: "",
    distance: "all",
    category: "all",
    minPrice: "",
    maxPrice: "",
    conditions: [],
    sort: "relevance"

};


/* =========================================================
   DOM
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const noResults =
    document.getElementById("noResults");

const resultInfo =
    document.getElementById("resultInfo");

const activeFilters =
    document.getElementById("activeFilters");

const activeFilterCount =
    document.getElementById("activeFilterCount");

const locationInput =
    document.getElementById("locationInput");

const distanceFilter =
    document.getElementById("distanceFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const minPrice =
    document.getElementById("minPrice");

const maxPrice =
    document.getElementById("maxPrice");

const sortFilter =
    document.getElementById("sortFilter");

const applyFilterBtn =
    document.getElementById("applyFilterBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

const resetResultsBtn =
    document.getElementById("resetResultsBtn");

const useLocationBtn =
    document.getElementById("useLocationBtn");


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return "₹" + Number(price).toLocaleString("en-IN");

}


/* =========================================================
   DISTANCE TEXT
========================================================= */

function getDistanceText(distance) {

    if (distance === 0) {
        return "Nearby";
    }

    return distance + " km away";

}


/* =========================================================
   PRODUCT IMAGE
========================================================= */

function getProductImage(product) {

    if (product.image && product.image.trim() !== "") {

        return `
            <img
                src="${product.image}"
                alt="${product.title}"
                loading="lazy"
            >
        `;

    }

    return `
        <div class="image-placeholder">
            🛍️
        </div>
    `;

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {

    return `

        <article
            class="filter-product-card"
            data-id="${product.id}"
        >

            <div class="product-image">

                ${getProductImage(product)}

            </div>


            <div class="product-card-content">

                <h3>
                    ${product.title}
                </h3>


                <div class="product-price">
                    ${formatPrice(product.price)}
                </div>


                <div class="product-meta">

                    <span>
                        ${product.category}
                    </span>

                    <span>
                        ${product.condition}
                    </span>

                </div>


                <div class="product-location">

                    📍 ${product.area}, ${product.location}

                </div>


                <div class="card-bottom">

                    <span class="product-distance">

                        ${getDistanceText(product.distance)}

                    </span>


                    <button
                        class="save-product"
                        type="button"
                        data-save-id="${product.id}"
                        aria-label="Save product"
                    >
                        ♡
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(products) {

    productGrid.innerHTML = "";


    if (!products.length) {

        noResults.classList.remove("hidden");

        resultInfo.textContent =
            "No products match your filters.";

        return;

    }


    noResults.classList.add("hidden");


    productGrid.innerHTML =
        products.map(createProductCard).join("");


    resultInfo.textContent =
        `${products.length} product${products.length > 1 ? "s" : ""} found`;


    attachCardEvents();

}


/* =========================================================
   CARD EVENTS
========================================================= */

function attachCardEvents() {

    document
        .querySelectorAll(".filter-product-card")
        .forEach(card => {

            card.addEventListener("click", function(event) {

                if (
                    event.target.closest(".save-product")
                ) {
                    return;
                }

                const id =
                    this.getAttribute("data-id");

                window.location.href =
                    `product.html?id=${id}`;

            });

        });


    document
        .querySelectorAll(".save-product")
        .forEach(button => {

            button.addEventListener("click", function(event) {

                event.stopPropagation();

                const id =
                    this.getAttribute("data-save-id");

                toggleSave(button, id);

            });

        });

}


/* =========================================================
   SAVE PRODUCT
========================================================= */

function toggleSave(button, id) {

    const isSaved =
        button.textContent.trim() === "♥";

    if (isSaved) {

        button.textContent = "♡";

        button.title = "Save product";

    } else {

        button.textContent = "♥";

        button.title = "Saved";

    }

}


/* =========================================================
   READ FILTERS
========================================================= */

function readFilters() {

    const selectedConditions =
        Array.from(
            document.querySelectorAll(
                'input[name="condition"]:checked'
            )
        ).map(
            checkbox => checkbox.value
        );


    currentFilters = {

        location:
            locationInput.value.trim(),

        distance:
            distanceFilter.value,

        category:
            categoryFilter.value,

        minPrice:
            minPrice.value,

        maxPrice:
            maxPrice.value,

        conditions:
            selectedConditions,

        sort:
            sortFilter.value

    };

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyFilters() {

    readFilters();


    let filtered =
        [...filterProducts];


    /* LOCATION */

    if (currentFilters.location) {

        const searchLocation =
            currentFilters.location.toLowerCase();


        filtered =
            filtered.filter(product => {

                return (

                    product.location
                        .toLowerCase()
                        .includes(searchLocation)

                    ||

                    product.area
                        .toLowerCase()
                        .includes(searchLocation)

                );

            });

    }


    /* DISTANCE */

    if (currentFilters.distance !== "all") {

        const maxDistance =
            Number(currentFilters.distance);


        filtered =
            filtered.filter(product => {

                return product.distance <= maxDistance;

            });

    }


    /* CATEGORY */

    if (currentFilters.category !== "all") {

        filtered =
            filtered.filter(product => {

                return product.category ===
                    currentFilters.category;

            });

    }


    /* MIN PRICE */

    if (currentFilters.minPrice !== "") {

        const minimum =
            Number(currentFilters.minPrice);


        filtered =
            filtered.filter(product => {

                return product.price >= minimum;

            });

    }


    /* MAX PRICE */

    if (currentFilters.maxPrice !== "") {

        const maximum =
            Number(currentFilters.maxPrice);


        filtered =
            filtered.filter(product => {

                return product.price <= maximum;

            });

    }


    /* CONDITION */

    if (
        currentFilters.conditions.length > 0
    ) {

        filtered =
            filtered.filter(product => {

                return currentFilters.conditions
                    .includes(product.condition);

            });

    }


    /* SORT */

    filtered =
        sortProducts(
            filtered,
            currentFilters.sort
        );


    currentProducts =
        filtered;


    renderProducts(currentProducts);

    renderActiveFilters();

}


/* =========================================================
   SORT PRODUCTS
========================================================= */

function sortProducts(products, sortType) {

    const sorted =
        [...products];


    switch (sortType) {

        case "nearest":

            sorted.sort(
                (a, b) =>
                    a.distance - b.distance
            );

            break;


        case "price-low":

            sorted.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            sorted.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "newest":

            sorted.sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

            break;


        case "relevance":

        default:

            /*
                Nearby products first.
                Then cheaper distance.
            */

            sorted.sort(
                (a, b) =>
                    a.distance - b.distance
            );

            break;

    }


    return sorted;

}


/* =========================================================
   ACTIVE FILTERS
========================================================= */

function renderActiveFilters() {

    activeFilters.innerHTML = "";


    const tags = [];


    if (currentFilters.location) {

        tags.push({
            label:
                `📍 ${currentFilters.location}`,
            type: "location"
        });

    }


    if (
        currentFilters.distance !== "all"
    ) {

        tags.push({
            label:
                `Within ${currentFilters.distance} km`,
            type: "distance"
        });

    }


    if (
        currentFilters.category !== "all"
    ) {

        tags.push({
            label:
                currentFilters.category,
            type: "category"
        });

    }


    if (currentFilters.minPrice) {

        tags.push({
            label:
                `Min ${formatPrice(currentFilters.minPrice)}`,
            type: "minPrice"
        });

    }


    if (currentFilters.maxPrice) {

        tags.push({
            label:
                `Max ${formatPrice(currentFilters.maxPrice)}`,
            type: "maxPrice"
        });

    }


    currentFilters.conditions
        .forEach(condition => {

            tags.push({
                label: condition,
                type: "condition",
                value: condition
            });

        });


    tags.forEach(tag => {

        const element =
            document.createElement("div");

        element.className =
            "filter-tag";


        element.innerHTML = `

            <span>
                ${tag.label}
            </span>

            <button
                type="button"
                data-filter-type="${tag.type}"
                data-filter-value="${tag.value || ""}"
            >
                ×
            </button>

        `;


        activeFilters.appendChild(element);

    });


    updateFilterCount(tags.length);

    attachFilterTagEvents();

}


/* =========================================================
   FILTER COUNT
========================================================= */

function updateFilterCount(count) {

    activeFilterCount.textContent =
        `${count} filter${count === 1 ? "" : "s"}`;

}


/* =========================================================
   REMOVE FILTER TAG
========================================================= */

function attachFilterTagEvents() {

    document
        .querySelectorAll(".filter-tag button")
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const type =
                        this.getAttribute(
                            "data-filter-type"
                        );

                    const value =
                        this.getAttribute(
                            "data-filter-value"
                        );


                    removeFilter(type, value);

                }
            );

        });

}


/* =========================================================
   REMOVE FILTER
========================================================= */

function removeFilter(type, value) {

    switch (type) {

        case "location":

            locationInput.value = "";

            break;


        case "distance":

            distanceFilter.value = "all";

            break;


        case "category":

            categoryFilter.value = "all";

            break;


        case "minPrice":

            minPrice.value = "";

            break;


        case "maxPrice":

            maxPrice.value = "";

            break;


        case "condition":

            document
                .querySelectorAll(
                    'input[name="condition"]'
                )
                .forEach(checkbox => {

                    if (
                        checkbox.value === value
                    ) {

                        checkbox.checked = false;

                    }

                });

            break;

    }


    applyFilters();

}


/* =========================================================
   CLEAR ALL
========================================================= */

function clearAllFilters() {

    locationInput.value = "";

    distanceFilter.value = "all";

    categoryFilter.value = "all";

    minPrice.value = "";

    maxPrice.value = "";

    sortFilter.value = "relevance";


    document
        .querySelectorAll(
            'input[name="condition"]'
        )
        .forEach(checkbox => {

            checkbox.checked = false;

        });


    currentFilters = {

        location: "",
        distance: "all",
        category: "all",
        minPrice: "",
        maxPrice: "",
        conditions: [],
        sort: "relevance"

    };


    currentProducts =
        sortProducts(
            [...filterProducts],
            "relevance"
        );


    renderProducts(currentProducts);

    renderActiveFilters();

}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function detectLocation() {

    if (!navigator.geolocation) {

        alert(
            "Location is not supported by this browser."
        );

        return;

    }


    useLocationBtn.disabled = true;

    useLocationBtn.textContent =
        "📍 Detecting location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            /*
                Frontend stage:

                We use Agra as demo marketplace
                location.

                Later backend will use latitude
                and longitude to calculate exact
                nearby products.
            */

            currentLocation = "Agra";

            locationInput.value =
                currentLocation;


            useLocationBtn.disabled = false;

            useLocationBtn.textContent =
                "✓ Location Detected";


            applyFilters();

        },


        function(error) {

            console.log(error);


            useLocationBtn.disabled = false;

            useLocationBtn.textContent =
                "📍 Use My Current Location";


            alert(
                "Location permission nahi mili. Aap manually location enter kar sakte hain."
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

    );

}


/* =========================================================
   HEADER SEARCH
========================================================= */

function headerSearch() {

    const searchInput =
        document.getElementById(
            "headerSearch"
        );

    const searchButton =
        document.getElementById(
            "headerSearchBtn"
        );


    function performSearch() {

        const query =
            searchInput.value.trim();


        if (!query) {

            return;

        }


        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;

    }


    searchButton.addEventListener(
        "click",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


/* =========================================================
   LOCATION BUTTON
========================================================= */

function setupLocationButton() {

    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    if (!locationBtn) {

        return;

    }


    locationBtn.addEventListener(
        "click",
        detectLocation
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

applyFilterBtn.addEventListener(
    "click",
    applyFilters
);


clearAllBtn.addEventListener(
    "click",
    clearAllFilters
);


resetResultsBtn.addEventListener(
    "click",
    clearAllFilters
);


useLocationBtn.addEventListener(
    "click",
    detectLocation
);


sortFilter.addEventListener(
    "change",
    applyFilters
);


/* =========================================================
   INITIAL LOAD
========================================================= */

function initializeFilterPage() {

    /*
        Nearby-first default
    */

    currentProducts =
        sortProducts(
            [...filterProducts],
            "relevance"
        );


    renderProducts(
        currentProducts
    );


    renderActiveFilters();


    headerSearch();

    setupLocationButton();

}


initializeFilterPage();