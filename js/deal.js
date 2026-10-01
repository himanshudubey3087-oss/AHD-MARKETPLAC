"use strict";

/* =========================================================
   AHD DEAL SYSTEM
   ========================================================= */

let currentDeal = null;
let selectedRating = 0;


/* =========================================================
   DEMO DEAL
   ========================================================= */

const demoDeal = {

    dealId: "AHD-DEMO-001",

    type: "worker",

    status: "Accepted",

    createdAt: "24 Aug 2026",

    customer: {
        name: "You"
    },

    person: {
        id: "W001",
        name: "Rajesh Kumar",
        role: "Electrician",
        location: "Agra, Uttar Pradesh",
        rating: 4.8,
        image: "https://i.pravatar.cc/150?img=12"
    },

    work: {
        title: "Home Electrical Repair",
        location: "Agra",
        date: "25 Aug 2026",
        duration: "2-3 Hours",
        budget: 1500,
        description:
            "Fan wiring aur switch board repair karwana hai."
    }
};


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadDeal();

    setupRatingButtons();

});


/* =========================================================
   LOAD DEAL
   ========================================================= */

function loadDeal() {

    const params =
        new URLSearchParams(window.location.search);


    /*
     * Worker Deal
     */

    if (
        params.get("workerId") ||
        params.get("workerName")
    ) {

        currentDeal = {

            dealId:
                params.get("dealId") ||
                params.get("requestId") ||
                createDealId(),

            type: "worker",

            /*
             * Important:
             * URL se Accepted aaye to Accepted.
             * Otherwise demo ke liye Accepted.
             */

            status:
                params.get("status") ||
                "Accepted",

            createdAt:
                getTodayDate(),

            customer: {
                name: "You"
            },

            person: {

                id:
                    params.get("workerId") ||
                    "W001",

                name:
                    params.get("workerName") ||
                    "Worker",

                role:
                    params.get("workerRole") ||
                    "Professional Worker",

                location:
                    params.get("location") ||
                    "Agra",

                rating:
                    Number(params.get("rating")) ||
                    4.8,

                image:
                    params.get("avatar") ||
                    "https://i.pravatar.cc/150?img=12"
            },

            work: {

                title:
                    params.get("workTitle") ||
                    params.get("work") ||
                    "Work Requirement",

                location:
                    params.get("location") ||
                    "Agra",

                date:
                    params.get("workDate") ||
                    "Not specified",

                duration:
                    params.get("duration") ||
                    "Not specified",

                budget:
                    cleanAmount(
                        params.get("budget")
                    ),

                description:
                    params.get("details") ||
                    params.get("description") ||
                    "Work details not provided."
            }

        };

    }


    /*
     * Product Deal
     */

    else if (
        params.get("type") === "product" ||
        params.get("productId") ||
        params.get("product")
    ) {

        currentDeal = {

            dealId:
                params.get("dealId") ||
                params.get("requestId") ||
                createDealId(),

            type: "product",

            status:
                params.get("status") ||
                "Accepted",

            createdAt:
                getTodayDate(),

            customer: {
                name: "You"
            },

            person: {

                id:
                    params.get("sellerId") ||
                    "SELLER001",

                name:
                    params.get("sellerName") ||
                    "Seller",

                role: "Seller",

                location:
                    params.get("location") ||
                    "Agra",

                rating:
                    Number(params.get("rating")) ||
                    4.7,

                image:
                    params.get("avatar") ||
                    "https://i.pravatar.cc/150?img=11"
            },

            product: {

                id:
                    params.get("productId") ||
                    "PRODUCT001",

                title:
                    params.get("product") ||
                    "Product",

                location:
                    params.get("location") ||
                    "Agra",

                price:
                    cleanAmount(
                        params.get("price")
                    ),

                quantity:
                    params.get("quantity") ||
                    "1",

                description:
                    params.get("description") ||
                    "Product details not provided."
            }

        };

    }


    /*
     * No URL data
     */

    else {

        currentDeal = {

            ...demoDeal,

            work: {
                ...demoDeal.work
            },

            person: {
                ...demoDeal.person
            },

            customer: {
                ...demoDeal.customer
            }

        };

    }


    renderDeal();

}


/* =========================================================
   RENDER DEAL
   ========================================================= */

