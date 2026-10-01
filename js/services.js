/* =========================================
   AHD SERVICES
========================================= */


const serviceCategories = [

    {
        id: "home",
        name: "Home",
        icon: "🏠"
    },

    {
        id: "repair",
        name: "Repair",
        icon: "🔧"
    },

    {
        id: "education",
        name: "Education",
        icon: "📚"
    },

    {
        id: "professional",
        name: "Professional",
        icon: "💼"
    },

    {
        id: "beauty",
        name: "Beauty",
        icon: "💇"
    },

    {
        id: "events",
        name: "Events",
        icon: "📸"
    },

    {
        id: "transport",
        name: "Transport",
        icon: "🚚"
    },

    {
        id: "other",
        name: "Other",
        icon: "⚙️"
    }

];


const services = [

    {
        id: "S001",

        name:
            "Home Electrician",

        category:
            "home",

        categoryName:
            "Home",

        description:
            "Wiring, fan, switch, socket और electrical repair service.",

        provider:
            "Rakesh Kumar",

        location:
            "Agra",

        rating:
            4.8,

        reviews:
            126,

        price:
            299,

        image:
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S002",

        name:
            "Professional Plumbing",

        category:
            "home",

        categoryName:
            "Home",

        description:
            "Leakage, pipe fitting, tap और bathroom plumbing.",

        provider:
            "Suresh Plumbing",

        location:
            "Agra",

        rating:
            4.7,

        reviews:
            98,

        price:
            249,

        image:
            "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S003",

        name:
            "AC & Refrigerator Repair",

        category:
            "repair",

        categoryName:
            "Repair",

        description:
            "AC servicing, cooling problem और refrigerator repair.",

        provider:
            "CoolFix Services",

        location:
            "Agra",

        rating:
            4.6,

        reviews:
            83,

        price:
            399,

        image:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S004",

        name:
            "Maths Home Tutor",

        category:
            "education",

        categoryName:
            "Education",

        description:
            "School और college students के लिए mathematics tutoring.",

        provider:
            "Amit Sharma",

        location:
            "Agra",

        rating:
            4.9,

        reviews:
            74,

        price:
            500,

        image:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S005",

        name:
            "Website Developer",

        category:
            "professional",

        categoryName:
            "Professional",

        description:
            "Business website और web application development.",

        provider:
            "TechWeb Studio",

        location:
            "Agra",

        rating:
            4.8,

        reviews:
            61,

        price:
            2999,

        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S006",

        name:
            "Graphic Designer",

        category:
            "professional",

        categoryName:
            "Professional",

        description:
            "Logo, poster, banner और social media design.",

        provider:
            "Creative Hub",

        location:
            "Agra",

        rating:
            4.7,

        reviews:
            52,

        price:
            499,

        image:
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S007",

        name:
            "Photography Service",

        category:
            "events",

        categoryName:
            "Events",

        description:
            "Wedding, birthday और event photography.",

        provider:
            "Click Studio",

        location:
            "Agra",

        rating:
            4.9,

        reviews:
            112,

        price:
            4999,

        image:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S008",

        name:
            "Beauty & Makeup Artist",

        category:
            "beauty",

        categoryName:
            "Beauty",

        description:
            "Party makeup, bridal makeup और beauty services.",

        provider:
            "Neha Beauty Studio",

        location:
            "Agra",

        rating:
            4.8,

        reviews:
            87,

        price:
            999,

        image:
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S009",

        name:
            "Local Transport Service",

        category:
            "transport",

        categoryName:
            "Transport",

        description:
            "Local shifting और सामान transport service.",

        provider:
            "Agra Transport",

        location:
            "Agra",

        rating:
            4.5,

        reviews:
            45,

        price:
            799,

        image:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"

    },


    {
        id: "S010",

        name:
            "Laptop Repair",

        category:
            "repair",

        categoryName:
            "Repair",

        description:
            "Laptop hardware, software और Windows installation.",

        provider:
            "Computer Care",

        location:
            "Agra",

        rating:
            4.7,

        reviews:
            67,

        price:
            299,

        image:
            "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80"

    }

];


let currentCategory = "all";

let currentSearch = "";

let currentSort = "recommended";


/* =========================================
   INIT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeServices
);


async function initializeServices() {

    renderCategories();

    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getServices === "function") {
            const apiServices = await AHDApi.getServices();
            if (apiServices && apiServices.length > 0) {
                apiServices.forEach(as => {
                    if (!services.some(s => s.id === as.id || s.name === as.name)) {
                        services.unshift({
                            id: as.id,
                            name: as.name,
                            category: (as.category || "other").toLowerCase().includes("beauty") ? "beauty" :
                                      (as.category || "").toLowerCase().includes("electric") ? "home" :
                                      (as.category || "").toLowerCase().includes("plumb") ? "home" : "other",
                            categoryName: as.category || "Professional Service",
                            provider: as.providerName || "Verified Provider",
                            rating: as.rating || 4.8,
                            reviews: as.reviewsCount || 24,
                            price: as.price || 499,
                            location: as.location || "Agra, Uttar Pradesh",
                            description: as.description || "",
                            badges: ["Verified"]
                        });
                    }
                });
            }
        }
    } catch (_) {}

    renderServices();


    document
        .querySelectorAll(".service-filter")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    currentCategory =
                        this.dataset.filter;


                    document
                        .querySelectorAll(
                            ".service-filter"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    renderServices();

                }
            );

        });


    document
        .getElementById(
            "serviceSort"
        )
        .addEventListener(
            "change",
            function () {

                currentSort =
                    this.value;

                renderServices();

            }
        );


    document
        .getElementById(
            "serviceSearch"
        )
        .addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    searchServices();

                }

            }
        );

}


/* =========================================
   CATEGORIES
========================================= */

