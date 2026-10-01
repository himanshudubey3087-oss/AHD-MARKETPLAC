/* =========================================================
   AHD MARKETPLACE - MODERN SIGNUP CONTROLLER (js/signup.js)
   Realistic OTP verification:
   ✔ OTP is generated on backend and stored in SQLite database
   ✔ Input field stays BLANK - NEVER auto-filled
   ✔ User receives SMS notification banner and manually types 6-digit OTP
   ✔ 30-second resend countdown timer
   ✔ Full registration persistence in SQLite database
   ========================================================= */

// Active countdown intervals map to prevent duplicate timers
const _otpTimers = {};

// Request OTP via backend API, save in SQLite, and alert user via SMS simulation
async function requestOtpForField(targetInputId, otpInputId, type, triggerBtn) {
    const targetEl = document.getElementById(targetInputId);
    const otpEl = document.getElementById(otpInputId);
    if (!targetEl) return;

    const val = targetEl.value.trim();
    if (!val) {
        showSignupMessage(`Please enter your ${type === 'phone' ? '10-digit mobile number' : 'email address'} first.`, "error");
        targetEl.focus();
        return;
    }

    let cleanTarget = val;
    if (type === "phone") {
        cleanTarget = val.replace(/\D/g, "");
        if (cleanTarget.length !== 10) {
            showSignupMessage("Please enter a valid 10-digit mobile number (e.g. 9876543210).", "error");
            targetEl.focus();
            return;
        }
    } else if (type === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showSignupMessage("Please enter a valid email address.", "error");
            targetEl.focus();
            return;
        }
    }

    // Disable button while requesting
    if (triggerBtn) {
        triggerBtn.textContent = type === "phone" ? "⏳ Sending SMS..." : "⏳ Sending Email...";
        triggerBtn.disabled = true;
    }

    showSignupMessage(`Sending OTP to ${type === 'phone' ? '+91 ' + cleanTarget : cleanTarget}...`, "info");

    try {
        let result;
        if (typeof AHDApi !== "undefined" && AHDApi.sendOtp) {
            result = await AHDApi.sendOtp(cleanTarget, type);
        } else {
            const resp = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: cleanTarget, type })
            });
            result = await resp.json();
        }

        if (result && (result.otp || result.success)) {
            const otpCode = result.otp || "123456";

            // CRITICAL: The OTP field MUST REMAIN COMPLETELY BLANK!
            // The user must manually type the OTP they receive.
            if (otpEl) {
                otpEl.value = "";
                otpEl.placeholder = "Enter 6-digit OTP";
                otpEl.focus();
            }

            // Display simulated SMS push banner at the top of the browser screen
            if (typeof AHDApi !== "undefined" && AHDApi.showSmsBanner) {
                AHDApi.showSmsBanner(cleanTarget, otpCode, type);
            }

            showSignupMessage(
                type === "phone"
                    ? `📲 SMS sent to +91 ${cleanTarget}! Check your phone notification and enter the 6-digit code.`
                    : `✉️ Verification email sent to ${cleanTarget}! Enter the 6-digit code.`,
                "success"
            );

            // Start 30-second cooldown timer on button
            if (triggerBtn) {
                if (_otpTimers[targetInputId]) clearInterval(_otpTimers[targetInputId]);

                let countdown = 30;
                triggerBtn.disabled = true;
                triggerBtn.textContent = `Resend in ${countdown}s`;
                triggerBtn.classList.add("sent");

                _otpTimers[targetInputId] = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        triggerBtn.textContent = `Resend in ${countdown}s`;
                    } else {
                        clearInterval(_otpTimers[targetInputId]);
                        delete _otpTimers[targetInputId];
                        triggerBtn.disabled = false;
                        triggerBtn.textContent = type === "phone" ? "📲 Resend OTP" : "✉️ Resend OTP";
                    }
                }, 1000);
            }
        } else {
            throw new Error(result.error || "Failed to send OTP.");
        }
    } catch (err) {
        console.error("OTP request error:", err);
        showSignupMessage(err.message || "Failed to send OTP. Please try again.", "error");
        if (triggerBtn) {
            triggerBtn.textContent = type === "phone" ? "📲 Send OTP" : "✉️ Send OTP";
            triggerBtn.disabled = false;
        }
    }
}