function renderDeal() {

    if (!currentDeal) {
        return;
    }


    /* Deal ID */

    setText(
        "dealId",
        currentDeal.dealId
    );


    /* Deal Type */

    setText(
        "dealType",
        currentDeal.type === "worker"
            ? "Worker Deal"
            : "Product Deal"
    );


    /* Customer */

    setText(
        "customerName",
        currentDeal.customer.name
    );


    /* Person */

    setText(
        "personName",
        currentDeal.person.name
    );

    setText(
        "personRole",
        currentDeal.person.role
    );

    setText(
        "personLocation",
        "📍 " +
        currentDeal.person.location
    );

    setText(
        "personRating",
        currentDeal.person.rating
    );


    const personImage =
        document.getElementById(
            "personImage"
        );


    if (personImage) {

        personImage.src =
            currentDeal.person.image;

    }


    /* =====================================================
       WORKER DEAL
       ===================================================== */

    if (
        currentDeal.type === "worker"
    ) {

        setText(
            "personSectionTitle",
            "👷 Worker Details"
        );

        setText(
            "detailsHeading",
            "📋 Work Details"
        );

        setText(
            "dealRequirement",
            currentDeal.work.title
        );

        setText(
            "dealLocation",
            currentDeal.work.location
        );

        setText(
            "dealDate",
            currentDeal.work.date
        );

        setText(
            "dealDuration",
            currentDeal.work.duration
        );

        setText(
            "dealDescription",
            currentDeal.work.description
        );

        setText(
            "agreedAmount",
            formatMoney(
                currentDeal.work.budget
            )
        );

    }


    /* =====================================================
       PRODUCT DEAL
       ===================================================== */

    else {

        setText(
            "personSectionTitle",
            "👤 Seller Details"
        );

        setText(
            "detailsHeading",
            "📦 Product Details"
        );

        setText(
            "dealRequirement",
            currentDeal.product.title
        );

        setText(
            "dealLocation",
            currentDeal.product.location
        );

        setText(
            "dealDate",
            "As agreed with seller"
        );

        setText(
            "dealDuration",
            "Product Delivery"
        );

        setText(
            "dealDescription",
            currentDeal.product.description
        );

        setText(
            "agreedAmount",
            formatMoney(
                currentDeal.product.price
            )
        );

    }


    setText(
        "createdAt",
        currentDeal.createdAt
    );


    updateDealStatus(
        currentDeal.status
    );

}


/* =========================================================
   UPDATE DEAL STATUS
   ========================================================= */

function updateDealStatus(status) {

    if (!currentDeal) {
        return;
    }


    currentDeal.status = status;


    setText(
        "dealStatus",
        getReadableStatus(status)
    );


    const startButton =
        document.getElementById(
            "startDealBtn"
        );

    const completeButton =
        document.getElementById(
            "completeDealBtn"
        );

    const cancelButton =
        document.getElementById(
            "cancelDealBtn"
        );

    const reviewSection =
        document.getElementById(
            "reviewSection"
        );


    /*
     * Remove old progress states
     */

    const steps =
        document.querySelectorAll(
            ".progress-step"
        );


    steps.forEach(function (step) {

        step.classList.remove(
            "active",
            "completed"
        );

    });


    /* =====================================================
       PENDING
       ===================================================== */

    if (
        status === "Pending" ||
        status === "Created" ||
        status === "Pending Worker Response"
    ) {

        markStep(0);


        /*
         * Start Work ENABLED
         * because frontend demo system
         */

        if (startButton) {

            startButton.disabled = false;

        }


        if (completeButton) {

            completeButton.disabled = true;

        }

    }


    /* =====================================================
       ACCEPTED
       ===================================================== */

    else if (
        status === "Accepted"
    ) {

        markStep(0);
        markStep(1);


        if (startButton) {

            startButton.disabled = false;

        }


        if (completeButton) {

            completeButton.disabled = true;

        }

    }


    /* =====================================================
       IN PROGRESS
       ===================================================== */

    else if (
        status === "In Progress"
    ) {

        markStep(0);
        markStep(1);
        markStep(2);


        if (startButton) {

            startButton.disabled = true;

        }


        if (completeButton) {

            completeButton.disabled = false;

        }

    }


    /* =====================================================
       COMPLETED
       ===================================================== */

    else if (
        status === "Completed"
    ) {

        markStep(0);
        markStep(1);
        markStep(2);
        markStep(3);


        if (startButton) {

            startButton.disabled = true;

        }


        if (completeButton) {

            completeButton.disabled = true;

        }


        if (cancelButton) {

            cancelButton.disabled = true;

        }


        if (reviewSection) {

            reviewSection.style.display =
                "block";

        }

    }


    /* =====================================================
       CANCELLED
       ===================================================== */

    else if (
        status === "Cancelled"
    ) {

        if (startButton) {

            startButton.disabled = true;

        }


        if (completeButton) {

            completeButton.disabled = true;

        }


        if (cancelButton) {

            cancelButton.disabled = true;

        }

    }

}


