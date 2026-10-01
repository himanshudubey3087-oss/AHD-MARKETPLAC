/* =========================================
   AHD PRODUCT DETAILS
========================================= */


/*
   IMPORTANT:

   फिलहाल backend नहीं है इसलिए frontend
   testing के लिए products यहाँ रखे गए हैं।

   बाद में यही data API/database से आएगा।

   localStorage और sessionStorage का इस्तेमाल
   नहीं किया गया है।
*/


const ahdProducts = [

    {
        id: 1,

        name: "iPhone 13 128GB",

        price: 42000,

        category: "Mobiles",

        condition: "Like New",

        location: "Agra, Uttar Pradesh",

        posted: "Today",

        description:
            "iPhone 13 128GB excellent condition में है।\n\n" +
            "Phone properly working है। Camera, display, speaker और battery सभी अच्छे हैं।\n\n" +
            "Original box available है। Serious buyers only.",

        seller: {
            name: "Rahul Sharma",
            location: "Agra, Uttar Pradesh"
        },

        images: [
            "https://images.unsplash.com/photo-1592286927505-2fdc8d9e8b7f?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80"
        ]
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
            "HP laptop with Intel Core i5 processor.\n\n" +
            "Suitable for students, office work, coding and daily use.",

        seller: {
            name: "Amit Verma",
            location: "Agra, Uttar Pradesh"
        },

        images: [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
        ]
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
            "Royal Enfield Classic 350 अच्छी condition में है।\n\n" +
            "Regularly serviced और daily use के लिए perfect.",

        seller: {
            name: "Vikas Singh",
            location: "Mathura, Uttar Pradesh"
        },

        images: [
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1558981403-c5f9891e0c2d?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80"
        ]
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
            "Premium wooden sofa set.\n\n" +
            "Strong wooden frame और comfortable cushions.",

        seller: {
            name: "Neeraj Gupta",
            location: "Firozabad, Uttar Pradesh"
        },

        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=1000&q=80"
        ]
    }

];


let currentProduct = null;

let currentImageIndex = 0;


/* =========================================
   GET PRODUCT
========================================= */

function getProductId() {

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    return id || "1";
}


/* =========================================
   LOAD PRODUCT
========================================= */

async function loadProduct() {

    const id = getProductId();

    if (window.AHDApi && typeof window.AHDApi.getProductById === "function") {
        try {
            const productFromStore = await window.AHDApi.getProductById(id);
            if (productFromStore) {
                currentProduct = productFromStore;
                currentImageIndex = 0;
                displayProduct();
                return;
            }
        } catch (err) {
            console.log("API product load note:", err.message);
        }
    }

    currentProduct =
        ahdProducts.find(product =>
            String(product.id) === String(id)
        );

    if (!currentProduct) {

        currentProduct = ahdProducts[0];

    }

    currentImageIndex = 0;

    displayProduct();

}


/* =========================================
   DISPLAY PRODUCT
========================================= */

function displayProduct() {

    const product = currentProduct;


    document.title =
        `${product.name} - AHD Marketplace`;


    document.getElementById("productName")
        .textContent = product.name;


    document.getElementById("productPrice")
        .textContent =
        "₹" + Number(product.price).toLocaleString("en-IN");


    document.getElementById("productCategory")
        .textContent = product.category;


    document.getElementById("breadcrumbCategory")
        .textContent = product.category;


    document.getElementById("breadcrumbName")
        .textContent = product.name;


    document.getElementById("productCondition")
        .textContent = product.condition;


    document.getElementById("productConditionText")
        .textContent = product.condition;


    document.getElementById("productLocation")
        .textContent = product.location;


    document.getElementById("productPosted")
        .textContent = product.posted;


    document.getElementById("productDescription")
        .textContent = product.description;


    document.getElementById("sellerName")
        .textContent = product.seller.name;


    document.getElementById("sellerLocation")
        .textContent =
        "📍 " + product.seller.location;


    document.getElementById("sellerAvatar")
        .textContent =
        product.seller.name.charAt(0).toUpperCase();


    displayGallery();

    displayRelatedProducts();

}


/* =========================================
   GALLERY
========================================= */

function displayGallery() {

    const image =
        document.getElementById("mainProductImage");

    image.src =
        currentProduct.images[currentImageIndex];


    document.getElementById("imageCounter")
        .textContent =
        `${currentImageIndex + 1} / ${currentProduct.images.length}`;


    const container =
        document.getElementById("thumbnailContainer");

    container.innerHTML = "";


    currentProduct.images.forEach(
        (imageURL, index) => {

            const img =
                document.createElement("img");

            img.src = imageURL;

            img.className =
                "thumbnail";


            if (index === currentImageIndex) {

                img.classList.add("active");

            }


            img.onclick = function () {

                currentImageIndex = index;

                displayGallery();

            };


            container.appendChild(img);

        }
    );

}


/* =========================================
   NEXT IMAGE
========================================= */

function nextImage() {

    if (!currentProduct) return;


    currentImageIndex++;

    if (
        currentImageIndex >=
        currentProduct.images.length
    ) {

        currentImageIndex = 0;

    }

    displayGallery();

}


/* =========================================
   PREVIOUS IMAGE
========================================= */

function previousImage() {

    if (!currentProduct) return;


    currentImageIndex--;

    if (currentImageIndex < 0) {

        currentImageIndex =
            currentProduct.images.length - 1;

    }

    displayGallery();

}


/* =========================================
   KEYBOARD GALLERY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowRight") {

            nextImage();

        }

        if (event.key === "ArrowLeft") {

            previousImage();

        }

    }
);


/* =========================================
   SAVE PRODUCT
========================================= */

