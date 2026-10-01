/* =========================================================
   AHD MARKETPLACE
   EDIT PROFILE SYSTEM (js/edit-profile.js)

   ✔ Real profile update via AHDAuth & AHDApi
   ✔ No version errors in IndexedDB
   ✔ Customer & Seller role-specific sections
   ✔ Photo upload & preview
   ✔ Geolocation detection
   ✔ Zero localStorage / Zero sessionStorage
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    let currentUser = null;
    let selectedProfilePhoto = null;

    const messageBox = document.getElementById("editProfileMessage");
    const photoPreview = document.getElementById("profilePhotoPreview");
    const photoFallback = document.getElementById("photoFallback");
    const photoInput = document.getElementById("profilePhoto");
    const removePhotoBtn = document.getElementById("removePhotoButton");
    const bioInput = document.getElementById("editBio");
    const bioCounter = document.getElementById("bioCounter");
    const backBtn = document.getElementById("backButton");
    const cancelBtn = document.getElementById("cancelButton");
    const saveBtn = document.getElementById("saveProfileButton");
    const locationBtn = document.getElementById("useLocationButton");
    const locationStatus = document.getElementById("locationStatus");
    const changePasswordBtn = document.getElementById("changePasswordButton");
    const logoutBtn = document.getElementById("logoutButton");
    const deleteAccountBtn = document.getElementById("deleteAccountButton");

    /* =====================================================
       1. LOAD USER
    ===================================================== */
    try {
        if (typeof AHDAuth === "undefined") {
            throw new Error("Authentication module not loaded.");
        }

        currentUser = await AHDAuth.getUser();

        if (!currentUser) {
            window.location.replace("login.html");
            return;
        }

        populateForm(currentUser);

    } catch (error) {
        console.error("Profile load error:", error);
        showMessage("Unable to load profile data. Please login again.", "error");
    }

    /* =====================================================
       2. POPULATE FORM FIELDS
    ===================================================== */
    function populateForm(user) {
        setValue("editName", user.name || user.fullName || "");
        setValue("editUsername", user.username || "");
        setValue("editAccountType", user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Customer");
        setValue("editBio", user.bio || "");
        if (bioCounter && user.bio) {
            bioCounter.textContent = `${user.bio.length}/500`;
        }

        setValue("editPhone", user.phone || "");
        setValue("editAlternatePhone", user.alternatePhone || "");
        setValue("editEmail", user.email || "");

        setValue("editCountry", user.country || "India");
        setValue("editState", user.state || "");
        setValue("editCity", user.city || "");
        setValue("editArea", user.area || "");
        setValue("editPincode", user.pincode || "");
        setValue("editLocation", user.location || "");
        setValue("editAddress", user.address || "");

        setValue("editDob", user.dob || "");
        setValue("editGender", user.gender || "");
        setValue("editOccupation", user.occupation || "");
        setValue("editEducation", user.education || "");

        // Profile photo
        if (user.profilePhoto) {
            selectedProfilePhoto = user.profilePhoto;
            if (photoPreview) {
                photoPreview.src = user.profilePhoto;
                photoPreview.style.display = "block";
            }
            if (photoFallback) {
                photoFallback.style.display = "none";
            }
        }

        // Role-based sections
        const isSeller = user.role === "seller";
        const customerSec = document.getElementById("customerEditSection");
        const sellerSec = document.getElementById("sellerEditSection");

        if (isSeller) {
            if (sellerSec) sellerSec.classList.add("active");
            if (customerSec) customerSec.classList.remove("active");

            setValue("sellerCategory", user.sellerCategory || "");
            setValue("sellerShopName", user.sellerShopName || "");
            setValue("sellerBusinessType", user.sellerBusinessType || "");
            setValue("sellingExperience", user.sellingExperience || "");
            setValue("preferredSellingLocation", user.preferredSellingLocation || "");
            setCheckboxValues("sellerProduct", user.sellerProduct || []);
        } else {
            if (customerSec) customerSec.classList.add("active");
            if (sellerSec) sellerSec.classList.remove("active");

            setValue("customerCategory", user.customerCategory || "");
            setValue("preferredBuyingLocation", user.preferredBuyingLocation || "");
            setValue("buyingBudget", user.buyingBudget || "");
            setCheckboxValues("customerInterest", user.customerInterest || []);
        }

        // Social & Links
        setValue("editInstagram", user.instagram || "");
        setValue("editFacebook", user.facebook || "");
        setValue("editWebsite", user.website || "");

        // Preferences
        setValue("preferredLanguage", user.preferredLanguage || "English");
        setValue("communicationPreference", user.communicationPreference || "In App");
        setChecked("productNotifications", user.productNotifications ?? true);
        setChecked("messageNotifications", user.messageNotifications ?? true);
        setChecked("locationSuggestions", user.locationSuggestions ?? true);
    }

    /* =====================================================
       3. BIO COUNTER
    ===================================================== */
    if (bioInput && bioCounter) {
        bioInput.addEventListener("input", () => {
            bioCounter.textContent = `${bioInput.value.length}/500`;
        });
    }

    /* =====================================================
       4. PHOTO UPLOAD & REMOVAL
    ===================================================== */
    if (photoInput) {
        photoInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showMessage("Please select a valid image file (JPG, PNG, WEBP).", "error");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showMessage("Photo size must be less than 2 MB.", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                selectedProfilePhoto = reader.result;
                if (photoPreview) {
                    photoPreview.src = reader.result;
                    photoPreview.style.display = "block";
                }
                if (photoFallback) {
                    photoFallback.style.display = "none";
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener("click", () => {
            selectedProfilePhoto = "";
            if (photoPreview) {
                photoPreview.src = "";
                photoPreview.style.display = "none";
            }
            if (photoFallback) {
                photoFallback.style.display = "block";
            }
            if (photoInput) photoInput.value = "";
        });
    }

    /* =====================================================
       5. GEOLOCATION DETECTION
    ===================================================== */
    if (locationBtn) {
        locationBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                showMessage("Geolocation is not supported by this browser.", "error");
                return;
            }

            if (locationStatus) locationStatus.textContent = "Detecting location...";
            locationBtn.disabled = true;

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        const data = await res.json();
                        const city = data.address?.city || data.address?.town || data.address?.district || "Agra";
                        const state = data.address?.state || "Uttar Pradesh";
                        const country = data.address?.country || "India";
                        const pincode = data.address?.postcode || "";

                        setValue("editCity", city);
                        setValue("editState", state);
                        setValue("editCountry", country);
                        if (pincode) setValue("editPincode", pincode);
                        setValue("editLocation", `${city}, ${state}`);

                        if (locationStatus) locationStatus.textContent = `📍 Detected: ${city}, ${state}`;
                    } catch (_) {
                        setValue("editLocation", "Agra, Uttar Pradesh");
                        if (locationStatus) locationStatus.textContent = "📍 Location set to Agra, Uttar Pradesh";
                    } finally {
                        locationBtn.disabled = false;
                    }
                },
                () => {
                    setValue("editLocation", "Agra, Uttar Pradesh");
                    if (locationStatus) locationStatus.textContent = "📍 Defaulted to Agra, Uttar Pradesh";
                    locationBtn.disabled = false;
                },
                { timeout: 8000 }
            );
        });
    }

    /* =====================================================
       6. SAVE PROFILE
    ===================================================== */
    if (saveBtn) {
        saveBtn.addEventListener("click", saveProfile);
    }

    async function saveProfile(e) {
        if (e) e.preventDefault();

        if (!currentUser) {
            showMessage("Please login again.", "error");
            return;
        }

        const name = getValue("editName");
        if (!name) {
            showMessage("Full Name is required.", "error");
            document.getElementById("editName")?.focus();
            return;
        }

        const isSeller = currentUser.role === "seller";
        if (isSeller) {
            const sellerCat = getValue("sellerCategory");
            if (!sellerCat) {
                showMessage("Please select a Seller Category.", "error");
                document.getElementById("sellerCategory")?.focus();
                return;
            }
        } else {
            const customerCat = getValue("customerCategory");
            if (!customerCat) {
                showMessage("Please select a Customer Category.", "error");
                document.getElementById("customerCategory")?.focus();
                return;
            }
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";

        try {
            const updatedUser = {
                ...currentUser,
                name: name,
                username: getValue("editUsername"),
                bio: getValue("editBio"),
                alternatePhone: getValue("editAlternatePhone"),
                country: getValue("editCountry") || "India",
                state: getValue("editState"),
                city: getValue("editCity"),
                area: getValue("editArea"),
                pincode: getValue("editPincode"),
                location: getValue("editLocation") || `${getValue("editCity") || "Agra"}, ${getValue("editState") || "Uttar Pradesh"}`,
                address: getValue("editAddress"),
                dob: getValue("editDob"),
                gender: getValue("editGender"),
                occupation: getValue("editOccupation"),
                education: getValue("editEducation"),
                instagram: getValue("editInstagram"),
                facebook: getValue("editFacebook"),
                website: getValue("editWebsite"),
                preferredLanguage: getValue("preferredLanguage"),
                communicationPreference: getValue("communicationPreference"),
                productNotifications: getChecked("productNotifications"),
                messageNotifications: getChecked("messageNotifications"),
                locationSuggestions: getChecked("locationSuggestions"),
                profilePhoto: selectedProfilePhoto !== null ? selectedProfilePhoto : (currentUser.profilePhoto || "")
            };

            if (isSeller) {
                updatedUser.sellerCategory = getValue("sellerCategory");
                updatedUser.sellerShopName = getValue("sellerShopName");
                updatedUser.sellerBusinessType = getValue("sellerBusinessType");
                updatedUser.sellingExperience = getValue("sellingExperience");
                updatedUser.preferredSellingLocation = getValue("preferredSellingLocation");
                updatedUser.sellerProduct = getCheckboxValues("sellerProduct");
            } else {
                updatedUser.customerCategory = getValue("customerCategory");
                updatedUser.preferredBuyingLocation = getValue("preferredBuyingLocation");
                updatedUser.buyingBudget = getValue("buyingBudget");
                updatedUser.customerInterest = getCheckboxValues("customerInterest");
            }

            // 1. Save in IndexedDB via AHDAuth
            await AHDAuth.updateProfile(updatedUser);

            // 2. Sync to Backend via AHDApi if available
            if (window.AHDApi && typeof window.AHDApi.syncProfileToBackend === "function") {
                await window.AHDApi.syncProfileToBackend(updatedUser);
            }

            currentUser = updatedUser;

            showMessage("Profile updated successfully! Redirecting to Account...", "success");

            setTimeout(() => {
                window.location.href = "account.html";
            }, 700);

        } catch (err) {
            console.error("Save error:", err);
            showMessage(err.message || "Failed to save profile. Please try again.", "error");
            saveBtn.disabled = false;
            saveBtn.textContent = "Save Changes";
        }
    }

    /* =====================================================
       7. NAVIGATION & ACTIONS
    ===================================================== */
    if (backBtn) {
        backBtn.addEventListener("click", () => window.location.href = "account.html");
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => window.location.href = "account.html");
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", () => {
            const phone = currentUser?.phone || "";
            window.location.href = phone ? `forgot-password.html?phone=${encodeURIComponent(phone)}` : "forgot-password.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to logout?")) {
                await AHDAuth.logout();
                window.location.href = "login.html";
            }
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to PERMANENTLY delete your account? This action cannot be undone.")) {
                try {
                    await AHDAuth.deleteAccount();
                    alert("Your account has been deleted.");
                    window.location.href = "index.html";
                } catch (err) {
                    alert(err.message || "Unable to delete account.");
                }
            }
        });
    }

    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */
    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    }

    function setValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || "";
    }

    function getChecked(id) {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    }

    function setChecked(id, val) {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(val);
    }

    function getCheckboxValues(name) {
        const boxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(boxes).map(b => b.value);
    }

    function setCheckboxValues(name, values) {
        if (!Array.isArray(values)) return;
        const boxes = document.querySelectorAll(`input[name="${name}"]`);
        boxes.forEach(b => {
            b.checked = values.includes(b.value);
        });
    }

    function showMessage(text, type) {
        if (!messageBox) {
            alert(text);
            return;
        }
        messageBox.textContent = text;
        messageBox.className = `show ${type}`;
        messageBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
});