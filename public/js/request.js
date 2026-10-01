/* =========================================
   AHD REQUEST MODULE
   ========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const requestForm =
    document.getElementById("requestForm");


/* Product */

const productImage =
    document.getElementById("requestProductImage");

const productName =
    document.getElementById("requestProductName");

const productCategory =
    document.getElementById("requestProductCategory");

const productCondition =
    document.getElementById("requestProductCondition");

const productLocation =
    document.getElementById("requestProductLocation");

const sellerName =
    document.getElementById("requestSellerName");

const originalPrice =
    document.getElementById("requestOriginalPrice");


/* Requirement */

const requiredProduct =
    document.getElementById("requiredProduct");

const requiredCategory =
    document.getElementById("requiredCategory");

const requiredCondition =
    document.getElementById("requiredCondition");

const maximumBudget =
    document.getElementById("maximumBudget");

const requiredQuantity =
    document.getElementById("requiredQuantity");

const requirementDetails =
    document.getElementById("requirementDetails");

const requirementCount =
    document.getElementById("requirementCount");

const preferredBrand =
    document.getElementById("preferredBrand");


/* Purchase Request */

const offerPrice =
    document.getElementById("offerPrice");

const quantity =
    document.getElementById("quantity");

const requestMessage =
    document.getElementById("requestMessage");

const messageCount =
    document.getElementById("messageCount");

const requestLocation =
    document.getElementById("requestLocation");

const detectLocation =
    document.getElementById("detectLocation");

const requestTerms =
    document.getElementById("requestTerms");

const messageBox =
    document.getElementById("requestMessageBox");

const cancelRequest =
    document.getElementById("cancelRequest");


/* =========================================
   GENERATE REQUEST ID
========================================= */

function generateRequestId() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "AHD-REQ-" + randomNumber;
}


/* =========================================
   GET PRODUCT DATA FROM URL
========================================= */

function getProductFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        id:
            params.get("id") || "",


        name:
            params.get("name") ||
            params.get("product") ||
            "AHD Marketplace Product",


        category:
            params.get("category") ||
            "General",


        condition:
            params.get("condition") ||
            "Used",


        price:
            parseFloat(
                params.get("price")
            ) || 0,


        location:
            params.get("location") ||
            "Agra, Uttar Pradesh",


        seller:
            params.get("seller") ||
            "AHD Seller",


        image:
            params.get("image") ||
            "https://via.placeholder.com/500x350?text=AHD+Product"

    };

}


/* =========================================
   LOAD PRODUCT
========================================= */

function loadProduct() {

    const product =
        getProductFromURL();


    productName.textContent =
        product.name;


    productCategory.textContent =
        product.category;


    productCondition.textContent =
        product.condition;


    productLocation.textContent =
        product.location;


    sellerName.textContent =
        product.seller;


    originalPrice.textContent =
        "₹" +
        Number(product.price).toFixed(2);


    if (product.image) {

        productImage.src =
            product.image;

    }


    /*
        Seller price ko offer price mein
        automatically suggest kar rahe hain.
    */

    if (product.price > 0) {

        offerPrice.value =
            Number(product.price)
                .toFixed(2);

    }


    /*
        Seller/product location ko default
        request location mein rakh rahe hain.
    */

    requestLocation.value =
        product.location;


    /*
        Agar product ki category
        requirement category mein available hai,
        to automatically select kar do.
    */

    const categoryExists =
        Array.from(
            requiredCategory.options
        ).some(
            option =>
                option.value === product.category
        );


    if (categoryExists) {

        requiredCategory.value =
            product.category;

    }

}


/* =========================================
   CHARACTER COUNTER
========================================= */

if (requirementDetails) {

    requirementDetails.addEventListener(
        "input",
        function () {

            requirementCount.textContent =
                requirementDetails.value.length;

        }
    );

}


if (requestMessage) {

    requestMessage.addEventListener(
        "input",
        function () {

            messageCount.textContent =
                requestMessage.value.length;

        }
    );

}


/* =========================================
   WHEN REQUIRED PRODUCT CHANGES
========================================= */

if (requiredProduct) {

    requiredProduct.addEventListener(
        "input",
        function () {

            /*
                Agar customer ne required product
                enter kiya hai aur message blank hai,
                to hum koi automatic text nahi daalenge.

                Customer ki actual requirement
                usi ke words mein rahegi.
            */

        }
    );

}


/* =========================================
   AUTO-SYNC QUANTITY
========================================= */