// Password toggle helper
function togglePass(inputId, btn) {
    const el = document.getElementById(inputId);
    if (!el) return;
    if (el.type === "password") {
        el.type = "text";
        if (btn) btn.textContent = "🙈";
    } else {
        el.type = "password";
        if (btn) btn.textContent = "👁️";
    }
}

// Password Strength Checker
function checkPasswordStrength(password) {
    const bar = document.getElementById("strengthBarFill");
    const label = document.getElementById("strengthLabel");
    if (!bar || !label) return;

    if (!password) {
        bar.style.width = "0%";
        bar.style.backgroundColor = "#e2e8f0";
        label.textContent = "Enter password";
        label.style.color = "#94a3b8";
        return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) {
        bar.style.width = "25%";
        bar.style.backgroundColor = "#ef4444";
        label.textContent = "Weak (min 6 chars)";
        label.style.color = "#ef4444";
    } else if (score === 2) {
        bar.style.width = "50%";
        bar.style.backgroundColor = "#f59e0b";
        label.textContent = "Fair";
        label.style.color = "#f59e0b";
    } else if (score === 3) {
        bar.style.width = "75%";
        bar.style.backgroundColor = "#10b981";
        label.textContent = "Good";
        label.style.color = "#10b981";
    } else {
        bar.style.width = "100%";
        bar.style.backgroundColor = "#059669";
        label.textContent = "Strong";
        label.style.color = "#059669";
    }
}

// Sample Data Fillers for easy testing
function fillCustomerDemoData() {
    const rand = Math.floor(100 + Math.random() * 900);
    const nameEl = document.getElementById("customerName");
    const phoneEl = document.getElementById("customerPhone");
    const emailEl = document.getElementById("customerEmail");
    const passEl = document.getElementById("customerPassword");
    const confirmEl = document.getElementById("customerConfirmPassword");

    const phoneVal = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const emailVal = `buyer${rand}@ahd.in`;

    if (nameEl) nameEl.value = `Demo Buyer ${rand}`;
    if (phoneEl) phoneEl.value = phoneVal;
    if (emailEl) emailEl.value = emailVal;
    if (passEl) {
        passEl.value = "123456";
        checkPasswordStrength("123456");
    }
    if (confirmEl) confirmEl.value = "123456";

    // Clear OTP inputs so user types them
    const pOtp = document.getElementById("customerPhoneOtp");
    const eOtp = document.getElementById("customerEmailOtp");
    if (pOtp) pOtp.value = "";
    if (eOtp) eOtp.value = "";

    showSignupMessage("Sample details filled. Click 'Send OTP' on Phone & Email to receive codes.", "info");
}

function fillSellerDemoData() {
    const rand = Math.floor(100 + Math.random() * 900);
    const nameEl = document.getElementById("sellerName");
    const phoneEl = document.getElementById("sellerPhone");
    const emailEl = document.getElementById("sellerEmail");
    const passEl = document.getElementById("sellerPassword");
    const confirmEl = document.getElementById("sellerConfirmPassword");

    const phoneVal = `91${Math.floor(10000000 + Math.random() * 90000000)}`;
    const emailVal = `store${rand}@ahd.in`;

    if (nameEl) nameEl.value = `AHD Shop & Electronics ${rand}`;
    if (phoneEl) phoneEl.value = phoneVal;
    if (emailEl) emailEl.value = emailVal;
    if (passEl) {
        passEl.value = "123456";
        checkPasswordStrength("123456");
    }
    if (confirmEl) confirmEl.value = "123456";

    const pOtp = document.getElementById("sellerPhoneOtp");
    const eOtp = document.getElementById("sellerEmailOtp");
    if (pOtp) pOtp.value = "";
    if (eOtp) eOtp.value = "";

    showSignupMessage("Sample details filled. Click 'Send OTP' on Phone & Email to receive codes.", "info");
}

function showSignupMessage(msg, type) {
    const el = document.getElementById("signupMessage");
    if (!el) return;
    el.textContent = msg;
    el.className = `message ${type}`;
    el.style.display = "block";
}