function saveProduct() {

    const button =
        document.getElementById("saveProductBtn");


    const isSaved =
        button.dataset.saved === "true";


    if (!isSaved) {

        button.dataset.saved = "true";

        button.innerHTML = "♥ Saved";

        button.style.color = "#2874f0";

        button.style.borderColor = "#2874f0";


        showProductMessage(
            "Product saved successfully."
        );

    } else {

        button.dataset.saved = "false";

        button.innerHTML = "♡ Save";

        button.style.color = "";

        button.style.borderColor = "";


        showProductMessage(
            "Product removed from saved items."
        );

    }

}


/* =========================================
   MESSAGE SELLER
========================================= */

async function messageSeller() {

    let user = null;
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            user = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            user = await AHDAuth.getUser();
        }
    } catch (_) {}

    if (!user) {
        showProductMessage("Please login first to chat with the seller.");
        setTimeout(() => {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        }, 1000);
        return;
    }

    const seller =
        encodeURIComponent(
            currentProduct?.seller?.name || "Seller"
        );

    window.location.href =
        `messages.html?seller=${seller}`;

}


/* =========================================
   CONTACT SELLER
========================================= */

async function contactSeller() {

    let user = null;
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            user = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            user = await AHDAuth.getUser();
        }
    } catch (_) {}

    if (!user) {
        showProductMessage("Please login first to view seller contact details.");
        setTimeout(() => {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        }, 1000);
        return;
    }

    const seller = currentProduct?.seller || {};
    const sellerPhone = seller.phone || "9876543210";
    const sellerName = seller.name || "Seller";

    if (confirm(`Contact ${sellerName}?\nPhone: ${sellerPhone}\n\nCall seller now?`)) {
        window.location.href = `tel:${sellerPhone}`;
    }

}


/* =========================================
   BUY / MAKE DEAL
========================================= */

async function buyProduct() {

    let user = null;
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            user = await AHDApi.getCurrentUser();
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            user = await AHDAuth.getUser();
        }
    } catch (_) {}

    if (!user) {
        showProductMessage("Please login or create an account to buy this product.");
        setTimeout(() => {
            window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        }, 1000);
        return;
    }

    showProductMessage("Initiating Deal with Seller...", "success");

    try {
        const dealData = {
            product: currentProduct,
            productName: currentProduct.name,
            price: currentProduct.price,
            customer: {
                name: user.name,
                email: user.email,
                phone: user.phone
            },
            seller: currentProduct.seller || {
                name: "Aman Gupta",
                email: "seller@ahd.in",
                phone: "9123456789"
            },
            status: "Pending"
        };

        let deal = null;
        if (typeof AHDApi !== "undefined") {
            if (typeof AHDApi.saveDeal === "function") {
                deal = await AHDApi.saveDeal(dealData);
            } else if (typeof AHDApi.createOrUpdateDeal === "function") {
                deal = await AHDApi.createOrUpdateDeal(dealData);
            }
        }

        const dealId = deal ? (deal.dealId || deal.id) : "DEAL-" + Date.now();
        showProductMessage("Deal Initiated! Opening Deal Tracker...", "success");
        setTimeout(() => {
            window.location.href = `deal.html?id=${dealId}&product=${encodeURIComponent(currentProduct.name)}&price=${currentProduct.price}`;
        }, 600);

    } catch (err) {
        console.error("Deal error:", err);
        window.location.href = `deal.html?product=${encodeURIComponent(currentProduct.name)}&price=${currentProduct.price}`;
    }

}


/* =========================================
   SELLER PROFILE
========================================= */

function openSellerProfile() {

    window.location.href =
        `seller-profile.html?id=${currentProduct.seller.name}`;

}


/* =========================================
   RELATED PRODUCTS
========================================= */

function displayRelatedProducts() {

    const container =
        document.getElementById("relatedProducts");


    container.innerHTML = "";


    const related =
        ahdProducts
        .filter(product =>
            product.id !== currentProduct.id
        )
        .filter(product =>
            product.category === currentProduct.category
        );


    const productsToShow =
        related.length > 0
            ? related
            : ahdProducts.filter(
                product =>
                    product.id !== currentProduct.id
            );


    productsToShow
        .slice(0, 4)
        .forEach(product => {


            const card =
                document.createElement("div");

            card.className =
                "related-card";


            card.onclick = function() {

                window.location.href =
                    `product.html?id=${product.id}`;

            };


            card.innerHTML = `

                <img
                    src="${product.images[0]}"
                    alt="${product.name}"
                >

                <div class="related-card-content">

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="related-price">
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </div>

                    <div class="related-location">
                        📍 ${product.location}
                    </div>

                </div>

            `;


            container.appendChild(card);

        });

}


/* =========================================
   MESSAGE
========================================= */

function showProductMessage(message) {

    let box =
        document.getElementById(
            "productMessageBox"
        );


    if (!box) {

        box =
            document.createElement("div");

        box.id =
            "productMessageBox";


        box.style.position = "fixed";

        box.style.bottom = "25px";

        box.style.left = "50%";

        box.style.transform =
            "translateX(-50%)";

        box.style.background =
            "#222";

        box.style.color =
            "#fff";

        box.style.padding =
            "13px 20px";

        box.style.borderRadius =
            "8px";

        box.style.zIndex = "9999";

        box.style.fontSize = "14px";


        document.body.appendChild(box);

    }


    box.textContent = message;

    box.style.display = "block";


    setTimeout(function() {

        box.style.display = "none";

    }, 2500);

}


/* =========================================
   HEADER FUNCTIONS
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


function performSearch() {

    const input =
        document.getElementById("globalSearch");

    const query =
        input.value.trim();


    if (!query) return;


    window.location.href =
        `search.html?q=${encodeURIComponent(query)}`;

}


function handleSearch(event) {

    if (event.key === "Enter") {

        performSearch();

    }

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadProduct
);