if (requiredQuantity && quantity) {

    requiredQuantity.addEventListener(
        "input",
        function () {

            const value =
                parseInt(
                    requiredQuantity.value
                );


            if (
                value &&
                value > 0
            ) {

                quantity.value =
                    value;

            }

        }
    );

}


/* =========================================
   AUTO-SYNC BUDGET / OFFER
========================================= */

if (maximumBudget && offerPrice) {

    maximumBudget.addEventListener(
        "input",
        function () {

            const budget =
                parseFloat(
                    maximumBudget.value
                );


            if (
                budget &&
                budget > 0
            ) {

                /*
                    Offer ko maximum budget se
                    zyada automatically nahi hone dete.
                */

                if (
                    parseFloat(
                        offerPrice.value
                    ) > budget
                ) {

                    offerPrice.value =
                        budget.toFixed(2);

                }

            }

        }
    );

}


/* =========================================
   DETECT LOCATION
========================================= */

if (detectLocation) {

    detectLocation.addEventListener(
        "click",
        function () {

            if (!navigator.geolocation) {

                showMessage(
                    "Location detection is not supported by this browser.",
                    "error"
                );

                return;

            }


            detectLocation.disabled =
                true;


            detectLocation.textContent =
                "Detecting...";


            navigator.geolocation.getCurrentPosition(

                function (position) {

                    const latitude =
                        position.coords.latitude
                            .toFixed(5);


                    const longitude =
                        position.coords.longitude
                            .toFixed(5);


                    requestLocation.value =
                        `Near me (${latitude}, ${longitude})`;


                    detectLocation.disabled =
                        false;


                    detectLocation.textContent =
                        "📍 Detect";


                    showMessage(
                        "Location detected successfully.",
                        "success"
                    );

                },


                function () {

                    detectLocation.disabled =
                        false;


                    detectLocation.textContent =
                        "📍 Detect";


                    showMessage(
                        "Location permission allow karke dobara try karein.",
                        "error"
                    );

                },


                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0

                }

            );

        }
    );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    messageBox.textContent =
        message;


    messageBox.className =
        "request-message-box " +
        type;

}


/* =========================================
   GET SELECTED RADIO
========================================= */

function getSelectedValue(
    selector
) {

    const element =
        document.querySelector(
            selector
        );


    return element
        ? element.value
        : "";

}


/* =========================================
   LOGIN CHECK
========================================= */

function checkLogin() {

    /*
        Current AHD auth system available
        ho to use karo.

        Agar AHDAuth available nahi hai,
        frontend development ko block nahi
        karenge.
    */

    if (
        window.AHDAuth &&
        typeof AHDAuth.isLoggedIn === "function"
    ) {

        return AHDAuth.isLoggedIn();

    }


    return true;

}


/* =========================================
   FORM SUBMIT
========================================= */

