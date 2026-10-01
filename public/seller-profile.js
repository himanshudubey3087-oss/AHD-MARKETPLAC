document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       ELEMENTS
    ========================= */

    const backBtn =
        document.getElementById("backBtn");

    const editBtn =
        document.getElementById("editBtn");

    const sellerPhoto =
        document.getElementById("sellerPhoto");

    const sellerName =
        document.getElementById("sellerName");

    const sellerCategory =
        document.getElementById("sellerCategory");

    const sellerRating =
        document.getElementById("sellerRating");

    const reviewCount =
        document.getElementById("reviewCount");

    const sellerLocation =
        document.getElementById("sellerLocation");

    const experience =
        document.getElementById("experience");

    const startingPrice =
        document.getElementById("startingPrice");

    const serviceCount =
        document.getElementById("serviceCount");

    const memberSince =
        document.getElementById("memberSince");

    const aboutText =
        document.getElementById("aboutText");

    const servicesList =
        document.getElementById("servicesList");

    const availabilityToggle =
        document.getElementById("availabilityToggle");

    const statusText =
        document.getElementById("statusText");

    const availabilityDot =
        document.getElementById("availabilityDot");

    const addServiceBtn =
        document.getElementById("addServiceBtn");

    const shareProfileBtn =
        document.getElementById("shareProfileBtn");

    const previewProfileBtn =
        document.getElementById("previewProfileBtn");

    /* MODAL */

    const serviceModal =
        document.getElementById("serviceModal");

    const closeModal =
        document.getElementById("closeModal");

    const saveServiceBtn =
        document.getElementById("saveServiceBtn");

    const serviceNameInput =
        document.getElementById("serviceNameInput");

    const servicePriceInput =
        document.getElementById("servicePriceInput");

    const serviceDescriptionInput =
        document.getElementById("serviceDescriptionInput");


    /* =========================
       CURRENT USER
    ========================= */

    let currentUser = null;

    try {

        currentUser =
            await AHDAuth.getUser();

        if (!currentUser) {

            window.location.replace("login.html");

            return;
        }

    } catch (error) {

        console.error(error);

        return;
    }


    /* =========================
       PROFILE DATA
    ========================= */

    const profile = {

        name:
            currentUser.serviceName ||
            currentUser.name ||
            currentUser.fullName ||
            "Service Provider",

        category:
            currentUser.serviceCategory ||
            "Service Provider",

        location:
            currentUser.location ||
            "Agra, Uttar Pradesh",

        experience:
            currentUser.experience ||
            "0 Years",

        startingPrice:
            currentUser.startingPrice ||
            0,

        about:
            currentUser.serviceAbout ||
            "Add information about your professional experience and services.",

        rating:
            currentUser.rating ||
            5.0,

        reviews:
            currentUser.reviewCount ||
            0,

        photo:
            currentUser.profilePhoto ||
            "https://via.placeholder.com/130",

        available:
            currentUser.serviceAvailable !== false,

        services:
            Array.isArray(currentUser.services)
                ? currentUser.services
                : [],

        createdAt:
            currentUser.createdAt ||
            new Date().toISOString()

    };


    /* =========================
       SHOW PROFILE
    ========================= */

    sellerName.textContent =
        profile.name;

    sellerCategory.textContent =
        profile.category;

    sellerLocation.textContent =
        profile.location;

    experience.textContent =
        profile.experience;

    startingPrice.textContent =
        "₹" + Number(profile.startingPrice || 0).toLocaleString("en-IN");

    sellerRating.textContent =
        Number(profile.rating || 0).toFixed(1);

    reviewCount.textContent =
        "(" + profile.reviews + " reviews)";

    aboutText.textContent =
        profile.about;

    sellerPhoto.src =
        profile.photo;

    availabilityToggle.checked =
        profile.available;

    updateAvailabilityUI();

    renderServices();

    const year =
        new Date(profile.createdAt).getFullYear();

    memberSince.textContent =
        year;


    /* =========================
       BACK
    ========================= */

    backBtn.addEventListener("click", () => {

        window.history.back();

    });


    /* =========================
       EDIT
    ========================= */

    editBtn.addEventListener("click", () => {

        window.location.href =
            "edit-profile.html";

    });


    /* =========================
       AVAILABILITY
    ========================= */

    availabilityToggle.addEventListener("change", async () => {

        const available =
            availabilityToggle.checked;

        updateAvailabilityUI();

        try {

            await updateUserField(
                "serviceAvailable",
                available
            );

        } catch (error) {

            console.error(error);

        }

    });


    function updateAvailabilityUI() {

        if (availabilityToggle.checked) {

            statusText.textContent =
                "Available for work";

            availabilityDot.classList.remove(
                "offline"
            );

        } else {

            statusText.textContent =
                "Currently unavailable";

            availabilityDot.classList.add(
                "offline"
            );

        }

    }


    /* =========================
       ADD SERVICE MODAL
    ========================= */

    addServiceBtn.addEventListener("click", () => {

        serviceModal.classList.add("active");

        serviceNameInput.focus();

    });


    closeModal.addEventListener("click", closeServiceModal);


    serviceModal.addEventListener("click", (event) => {

        if (event.target === serviceModal) {

            closeServiceModal();

        }

    });


    function closeServiceModal() {

        serviceModal.classList.remove("active");

        serviceNameInput.value = "";

        servicePriceInput.value = "";

        serviceDescriptionInput.value = "";

    }


    /* =========================
       SAVE SERVICE
    ========================= */

    saveServiceBtn.addEventListener("click", async () => {

        const name =
            serviceNameInput.value.trim();

        const price =
            Number(servicePriceInput.value);

        const description =
            serviceDescriptionInput.value.trim();


        if (!name) {

            alert("Please enter service name.");

            return;
        }

        if (!price || price < 0) {

            alert("Please enter a valid price.");

            return;
        }


        const service = {

            id:
                Date.now(),

            name:
                name,

            price:
                price,

            description:
                description,

            createdAt:
                new Date().toISOString()

        };


        profile.services.push(service);


        try {

            await updateUserField(
                "services",
                profile.services
            );

            renderServices();

            closeServiceModal();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to save service."
            );

        }

    });


    /* =========================
       RENDER SERVICES
    ========================= */

    function renderServices() {

        serviceCount.textContent =
            profile.services.length;


        if (profile.services.length === 0) {

            servicesList.innerHTML = `

                <div class="empty-service">

                    <div>🛠️</div>

                    <strong>
                        No services added
                    </strong>

                    <p>
                        Add your first service to start
                        receiving customers.
                    </p>

                </div>

            `;

            return;
        }


        servicesList.innerHTML =
            profile.services.map(service => `

                <div class="service-item">

                    <div class="service-top">

                        <h4>
                            ${escapeHTML(service.name)}
                        </h4>

                        <span class="service-price">
                            ₹${Number(service.price || 0)
                                .toLocaleString("en-IN")}
                        </span>

                    </div>

                    <p class="service-description">
                        ${escapeHTML(
                            service.description ||
                            "Professional service provided by this seller."
                        )}
                    </p>

                </div>

            `).join("");

    }


    /* =========================
       SHARE
    ========================= */

    shareProfileBtn.addEventListener("click", async () => {

        const shareData = {

            title:
                profile.name + " - AHD",

            text:
                "Check out my service profile on AHD Marketplace.",

            url:
                window.location.href

        };


        try {

            if (navigator.share) {

                await navigator.share(
                    shareData
                );

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "Profile link copied!"
                );

            }

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    });


    /* =========================
       PREVIEW
    ========================= */

    previewProfileBtn.addEventListener("click", () => {

        alert(
            "Customer preview will be connected here."
        );

    });


    /* =========================
       UPDATE USER
    ========================= */

    async function updateUserField(
        field,
        value
    ) {

        const db =
            await openAHDDatabase();

        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        "users",
                        "readwrite"
                    );

                const store =
                    transaction.objectStore(
                        "users"
                    );

                const request =
                    store.get(
                        currentUser.email
                    );


                request.onsuccess = () => {

                    const user =
                        request.result;

                    if (!user) {

                        reject(
                            new Error(
                                "User not found."
                            )
                        );

                        return;
                    }


                    user[field] =
                        value;

                    user.updatedAt =
                        new Date().toISOString();


                    store.put(user);

                };


                request.onerror = () => {

                    reject(
                        request.error
                    );

                };


                transaction.oncomplete = () => {

                    resolve(true);

                };


                transaction.onerror = () => {

                    reject(
                        transaction.error
                    );

                };

            }
        );

    }


    /* =========================
       OPEN AHD DATABASE
       ========================= */

    function openAHDDatabase() {

        return new Promise(
            (resolve, reject) => {

                const request =
                    indexedDB.open(
                        "AHDMarketplaceDB"
                    );


                request.onsuccess = () => {

                    resolve(
                        request.result
                    );

                };


                request.onerror = () => {

                    reject(
                        request.error
                    );

                };

            }
        );

    }


    /* =========================
       HTML SECURITY
    ========================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});