function renderCategories() {

    const container =
        document.getElementById(
            "serviceCategories"
        );


    container.innerHTML = "";


    serviceCategories.forEach(
        category => {

            container.insertAdjacentHTML(

                "beforeend",

                `

                <div
                    class="category-card"
                    onclick="selectCategory('${category.id}')"
                >

                    <div class="category-icon">
                        ${category.icon}
                    </div>

                    <strong>
                        ${escapeHTML(category.name)}
                    </strong>

                </div>

                `

            );

        }
    );

}


/* =========================================
   SELECT CATEGORY
========================================= */

function selectCategory(
    category
) {

    currentCategory =
        category;


    document
        .querySelectorAll(
            ".service-filter"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter ===
                    category
            );

        });


    renderServices();


    document
        .querySelector(".service-toolbar")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   SEARCH
========================================= */

function searchServices() {

    currentSearch =
        document
            .getElementById(
                "serviceSearch"
            )
            .value
            .toLowerCase()
            .trim();


    renderServices();

}


/* =========================================
   GET SERVICES
========================================= */

function getFilteredServices() {

    let result =
        [...services];


    if (
        currentCategory !==
        "all"
    ) {

        result =
            result.filter(
                service =>
                    service.category ===
                    currentCategory
            );

    }


    if (currentSearch) {

        result =
            result.filter(
                service => {

                    const text =
                        (
                            service.name +
                            " " +
                            service.categoryName +
                            " " +
                            service.provider +
                            " " +
                            service.location
                        ).toLowerCase();


                    return text.includes(
                        currentSearch
                    );

                }
            );

    }


    switch (
        currentSort
    ) {

        case "rating":

            result.sort(
                (a, b) =>
                    b.rating -
                    a.rating
            );

            break;


        case "priceLow":

            result.sort(
                (a, b) =>
                    a.price -
                    b.price
            );

            break;


        case "priceHigh":

            result.sort(
                (a, b) =>
                    b.price -
                    a.price
            );

            break;


        default:

            result.sort(
                (a, b) =>
                    b.rating -
                    a.rating
            );

    }


    return result;

}


/* =========================================
   RENDER SERVICES
========================================= */

function renderServices() {

    const grid =
        document.getElementById(
            "serviceGrid"
        );


    const empty =
        document.getElementById(
            "noServices"
        );


    const result =
        getFilteredServices();


    grid.innerHTML = "";


    if (
        result.length === 0
    ) {

        empty.classList.remove(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );


    result.forEach(
        service => {

            grid.insertAdjacentHTML(

                "beforeend",

                createServiceCard(
                    service
                )

            );

        }
    );

}


/* =========================================
   SERVICE CARD
========================================= */

function createServiceCard(
    service
) {

    const initials =
        getInitials(
            service.provider
        );


    return `

        <article
            class="service-card"
            onclick="openService('${service.id}')"
        >

            <img
                class="service-image"
                src="${escapeAttribute(service.image)}"
                alt="${escapeAttribute(service.name)}"
            >


            <div class="service-body">

                <span class="service-category">

                    ${escapeHTML(
                        service.categoryName
                    )}

                </span>


                <h3 class="service-name">

                    ${escapeHTML(
                        service.name
                    )}

                </h3>


                <p class="service-description">

                    ${escapeHTML(
                        service.description
                    )}

                </p>


                <div class="service-provider">

                    <div class="provider-avatar">

                        ${initials}

                    </div>


                    <div class="provider-info">

                        <strong>

                            ${escapeHTML(
                                service.provider
                            )}

                        </strong>

                        <span>

                            📍 ${escapeHTML(
                                service.location
                            )}

                        </span>

                    </div>


                    <div class="service-rating">

                        ★ ${service.rating}

                    </div>

                </div>


                <div class="service-footer">

                    <div class="service-price">

                        ₹${formatPrice(service.price)}

                        <small>
                            starting
                        </small>

                    </div>


                    <span class="view-service">

                        View Details →

                    </span>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   OPEN SERVICE
========================================= */

function openService(
    serviceId
) {

    window.location.href =
        `service-details.html?id=${encodeURIComponent(serviceId)}`;

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href =
        "home.html";

}


/* =========================================
   INITIALS
========================================= */

function getInitials(
    name
) {

    return name
        .split(" ")
        .slice(0, 2)
        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");

}


/* =========================================
   PRICE
========================================= */

function formatPrice(
    price
) {

    return Number(price)
        .toLocaleString(
            "en-IN"
        );

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(value);

}