if (requestForm) {

    requestForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ================================
               LOGIN
            ================================= */

            if (!checkLogin()) {

                showMessage(
                    "Request send karne ke liye pehle login karein.",
                    "error"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html?redirect=request.html";

                    },
                    1000
                );


                return;

            }


            /* ================================
               GET VALUES
            ================================= */

            const customerNeed =
                requiredProduct.value.trim();


            const category =
                requiredCategory.value;


            const condition =
                requiredCondition.value;


            const budget =
                parseFloat(
                    maximumBudget.value
                );


            const requirementQuantity =
                parseInt(
                    requiredQuantity.value
                );


            const details =
                requirementDetails.value.trim();


            const brand =
                preferredBrand.value.trim();


            const offer =
                parseFloat(
                    offerPrice.value
                );


            const purchaseQuantity =
                parseInt(
                    quantity.value
                );


            const message =
                requestMessage.value.trim();


            const location =
                requestLocation.value.trim();


            const delivery =
                getSelectedValue(
                    'input[name="delivery"]:checked'
                );


            const contact =
                getSelectedValue(
                    'input[name="contact"]:checked'
                );


            /* ================================
               VALIDATION
            ================================= */

            if (!customerNeed) {

                showMessage(
                    "Please enter what you need.",
                    "error"
                );

                requiredProduct.focus();

                return;

            }


            if (!category) {

                showMessage(
                    "Please select the required category.",
                    "error"
                );

                requiredCategory.focus();

                return;

            }


            if (!condition) {

                showMessage(
                    "Please select your preferred condition.",
                    "error"
                );

                requiredCondition.focus();

                return;

            }


            if (
                !budget ||
                budget <= 0
            ) {

                showMessage(
                    "Please enter a valid maximum budget.",
                    "error"
                );

                maximumBudget.focus();

                return;

            }


            if (
                !requirementQuantity ||
                requirementQuantity < 1
            ) {

                showMessage(
                    "Required quantity minimum 1 honi chahiye.",
                    "error"
                );

                requiredQuantity.focus();

                return;

            }


            if (!details) {

                showMessage(
                    "Please describe your requirement.",
                    "error"
                );

                requirementDetails.focus();

                return;

            }


            if (
                !offer ||
                offer <= 0
            ) {

                showMessage(
                    "Please enter a valid offer price.",
                    "error"
                );

                offerPrice.focus();

                return;

            }


            if (
                offer > budget
            ) {

                showMessage(
                    "Offer price maximum budget se zyada nahi ho sakta.",
                    "error"
                );

                offerPrice.focus();

                return;

            }


            if (
                !purchaseQuantity ||
                purchaseQuantity < 1
            ) {

                showMessage(
                    "Purchase quantity minimum 1 honi chahiye.",
                    "error"
                );

                quantity.focus();

                return;

            }


            if (!location) {

                showMessage(
                    "Please enter your location.",
                    "error"
                );

                requestLocation.focus();

                return;

            }


            if (!delivery) {

                showMessage(
                    "Please select delivery preference.",
                    "error"
                );

                return;

            }


            if (!contact) {

                showMessage(
                    "Please select contact preference.",
                    "error"
                );

                return;

            }


            if (!requestTerms.checked) {

                showMessage(
                    "Please accept the confirmation before sending request.",
                    "error"
                );

                return;

            }


            /* ================================
               PRODUCT DATA
            ================================= */

            const product =
                getProductFromURL();


            /* ================================
               REQUEST OBJECT
            ================================= */

            const request = {

                /* Request */

                requestId:
                    generateRequestId(),

                status:
                    "Pending",

                createdAt:
                    new Date().toISOString(),


                /* =========================
                   CUSTOMER REQUIREMENT
                ========================== */

                requirement: {

                    product:
                        customerNeed,

                    category:
                        category,

                    preferredCondition:
                        condition,

                    maximumBudget:
                        Number(budget),

                    quantity:
                        requirementQuantity,

                    details:
                        details,

                    preferredBrand:
                        brand

                },


                /* =========================
                   PRODUCT
                ========================== */

                product: {

                    id:
                        product.id,

                    name:
                        product.name,

                    category:
                        product.category,

                    condition:
                        product.condition,

                    price:
                        Number(product.price),

                    image:
                        product.image,

                    location:
                        product.location,

                    seller:
                        product.seller

                },


                /* =========================
                   PURCHASE REQUEST
                ========================== */

                purchaseRequest: {

                    offerPrice:
                        Number(offer),

                    quantity:
                        purchaseQuantity,

                    message:
                        message,

                    buyerLocation:
                        location,

                    delivery:
                        delivery,

                    contact:
                        contact

                }

            };


            /* ================================
               PERSIST REQUEST (API + IndexedDB)
               NO localStorage
               NO sessionStorage
            ================================= */

            if (window.AHDApi && typeof window.AHDApi.createRequest === "function") {
                await window.AHDApi.createRequest(request);
            }

            window.AHDCurrentRequest =
                request;


            /* ================================
               SUCCESS MESSAGE
            ================================= */

            showMessage(
                `Request ${request.requestId} successfully created. Matching process starting...`,
                "success"
            );


            /* ================================
               DISABLE BUTTON
            ================================= */

            const submitButton =
                requestForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.textContent =
                    "Finding Matches...";

            }


            /* ================================
               GO TO MATCHES
            ================================= */

            const matchesURL =
                "matches.html" +
                "?requestId=" +
                encodeURIComponent(
                    request.requestId
                );


            setTimeout(
                function () {

                    window.location.href =
                        matchesURL;

                },
                1000
            );

        }
    );

}


/* =========================================
   CANCEL REQUEST
========================================= */

if (cancelRequest) {

    cancelRequest.addEventListener(
        "click",
        function () {

            const shouldCancel =
                window.confirm(
                    "Kya aap request cancel karna chahte hain?"
                );


            if (shouldCancel) {

                window.history.back();

            }

        }
    );

}


/* =========================================
   INITIALIZE PAGE
========================================= */

loadProduct();