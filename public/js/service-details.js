/* =========================================
   AHD SERVICE DETAILS
========================================= */


/* =========================================
   SERVICE DATA
========================================= */

const SERVICES = [

    {
        id: "S001",

        title: "Home Electrician",

        category: "Home",

        categoryLabel: "Home Services",

        provider: "Rakesh Kumar",

        location: "Agra",

        price: 299,

        rating: 4.8,

        reviews: 124,

        image:
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional electrician service for home electrical problems, installations and repairs. Get reliable and experienced electrical support at your location.",

        included: [
            "Electrical inspection",
            "Switch and socket repair",
            "Fan installation",
            "Light installation",
            "Basic wiring work",
            "Electrical troubleshooting"
        ]
    },


    {
        id: "S002",

        title: "Professional Plumbing",

        category: "Home",

        categoryLabel: "Home Services",

        provider: "Suresh Plumbing",

        location: "Agra",

        price: 249,

        rating: 4.7,

        reviews: 98,

        image:
            "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80",

        description:
            "Experienced plumbing service for leakage, pipe, tap, bathroom and water supply problems.",

        included: [
            "Leakage inspection",
            "Tap repair",
            "Pipe repair",
            "Drainage checking",
            "Bathroom plumbing",
            "Water supply troubleshooting"
        ]
    },


    {
        id: "S003",

        title: "AC & Refrigerator Repair",

        category: "Repair",

        categoryLabel: "Repair Services",

        provider: "CoolFix Services",

        location: "Agra",

        price: 399,

        rating: 4.6,

        reviews: 87,

        image:
            "https://images.unsplash.com/photo-1631545806609-4c5d8d4c2c0d?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional AC and refrigerator repair service with doorstep inspection and troubleshooting.",

        included: [
            "AC inspection",
            "Refrigerator inspection",
            "Cooling problem diagnosis",
            "Basic repair",
            "Gas leakage inspection",
            "Electrical checking"
        ]
    },


    {
        id: "S004",

        title: "Maths Home Tutor",

        category: "Education",

        categoryLabel: "Education",

        provider: "Amit Sharma",

        location: "Agra",

        price: 500,

        rating: 4.9,

        reviews: 76,

        image:
            "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",

        description:
            "Personalized mathematics tutoring for school students with concept-focused learning and regular practice.",

        included: [
            "Personalized classes",
            "Concept explanation",
            "Practice questions",
            "Doubt solving",
            "Homework support",
            "Test preparation"
        ]
    },


    {
        id: "S005",

        title: "Website Developer",

        category: "Professional",

        categoryLabel: "Professional Services",

        provider: "TechWeb Studio",

        location: "Agra",

        price: 2999,

        rating: 4.8,

        reviews: 63,

        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional website development service for businesses, portfolios, startups and personal projects.",

        included: [
            "Responsive website",
            "Modern UI",
            "HTML/CSS development",
            "JavaScript functionality",
            "Mobile optimization",
            "Basic deployment support"
        ]
    },


    {
        id: "S006",

        title: "Graphic Designer",

        category: "Professional",

        categoryLabel: "Professional Services",

        provider: "Creative Hub",

        location: "Agra",

        price: 499,

        rating: 4.7,

        reviews: 91,

        image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",

        description:
            "Creative graphic design services for social media, business branding, posters and promotional material.",

        included: [
            "Social media design",
            "Poster design",
            "Banner design",
            "Business graphics",
            "Revision support",
            "High-quality files"
        ]
    },


    {
        id: "S007",

        title: "Photography Service",

        category: "Professional",

        categoryLabel: "Professional Services",

        provider: "Click Studio",

        location: "Agra",

        price: 4999,

        rating: 4.9,

        reviews: 54,

        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional photography service for events, products, portraits and special occasions.",

        included: [
            "Professional photographer",
            "Event photography",
            "Portrait photography",
            "Edited photographs",
            "Digital delivery",
            "Basic photo retouching"
        ]
    },


    {
        id: "S008",

        title: "Beauty & Makeup Artist",

        category: "Home",

        categoryLabel: "Home Services",

        provider: "Neha Beauty Studio",

        location: "Agra",

        price: 999,

        rating: 4.8,

        reviews: 112,

        image:
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional beauty and makeup services available at your preferred location.",

        included: [
            "Basic makeup",
            "Hair styling",
            "Skin preparation",
            "Event makeup",
            "Beauty consultation",
            "Touch-up support"
        ]
    },


    {
        id: "S009",

        title: "Local Transport Service",

        category: "Professional",

        categoryLabel: "Professional Services",

        provider: "Agra Transport",

        location: "Agra",

        price: 799,

        rating: 4.6,

        reviews: 45,

        image:
            "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",

        description:
            "Reliable local transportation service for goods, household shifting and local deliveries.",

        included: [
            "Local transport",
            "Goods movement",
            "Small shifting",
            "Pickup service",
            "Delivery support",
            "Loading assistance"
        ]
    },


    {
        id: "S010",

        title: "Laptop Repair",

        category: "Repair",

        categoryLabel: "Repair Services",

        provider: "Computer Care",

        location: "Agra",

        price: 299,

        rating: 4.7,

        reviews: 88,

        image:
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",

        description:
            "Professional laptop repair and troubleshooting service for hardware and software problems.",

        included: [
            "Laptop diagnosis",
            "Software troubleshooting",
            "Hardware inspection",
            "OS installation",
            "Performance checking",
            "Basic repair"
        ]
    }

];