/* =========================================================
   START WORK
   ========================================================= */

function startDeal() {

    console.log(
        "Start Work clicked"
    );


    if (!currentDeal) {

        alert(
            "Deal load nahi hua."
        );

        return;

    }


    /*
     * Pending ya Accepted dono mein
     * Start Work allowed hai.
     */

    if (
        currentDeal.status !== "Accepted" &&
        currentDeal.status !== "Pending" &&
        currentDeal.status !== "Created"
    ) {

        alert(
            "Is deal ko ab start nahi kiya ja sakta."
        );

        return;

    }


    const confirmStart =
        window.confirm(
            "Kya aap confirm karte hain ki work start karna hai?"
        );


    if (!confirmStart) {

        return;

    }


    currentDeal.status =
        "In Progress";


    updateDealStatus(
        "In Progress"
    );


    alert(
        "✓ Work successfully started!"
    );

}


/* =========================================================
   MARK COMPLETED
   ========================================================= */

function completeDeal() {

    console.log(
        "Mark Completed clicked"
    );


    if (!currentDeal) {

        alert(
            "Deal load nahi hua."
        );

        return;

    }


    if (
        currentDeal.status !== "In Progress"
    ) {

        alert(
            "Pehle Start Work par click karein."
        );

        return;

    }


    const confirmComplete =
        window.confirm(
            "Kya aap confirm karte hain ki work complete ho gaya hai?"
        );


    if (!confirmComplete) {

        return;

    }


    currentDeal.status =
        "Completed";


    updateDealStatus(
        "Completed"
    );


    alert(
        "✓ Deal successfully completed!"
    );

}


/* =========================================================
   CANCEL DEAL
   ========================================================= */

function cancelDeal() {

    if (!currentDeal) {
        return;
    }


    if (
        currentDeal.status === "Completed" ||
        currentDeal.status === "Cancelled"
    ) {

        return;

    }


    const reason =
        window.prompt(
            "Deal cancel karne ka reason likhein:"
        );


    if (reason === null) {
        return;
    }


    currentDeal.cancelReason =
        reason ||
        "No reason provided";


    currentDeal.status =
        "Cancelled";


    updateDealStatus(
        "Cancelled"
    );


    alert(
        "Deal cancelled."
    );

}


/* =========================================================
   OPEN CHAT
   ========================================================= */

function openChat() {

    if (!currentDeal) {
        return;
    }


    const params =
        new URLSearchParams();


    if (
        currentDeal.type === "worker"
    ) {

        params.set(
            "workerId",
            currentDeal.person.id
        );

        params.set(
            "workerName",
            currentDeal.person.name
        );

        params.set(
            "workerRole",
            currentDeal.person.role
        );

        params.set(
            "type",
            "worker-chat"
        );

    }

    else {

        params.set(
            "sellerId",
            currentDeal.person.id
        );

        params.set(
            "seller",
            currentDeal.person.name
        );

        params.set(
            "product",
            currentDeal.product.title
        );

        params.set(
            "type",
            "seller-chat"
        );

    }


    window.location.href =
        "messages.html?" +
        params.toString();

}


/* =========================================================
   OPEN PROFILE
   ========================================================= */

function openPersonProfile() {

    if (!currentDeal) {
        return;
    }


    if (
        currentDeal.type === "worker"
    ) {

        window.location.href =
            "worker-profile.html?workerId=" +
            encodeURIComponent(
                currentDeal.person.id
            );

    }

    else {

        window.location.href =
            "seller-profile.html?sellerId=" +
            encodeURIComponent(
                currentDeal.person.id
            );

    }

}