// Master Account Creation with Database Persistence
async function handleAccountCreation(formData) {
    const submitBtn = document.getElementById("signupSubmitBtn");
    const originalText = submitBtn ? submitBtn.textContent : "";

    // Validation
    if (!formData.name) {
        showSignupMessage("Please enter your full name.", "error");
        return;
    }

    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
        showSignupMessage("Please enter a valid 10-digit mobile number.", "error");
        return;
    }

    if (!formData.phoneOtp || formData.phoneOtp.length !== 6) {
        showSignupMessage("Please enter the 6-digit OTP sent to your mobile number.", "error");
        document.getElementById(formData.role === "seller" ? "sellerPhoneOtp" : "customerPhoneOtp")?.focus();
        return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showSignupMessage("Please enter a valid email address.", "error");
        return;
    }

    if (!formData.emailOtp || formData.emailOtp.length !== 6) {
        showSignupMessage("Please enter the 6-digit OTP sent to your email address.", "error");
        document.getElementById(formData.role === "seller" ? "sellerEmailOtp" : "customerEmailOtp")?.focus();
        return;
    }

    if (!formData.password || formData.password.length < 6) {
        showSignupMessage("Password must be at least 6 characters long.", "error");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        showSignupMessage("Passwords do not match.", "error");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>⏳ Verifying OTP & Saving to Database...</span>";
    }

    try {
        const payload = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            businessName: formData.role === "seller" ? formData.name : "",
            location: "Agra, Uttar Pradesh",
            phoneOtp: formData.phoneOtp,
            emailOtp: formData.emailOtp
        };

        let result;
        if (typeof AHDApi !== "undefined" && typeof AHDApi.register === "function") {
            result = await AHDApi.register(payload);
        } else {
            const resp = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            result = await resp.json();
            if (!resp.ok) throw new Error(result.error || "Failed to create account.");
        }

        showSignupMessage("✅ Account created successfully and saved to Database! Opening your account...", "success");

        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get("redirect");
        const defaultTarget = (formData.role === "seller") ? "account.html" : "home.html";
        const targetUrl = redirectParam || defaultTarget;

        setTimeout(() => {
            window.location.replace(targetUrl);
        }, 600);

    } catch (err) {
        console.error("Signup error:", err);
        showSignupMessage(err.message || "Failed to create account. Please verify OTP and details.", "error");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || "Create Account";
        }
    }
}

// DOM Setup
document.addEventListener("DOMContentLoaded", () => {
    // Customer Form Submit
    const custForm = document.getElementById("customerSignupForm");
    if (custForm) {
        custForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleAccountCreation({
                name: document.getElementById("customerName")?.value.trim(),
                phone: document.getElementById("customerPhone")?.value.trim(),
                phoneOtp: document.getElementById("customerPhoneOtp")?.value.trim(),
                email: document.getElementById("customerEmail")?.value.trim(),
                emailOtp: document.getElementById("customerEmailOtp")?.value.trim(),
                password: document.getElementById("customerPassword")?.value,
                confirmPassword: document.getElementById("customerConfirmPassword")?.value,
                role: "customer"
            });
        });
    }

    // Seller Form Submit
    const sellForm = document.getElementById("sellerSignupForm");
    if (sellForm) {
        sellForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleAccountCreation({
                name: document.getElementById("sellerName")?.value.trim(),
                phone: document.getElementById("sellerPhone")?.value.trim(),
                phoneOtp: document.getElementById("sellerPhoneOtp")?.value.trim(),
                email: document.getElementById("sellerEmail")?.value.trim(),
                emailOtp: document.getElementById("sellerEmailOtp")?.value.trim(),
                password: document.getElementById("sellerPassword")?.value,
                confirmPassword: document.getElementById("sellerConfirmPassword")?.value,
                role: "seller"
            });
        });
    }

    // Navigation buttons on signup.html
    const custBtn = document.getElementById("customerSignupButton");
    if (custBtn) custBtn.addEventListener("click", () => { window.location.href = "customer-signup.html"; });

    const sellBtn = document.getElementById("sellerSignupButton");
    if (sellBtn) sellBtn.addEventListener("click", () => { window.location.href = "seller-signup.html"; });

    const backBtn = document.getElementById("backHomeButton");
    if (backBtn) backBtn.addEventListener("click", () => { window.location.href = "home.html"; });
});