/* =========================================
   GLOBAL
========================================= */

let currentService = null;


/* =========================================
   DOM READY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadService();

    setupEvents();

});


/* =========================================
   GET SERVICE ID
========================================= */

function getServiceId() {

    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("id");

}


/* =========================================
   LOAD SERVICE
========================================= */

function loadService() {

    const serviceId = getServiceId();

    currentService = SERVICES.find(
        service => service.id === serviceId
    );


    if (!currentService) {

        showNotFound();

        return;
    }


    renderService(currentService);

}


/* =========================================
   RENDER SERVICE
========================================= */

function renderService(service) {

    document
        .getElementById("loadingState")
        .classList.add("hidden");


    document
        .getElementById("notFoundState")
        .classList.add("hidden");


    document
        .getElementById("serviceContent")
        .classList.remove("hidden");


    /* Image */

    document
        .getElementById("serviceImage")
        .src = service.image;


    document
        .getElementById("serviceImage")
        .alt = service.title;


    /* Category */

    document
        .getElementById("serviceCategoryBadge")
        .textContent = service.categoryLabel;


    document
        .getElementById("serviceCategory")
        .textContent = service.categoryLabel;


    /* Title */

    document
        .getElementById("serviceTitle")
        .textContent = service.title;


    /* Rating */

    document
        .getElementById("serviceRating")
        .textContent = service.rating;


    document
        .getElementById("serviceReviews")
        .textContent =
            `(${service.reviews} reviews)`;


    /* Provider */

    document
        .getElementById("providerName")
        .textContent = service.provider;


    document
        .getElementById("providerLocation")
        .textContent = service.location;


    document
        .getElementById("providerAvatar")
        .textContent =
            getInitials(service.provider);


    /* Price */

    document
        .getElementById("servicePrice")
        .textContent =
            formatPrice(service.price);


    /* Description */

    document
        .getElementById("serviceDescription")
        .textContent =
            service.description;


    /* Location */

    document
        .getElementById("serviceLocation")
        .textContent =
            service.location;


    /* Breadcrumb */

    document
        .getElementById("breadcrumbService")
        .textContent =
            service.title;


    /* Included */

    const includedList =
        document.getElementById("includedList");

    includedList.innerHTML = "";

    service.included.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        includedList.appendChild(li);

    });

}


/* =========================================
   EVENTS
========================================= */

