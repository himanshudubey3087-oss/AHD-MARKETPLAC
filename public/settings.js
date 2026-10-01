/* =========================================================
   AHD MARKETPLACE - SETTINGS CONTROLLER (js/settings.js)
   Clean, robust profile photo upload, location update,
   role detection, and modal interactions.
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const backBtn = document.getElementById("backBtn");
    const profilePhoto = document.getElementById("profilePhoto");
    const photoButton = document.getElementById("photoButton");
    const photoInput = document.getElementById("photoInput");

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userRole = document.getElementById("userRole");

    const editProfileBtn = document.getElementById("editProfileBtn");
    const serviceProfileBtn = document.getElementById("serviceProfileBtn");
    const changePasswordBtn = document.getElementById("changePasswordBtn");

    const notificationToggle = document.getElementById("notificationToggle");
    const locationBtn = document.getElementById("locationBtn");
    const locationValue = document.getElementById("locationValue");

    const helpBtn = document.getElementById("helpBtn");
    const aboutBtn = document.getElementById("aboutBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const locationModal = document.getElementById("locationModal");
    const closeLocationModal = document.getElementById("closeLocationModal");
    const locationInput = document.getElementById("locationInput");
    const saveLocationBtn = document.getElementById("saveLocationBtn");

    const aboutModal = document.getElementById("aboutModal");
    const closeAboutModal = document.getElementById("closeAboutModal");

    let currentUser = null;

    /* =====================================================
       LOAD CURRENT USER GRACEFULLY
    ===================================================== */
    try {
        if (typeof AHDApi !== "undefined" && typeof AHDApi.getCurrentUser === "function") {
            currentUser = await AHDApi.getCurrentUser();
        }
        if (!currentUser && typeof AHDAuth !== "undefined" && typeof AHDAuth.getUser === "function") {
            currentUser = await AHDAuth.getUser();
        }
    } catch (err) {
        console.warn("Settings user fetch note:", err);
    }

    // Populate UI
    function populateUserData() {
        if (currentUser && (currentUser.name || currentUser.fullName || currentUser.email)) {
            const name = currentUser.name || currentUser.fullName || currentUser.serviceName || "AHD User";
            const email = currentUser.email || currentUser.phone || "user@ahd.in";
            const role = (currentUser.role || "customer").toLowerCase();

            if (userName) userName.textContent = name;
            if (userEmail) userEmail.textContent = email;

            if (userRole) {
                if (role === "seller") {
                    userRole.textContent = "🏪 Seller / Service Provider";
                    userRole.style.color = "#059669";
                    userRole.style.background = "#ecfdf5";
                    userRole.style.borderColor = "#a7f3d0";
                } else {
                    userRole.textContent = "👤 Customer";
                }
            }

            if (currentUser.location && locationValue) {
                locationValue.textContent = currentUser.location;
            }

            if (currentUser.profilePhoto && profilePhoto) {
                profilePhoto.src = currentUser.profilePhoto;
            }

            if (notificationToggle) {
                notificationToggle.checked = currentUser.notificationsEnabled !== false;
            }

            // Only show service profile button to sellers
            if (serviceProfileBtn) {
                serviceProfileBtn.style.display = (role === "seller") ? "flex" : "none";
            }
        } else {
            // Guest / Not logged in state
            if (userName) userName.textContent = "Guest User";
            if (userEmail) userEmail.textContent = "Not logged in";
            if (userRole) userRole.textContent = "Visitor";
            if (logoutBtn) {
                logoutBtn.innerHTML = "<span>🔑</span> Login to Account";
                logoutBtn.style.background = "var(--primary-light)";
                logoutBtn.style.color = "var(--primary)";
                logoutBtn.style.borderColor = "var(--border)";
            }
            if (serviceProfileBtn) serviceProfileBtn.style.display = "none";
        }
    }

    populateUserData();

    /* =====================================================
       NAVIGATION & ACTION BUTTONS
    ===================================================== */
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "home.html";
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            if (!currentUser) {
                window.location.href = "login.html";
            } else {
                window.location.href = "account.html";
            }
        });
    }

    if (serviceProfileBtn) {
        serviceProfileBtn.addEventListener("click", () => {
            window.location.href = "seller-profile.html";
        });
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", () => {
            window.location.href = "forgot-password.html";
        });
    }

    /* =====================================================
       PROFILE PHOTO UPLOAD
    ===================================================== */
    if (photoButton && photoInput) {
        photoButton.addEventListener("click", () => photoInput.click());

        photoInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const base64 = event.target.result;
                    if (profilePhoto) profilePhoto.src = base64;

                    if (currentUser) {
                        currentUser.profilePhoto = base64;
                        try {
                            if (typeof AHDApi !== "undefined" && AHDApi.updateProfile) {
                                await AHDApi.updateProfile(currentUser);
                            }
                        } catch (err) {
                            console.warn("Could not sync photo to server:", err);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    /* =====================================================
       NOTIFICATION TOGGLE
    ===================================================== */
    if (notificationToggle) {
        notificationToggle.addEventListener("change", async (e) => {
            const enabled = e.target.checked;
            if (currentUser) {
                currentUser.notificationsEnabled = enabled;
                try {
                    if (typeof AHDApi !== "undefined" && AHDApi.updateProfile) {
                        await AHDApi.updateProfile(currentUser);
                    }
                } catch (err) {
                    console.warn("Notification preference save note:", err);
                }
            }
        });
    }

    /* =====================================================
       LOCATION MODAL
    ===================================================== */
    if (locationBtn && locationModal) {
        locationBtn.addEventListener("click", () => {
            if (locationInput && locationValue) {
                locationInput.value = locationValue.textContent.trim();
            }
            locationModal.classList.add("active");
            if (locationInput) locationInput.focus();
        });
    }

    if (closeLocationModal && locationModal) {
        closeLocationModal.addEventListener("click", () => {
            locationModal.classList.remove("active");
        });
    }

    if (saveLocationBtn && locationModal) {
        saveLocationBtn.addEventListener("click", async () => {
            const newLoc = (locationInput ? locationInput.value.trim() : "") || "Agra, Uttar Pradesh";
            if (locationValue) locationValue.textContent = newLoc;

            // Broadcast globally so other pages update
            if (window.AHDLocation) {
                const cityPart = newLoc.split(",")[0].trim();
                window.AHDLocation.current.city = cityPart;
                window.AHDLocation.current.formatted = newLoc;
                window.AHDLocation.broadcast();
            }

            if (currentUser) {
                currentUser.location = newLoc;
                try {
                    if (typeof AHDApi !== "undefined" && AHDApi.updateProfile) {
                        await AHDApi.updateProfile(currentUser);
                    }
                } catch (err) {
                    console.warn("Could not save location to API:", err);
                }
            }

            locationModal.classList.remove("active");
        });
    }

    /* =====================================================
       ABOUT MODAL
    ===================================================== */
    if (aboutBtn && aboutModal) {
        aboutBtn.addEventListener("click", () => {
            aboutModal.classList.add("active");
        });
    }

    if (closeAboutModal && aboutModal) {
        closeAboutModal.addEventListener("click", () => {
            aboutModal.classList.remove("active");
        });
    }

    // Close modals on background click
    window.addEventListener("click", (e) => {
        if (locationModal && e.target === locationModal) {
            locationModal.classList.remove("active");
        }
        if (aboutModal && e.target === aboutModal) {
            aboutModal.classList.remove("active");
        }
    });

    /* =====================================================
       HELP & SUPPORT
    ===================================================== */
    if (helpBtn) {
        helpBtn.addEventListener("click", () => {
            alert("AHD Marketplace 24/7 Support\n\n📧 Email: support@ahd.in\n📞 Phone: +91 98765 43210\n🏢 Hub: Agra, Uttar Pradesh");
        });
    }

    /* =====================================================
       LOGOUT OR LOGIN
    ===================================================== */
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (!currentUser) {
                window.location.href = "login.html";
                return;
            }

            if (confirm("Are you sure you want to log out of your account?")) {
                try {
                    if (typeof AHDApi !== "undefined" && typeof AHDApi.logout === "function") {
                        await AHDApi.logout();
                    }
                    if (typeof AHDAuth !== "undefined" && typeof AHDAuth.logout === "function") {
                        await AHDAuth.logout();
                    }
                } catch (err) {
                    console.warn("Logout error note:", err);
                }
                window.location.href = "login.html";
            }
        });
    }
});