/* =========================================================
   RATING
   ========================================================= */

function setupRatingButtons() {

    const buttons =
        document.querySelectorAll(
            ".rating-selector button"
        );


    buttons.forEach(
        function (button, index) {

            button.addEventListener(
                "click",
                function () {

                    selectRating(
                        index + 1
                    );

                }
            );

        }
    );

}


function selectRating(rating) {

    selectedRating =
        Number(rating);


    const buttons =
        document.querySelectorAll(
            ".rating-selector button"
        );


    buttons.forEach(
        function (button, index) {

            if (
                index < selectedRating
            ) {

                button.classList.add(
                    "selected"
                );

            }

            else {

                button.classList.remove(
                    "selected"
                );

            }

        }
    );

}


/* =========================================================
   SUBMIT REVIEW
   ========================================================= */

function submitReview() {

    if (
        selectedRating === 0
    ) {

        alert(
            "Please rating select karein."
        );

        return;

    }


    const reviewInput =
        document.getElementById(
            "reviewText"
        );


    const reviewText =
        reviewInput
            ? reviewInput.value.trim()
            : "";


    if (!reviewText) {

        alert(
            "Please review likhein."
        );

        return;

    }


    const review = {

        dealId:
            currentDeal.dealId,

        rating:
            selectedRating,

        review:
            reviewText,

        createdAt:
            new Date().toISOString()

    };


    console.log(
        "AHD REVIEW:",
        review
    );


    alert(
        "⭐ Thank you! Your review has been submitted."
    );


    if (reviewInput) {

        reviewInput.value = "";

    }

}


/* =========================================================
   SUPPORT
   ========================================================= */

function contactSupport() {

    alert(
        "AHD Support module next step mein connect kiya jayega."
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function performSearch() {

    const searchInput =
        document.getElementById(
            "globalSearch"
        );


    if (!searchInput) {
        return;
    }


    const query =
        searchInput.value.trim();


    if (!query) {

        window.location.href =
            "search.html";

        return;

    }


    window.location.href =
        "search.html?q=" +
        encodeURIComponent(
            query
        );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function goToSell() {

    window.location.href =
        "sell.html";

}


function goToAccount() {

    window.location.href =
        "account.html";

}


/* =========================================================
   PROGRESS STEP
   ========================================================= */

function markStep(index) {

    const steps =
        document.querySelectorAll(
            ".progress-step"
        );


    steps.forEach(
        function (step, i) {

            if (i < index) {

                step.classList.add(
                    "completed"
                );

            }

            else if (i === index) {

                step.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================================
   MONEY
   ========================================================= */

function cleanAmount(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const cleaned =
        String(value)
            .replace(/[₹,\s]/g, "");


    const number =
        parseFloat(cleaned);


    if (
        Number.isFinite(number)
    ) {

        return number;

    }


    return 0;

}


function formatMoney(amount) {

    return (
        "₹" +
        cleanAmount(amount)
            .toLocaleString("en-IN")
    );

}


/* =========================================================
   DEAL ID
   ========================================================= */

function createDealId() {

    return (
        "AHD-" +
        Date.now()
            .toString()
            .slice(-8)
    );

}


/* =========================================================
   DATE
   ========================================================= */

function getTodayDate() {

    return new Date()
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================================================
   READABLE STATUS
   ========================================================= */

function getReadableStatus(status) {

    const statusMap = {

        "Pending":
            "Pending",

        "Created":
            "Created",

        "Pending Worker Response":
            "Waiting for Worker",

        "Accepted":
            "Accepted",

        "In Progress":
            "In Progress",

        "Completed":
            "Completed",

        "Cancelled":
            "Cancelled"

    };


    return (
        statusMap[status] ||
        status ||
        "Pending"
    );

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.startDeal =
    startDeal;

window.completeDeal =
    completeDeal;

window.cancelDeal =
    cancelDeal;

window.openChat =
    openChat;

window.openPersonProfile =
    openPersonProfile;

window.selectRating =
    selectRating;

window.submitReview =
    submitReview;

window.contactSupport =
    contactSupport;

window.performSearch =
    performSearch;

window.goToSell =
    goToSell;

window.goToAccount =
    goToAccount;