function setupEvents() {

    const bookButton =
        document.getElementById(
            "bookServiceButton"
        );

    const messageButton =
        document.getElementById(
            "messageProviderButton"
        );

    const providerButton =
        document.getElementById(
            "viewProviderButton"
        );


    bookButton.addEventListener(
        "click",
        openBookingModal
    );


    messageButton.addEventListener(
        "click",
        messageProvider
    );


    providerButton.addEventListener(
        "click",
        viewProvider
    );


    /* Modal */

    document
        .getElementById("closeBookingModal")
        .addEventListener(
            "click",
            closeBookingModal
        );


    document
        .getElementById("modalOverlay")
        .addEventListener(
            "click",
            closeBookingModal
        );


    document
        .getElementById("bookingForm")
        .addEventListener(
            "submit",
            submitBooking
        );

}


/* =========================================
   BOOKING MODAL
========================================= */

function openBookingModal() {

    if (!currentService) {
        return;
    }


    /*
        Login check.

        Agar auth.js available hai
        aur user logged in nahi hai,
        to login page par bhejenge.
    */

    if (
        window.AHDAuth &&
        typeof AHDAuth.isLoggedIn === "function" &&
        !AHDAuth.isLoggedIn()
    ) {

        const redirect =
            `service-details.html?id=${encodeURIComponent(currentService.id)}`;

        window.location.href =
            `login.html?redirect=${encodeURIComponent(redirect)}`;

        return;
    }


    document
        .getElementById("bookingModal")
        .classList.remove("hidden");


    document
        .getElementById("bookingRequirement")
        .focus();

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeBookingModal() {

    document
        .getElementById("bookingModal")
        .classList.add("hidden");

}


/* =========================================
   SUBMIT BOOKING
========================================= */

function submitBooking(event) {

    event.preventDefault();


    const requirement =
        document
            .getElementById("bookingRequirement")
            .value
            .trim();


    const date =
        document
            .getElementById("bookingDate")
            .value;


    const time =
        document
            .getElementById("bookingTime")
            .value;


    const location =
        document
            .getElementById("bookingLocation")
            .value
            .trim();


    const phone =
        document
            .getElementById("bookingPhone")
            .value
            .trim();


    const message =
        document.getElementById(
            "bookingMessage"
        );


    if (!requirement ||
        !date ||
        !time ||
        !location ||
        !phone) {

        message.textContent =
            "Please fill all required details.";

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        message.textContent =
            "Please enter a valid 10 digit mobile number.";

        return;
    }


    /*
        Temporary frontend booking object.

        Backend/database later connect hoga.
    */

    const booking = {

        bookingId:
            "BOOK-" +
            Date.now(),

        status:
            "Pending",

        createdAt:
            new Date().toISOString(),

        service: {

            id: currentService.id,

            title: currentService.title,

            provider:
                currentService.provider,

            price:
                currentService.price,

            location:
                currentService.location

        },

        customerRequirement:
            requirement,

        preferredDate:
            date,

        preferredTime:
            time,

        customerLocation:
            location,

        customerPhone:
            phone

    };


    /*
        No localStorage/sessionStorage.

        Temporary current-page/browser-memory state.
    */

    window.AHDCurrentServiceBooking =
        booking;


    message.textContent =
        "Booking request created successfully.";


    message.style.color =
        "green";


    /*
        Future flow:

        Service Request
              ↓
        Provider Match
              ↓
        Deal / Booking
    */


    setTimeout(() => {

        alert(
            "Service booking request sent successfully!"
        );

        closeBookingModal();

    }, 700);

}


/* =========================================
   MESSAGE PROVIDER
========================================= */

function messageProvider() {

    if (!currentService) {
        return;
    }


    window.location.href =
        `messages.html?seller=${encodeURIComponent(
            currentService.provider
        )}&product=${encodeURIComponent(
            currentService.title
        )}`;

}


/* =========================================
   VIEW PROVIDER
========================================= */

function viewProvider() {

    if (!currentService) {
        return;
    }


    window.location.href =
        `seller-profile.html?seller=${encodeURIComponent(
            currentService.provider
        )}`;

}


/* =========================================
   NOT FOUND
========================================= */

function showNotFound() {

    document
        .getElementById("loadingState")
        .classList.add("hidden");


    document
        .getElementById("serviceContent")
        .classList.add("hidden");


    document
        .getElementById("notFoundState")
        .classList.remove("hidden");

}


/* =========================================
   HELPERS
========================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");

}


function getInitials(name) {

    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

}