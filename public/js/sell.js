/* =========================================================
   AHD MARKETPLACE
   SELL PRODUCT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const form = document.getElementById("sellProductForm");

    const imageInput = document.getElementById("productImages");
    const imagePreview = document.getElementById("imagePreview");
    const imageCount = document.getElementById("imageCount");

    const productName = document.getElementById("productName");
    const productCategory = document.getElementById("productCategory");
    const productCondition = document.getElementById("productCondition");
    const productPrice = document.getElementById("productPrice");
    const productDescription = document.getElementById("productDescription");
    const descriptionCount = document.getElementById("descriptionCount");

    const productLocation = document.getElementById("productLocation");
    const detectLocationBtn = document.getElementById("detectLocationBtn");

    const sellerName = document.getElementById("sellerName");

    const sellMessage = document.getElementById("sellMessage");
    const publishProductBtn = document.getElementById("publishProductBtn");


    /* =====================================================
       CHECK FORM
    ===================================================== */

    if (!form) {
        console.error("AHD Sell: sellProductForm not found.");
        return;
    }


    /* =====================================================
       SELECTED IMAGES
    ===================================================== */

    let selectedImages = [];


    /* =====================================================
       LOAD SELLER INFORMATION
    ===================================================== */

    loadSellerInformation();


    function loadSellerInformation() {

        try {

            if (
                typeof AHDAuth !== "undefined" &&
                typeof AHDAuth.getUser === "function"
            ) {

                const user = AHDAuth.getUser();

                if (user) {

                    const name =
                        user.name ||
                        user.fullName ||
                        user.username ||
                        user.email ||
                        "AHD Seller";

                    if (sellerName) {
                        sellerName.textContent = name;
                    }

                    return;
                }
            }

        } catch (error) {

            console.error(
                "AHD Sell: Unable to load seller information.",
                error
            );

        }

        if (sellerName) {
            sellerName.textContent = "AHD Seller";
        }
    }


    /* =====================================================
       IMAGE INPUT
    ===================================================== */

    if (imageInput) {

        imageInput.addEventListener("change", function () {

            const files = Array.from(this.files || []);

            if (files.length === 0) {
                return;
            }


            /* MAX 8 IMAGES */

            const remainingSlots =
                8 - selectedImages.length;

            if (remainingSlots <= 0) {

                showMessage(
                    "Maximum 8 images allowed.",
                    "error"
                );

                imageInput.value = "";
                return;
            }


            const filesToAdd =
                files.slice(0, remainingSlots);


            if (files.length > remainingSlots) {

                showMessage(
                    "Only 8 images can be uploaded. Extra images were ignored.",
                    "error"
                );

            }


            /* VALIDATE FILES */

            filesToAdd.forEach(function (file) {

                if (!file.type.startsWith("image/")) {

                    showMessage(
                        "Only image files are allowed.",
                        "error"
                    );

                    return;
                }


                /* BASIC FILE SIZE CHECK */

                const maxSize =
                    10 * 1024 * 1024;

                if (file.size > maxSize) {

                    showMessage(
                        file.name +
                        " is larger than 10 MB.",
                        "error"
                    );

                    return;
                }


                selectedImages.push(file);

            });


            renderImagePreview();

            imageInput.value = "";

        });

    }


    /* =====================================================
       RENDER IMAGE PREVIEW
    ===================================================== */

    function renderImagePreview() {

        if (!imagePreview) {
            return;
        }

        imagePreview.innerHTML = "";


        selectedImages.forEach(function (file, index) {

            const previewItem =
                document.createElement("div");

            previewItem.className =
                "preview-item";


            const image =
                document.createElement("img");

            image.alt =
                "Product image " + (index + 1);


            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className =
                "remove-image";

            removeButton.textContent = "×";

            removeButton.setAttribute(
                "aria-label",
                "Remove image " + (index + 1)
            );


            removeButton.addEventListener(
                "click",
                function () {

                    selectedImages.splice(index, 1);

                    renderImagePreview();

                }
            );


            previewItem.appendChild(image);

            previewItem.appendChild(removeButton);

            imagePreview.appendChild(previewItem);


            /* READ IMAGE */

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    console.error(
                        "Unable to preview image:",
                        file.name
                    );

                };


            reader.readAsDataURL(file);

        });


        updateImageCounter();

    }


    /* =====================================================
       IMAGE COUNTER
    ===================================================== */

    function updateImageCounter() {

        if (imageCount) {

            imageCount.textContent =
                selectedImages.length;

        }

    }


    /* =====================================================
       DESCRIPTION COUNTER
    ===================================================== */

    if (productDescription) {

        productDescription.addEventListener(
            "input",
            function () {

                if (descriptionCount) {

                    descriptionCount.textContent =
                        productDescription.value.length;

                }

            }
        );

    }


    /* =====================================================
       LOCATION DETECTION
    ===================================================== */

    if (detectLocationBtn) {

        detectLocationBtn.addEventListener(
            "click",
            detectUserLocation
        );

    }


    function detectUserLocation() {

        if (!navigator.geolocation) {

            showMessage(
                "Your browser does not support location detection.",
                "error"
            );

            return;
        }


        detectLocationBtn.disabled = true;

        detectLocationBtn.textContent =
            "Detecting...";


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                /* Store temporarily on input */

                productLocation.dataset.latitude =
                    latitude;

                productLocation.dataset.longitude =
                    longitude;


                /*
                 * We are not using an external
                 * reverse-geocoding API here.
                 *
                 * User can replace Current Location
                 * with their actual city/location.
                 */

                productLocation.value =
                    "Current Location";


                detectLocationBtn.textContent =
                    "Detected ✓";

                detectLocationBtn.disabled =
                    false;


                showMessage(
                    "Location detected successfully.",
                    "success"
                );

            },


            function (error) {

                console.error(
                    "Location error:",
                    error
                );


                detectLocationBtn.textContent =
                    "Detect";

                detectLocationBtn.disabled =
                    false;


                let errorMessage =
                    "Unable to detect your location.";


                if (error.code === 1) {

                    errorMessage =
                        "Location permission was denied. Please enter your location manually.";

                }

                else if (error.code === 2) {

                    errorMessage =
                        "Your location could not be determined. Please enter it manually.";

                }

                else if (error.code === 3) {

                    errorMessage =
                        "Location request timed out. Please try again.";

                }


                showMessage(
                    errorMessage,
                    "error"
                );

            },


            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }

        );

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener(
        "submit",
        handleFormSubmit
    );


    async function handleFormSubmit(event) {

        event.preventDefault();


        /* Disable button */

        if (publishProductBtn) {

            publishProductBtn.disabled =
                true;

            publishProductBtn.textContent =
                "Publishing...";

        }


        try {

            /* =============================================
               VALIDATE IMAGES
            ============================================= */

            if (selectedImages.length === 0) {

                throw new Error(
                    "Please upload at least one product image."
                );

            }


            /* =============================================
               GET FORM VALUES
            ============================================= */

            const name =
                productName.value.trim();

            const category =
                productCategory.value;

            const condition =
                productCondition.value;

            const price =
                parseFloat(
                    productPrice.value
                );

            const description =
                productDescription.value.trim();

            const location =
                productLocation.value.trim();


            /* =============================================
               BASIC VALIDATION
            ============================================= */

            if (!name) {

                throw new Error(
                    "Please enter the product name."
                );

            }


            if (name.length < 3) {

                throw new Error(
                    "Product name must contain at least 3 characters."
                );

            }


            if (!category) {

                throw new Error(
                    "Please select a product category."
                );

            }


            if (!condition) {

                throw new Error(
                    "Please select product condition."
                );

            }


            if (
                Number.isNaN(price) ||
                price <= 0
            ) {

                throw new Error(
                    "Please enter a valid selling price."
                );

            }


            if (description.length < 10) {

                throw new Error(
                    "Product description must contain at least 10 characters."
                );

            }


            if (!location) {

                throw new Error(
                    "Please enter the product location."
                );

            }


            /* =============================================
               DELIVERY
            ============================================= */

            const deliveryElement =
                document.querySelector(
                    'input[name="delivery"]:checked'
                );


            if (!deliveryElement) {

                throw new Error(
                    "Please select a delivery option."
                );

            }


            const delivery =
                deliveryElement.value;


            /* =============================================
               CONTACT METHODS
            ============================================= */

            const contactElements =
                document.querySelectorAll(
                    'input[name="contact"]:checked'
                );


            const contactMethods =
                Array.from(
                    contactElements
                ).map(function (input) {

                    return input.value;

                });


            if (contactMethods.length === 0) {

                throw new Error(
                    "Please select at least one contact method."
                );

            }


            /* =============================================
               SELLER
            ============================================= */

            let seller = null;


            try {

                if (
                    typeof AHDAuth !== "undefined" &&
                    typeof AHDAuth.getUser === "function"
                ) {

                    seller =
                        AHDAuth.getUser();

                }

            } catch (error) {

                console.warn(
                    "AHD Sell: Seller information unavailable.",
                    error
                );

            }


            /* =============================================
               CREATE PRODUCT ID
            ============================================= */

            const productId =
                "AHD-" +
                Date.now() +
                "-" +
                Math.floor(
                    Math.random() * 100000
                );


            /* =============================================
               GET COORDINATES
            ============================================= */

            const latitude =
                productLocation.dataset.latitude ||
                null;

            const longitude =
                productLocation.dataset.longitude ||
                null;


            /* =============================================
               CONVERT IMAGES
            ============================================= */

            const imageData =
                await convertImagesToDataURL(
                    selectedImages
                );


            /* =============================================
               CREATE PRODUCT OBJECT
            ============================================= */

            const product = {

                id: productId,

                name: name,

                category: category,

                condition: condition,

                price:
                    Number(
                        price.toFixed(2)
                    ),

                description: description,

                location: location,

                latitude: latitude,

                longitude: longitude,

                delivery: delivery,

                contactMethods: contactMethods,

                images: imageData,

                seller: {

                    name:
                        seller?.name ||
                        seller?.fullName ||
                        seller?.username ||
                        "AHD Seller",

                    email:
                        seller?.email ||
                        "",

                    phone:
                        seller?.phone ||
                        "",

                    role:
                        seller?.role ||
                        "seller"

                },

                status: "active",

                createdAt:
                    new Date().toISOString()

            };


            /* =============================================
               PERSIST PRODUCT (API + IndexedDB)
               NO localStorage
               NO sessionStorage
            ============================================= */

            if (window.AHDApi && typeof window.AHDApi.createProduct === "function") {
                await window.AHDApi.createProduct(product);
            }

            console.log(
                "AHD Product Created:",
                product
            );


            /* =============================================
               SUCCESS MESSAGE
            ============================================= */

            showMessage(
                "Product created successfully! Opening product page...",
                "success"
            );


            /* =============================================
               OPEN PRODUCT PAGE
            ============================================= */

            setTimeout(
                function () {

                    window.location.href =
                        "product.html?id=" + encodeURIComponent(product.id);

                },
                800
            );

        }

        catch (error) {

            console.error(
                "AHD Sell Error:",
                error
            );


            showMessage(
                error.message ||
                "Something went wrong. Please try again.",
                "error"
            );


            /* Enable button again */

            if (publishProductBtn) {

                publishProductBtn.disabled =
                    false;

                publishProductBtn.textContent =
                    "🚀 Publish Product";

            }

        }

    }


    /* =====================================================
       CONVERT IMAGES TO DATA URL
    ===================================================== */

    function convertImagesToDataURL(files) {

        return new Promise(
            function (resolve, reject) {

                if (!files || files.length === 0) {

                    resolve([]);

                    return;
                }


                const results = [];

                let completed = 0;


                files.forEach(
                    function (file, index) {

                        const reader =
                            new FileReader();


                        reader.onload =
                            function (event) {

                                results[index] =
                                    event.target.result;

                                completed++;


                                if (
                                    completed ===
                                    files.length
                                ) {

                                    resolve(results);

                                }

                            };


                        reader.onerror =
                            function () {

                                reject(
                                    new Error(
                                        "Unable to process image: " +
                                        file.name
                                    )
                                );

                            };


                        reader.readAsDataURL(file);

                    }
                );

            }
        );

    }


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showMessage(text, type) {

        if (!sellMessage) {

            console.log(
                "[" + type + "]",
                text
            );

            return;
        }


        sellMessage.textContent =
            text;


        sellMessage.className =
            "sell-message " + type;


        sellMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

});