/* =========================================================
   AHD MARKETPLACE - MODERN LOGIN CONTROLLER (js/login.js)
   Supports unified login, direct customer/seller login,
   Password login, Phone OTP login, and SQLite/IndexedDB sync.
   ========================================================= */

let _activeRole = "customer";
let _activeMethod = "password";
const _loginOtpTimers = {};

// Switch between Customer and Seller tabs
function switchLoginTab(role) {
    _activeRole = role;
    const custTab = document.getElementById("tabCustomerBtn");
    const sellTab = document.getElementById("tabSellerBtn");

    if (role === "seller") {
        if (sellTab) sellTab.classList.add("active");
        if (custTab) custTab.classList.remove("active");
    } else {
        if (custTab) custTab.classList.add("active");
        if (sellTab) sellTab.classList.remove("active");
    }

    updateVisibleForms();
}

// Switch between Password and Mobile OTP login methods
function switchLoginMethod(method) {
    _activeMethod = method;
    const passTab = document.getElementById("btnMethodPassword");
    const otpTab = document.getElementById("btnMethodOtp");

    if (method === "otp") {
        if (otpTab) otpTab.classList.add("active");
        if (passTab) passTab.classList.remove("active");
    } else {
        if (passTab) passTab.classList.add("active");
        if (otpTab) otpTab.classList.remove("active");
    }

    updateVisibleForms();
}

// Ensure correct form is visible according to active role & method
function updateVisibleForms() {
    const isSeller = (_activeRole === "seller");
    const isOtp = (_activeMethod === "otp");

    const custPassForm = document.getElementById("customerLoginForm");
    const custOtpForm = document.getElementById("customerOtpLoginForm");
    const sellPassForm = document.getElementById("sellerLoginForm");
    const sellOtpForm = document.getElementById("sellerOtpLoginForm");

    // Unified login page (has both customer and seller forms)
    if (custPassForm && sellPassForm) {
        if (!isSeller) {
            if (custPassForm) custPassForm.style.display = !isOtp ? "block" : "none";
            if (custOtpForm) custOtpForm.style.display = isOtp ? "block" : "none";
            if (sellPassForm) sellPassForm.style.display = "none";
            if (sellOtpForm) sellOtpForm.style.display = "none";
        } else {
            if (custPassForm) custPassForm.style.display = "none";
            if (custOtpForm) custOtpForm.style.display = "none";
            if (sellPassForm) sellPassForm.style.display = !isOtp ? "block" : "none";
            if (sellOtpForm) sellOtpForm.style.display = isOtp ? "block" : "none";
        }
    } else if (custPassForm || custOtpForm) {
        // customer-login.html
        if (custPassForm) custPassForm.style.display = !isOtp ? "block" : "none";
        if (custOtpForm) custOtpForm.style.display = isOtp ? "block" : "none";
    } else if (sellPassForm || sellOtpForm) {
        // seller-login.html
        if (sellPassForm) sellPassForm.style.display = !isOtp ? "block" : "none";
        if (sellOtpForm) sellOtpForm.style.display = isOtp ? "block" : "none";
    }
}

// Request OTP for Login via Phone
async function requestLoginOtp(role) {
    const isSeller = (role === "seller");
    const phoneInputId = isSeller ? "sellerOtpPhone" : "customerOtpPhone";
    const otpInputId = isSeller ? "sellerLoginOtp" : "customerLoginOtp";
    const btnId = isSeller ? "sellerSendOtpBtn" : "customerSendOtpBtn";
    const msgId = isSeller ? "sellerOtpLoginMessage" : "customerOtpLoginMessage";

    const phoneEl = document.getElementById(phoneInputId);
    const otpEl = document.getElementById(otpInputId);
    const btnEl = document.getElementById(btnId);
    const msgEl = document.getElementById(msgId);

    if (!phoneEl) return;
    const rawPhone = phoneEl.value.trim();
    const cleanPhone = rawPhone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
        showMsg(msgEl, "Please enter a valid 10-digit mobile number.", "error");
        phoneEl.focus();
        return;
    }

    if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = "⏳ Sending SMS...";
    }

    showMsg(msgEl, `Sending login OTP to +91 ${cleanPhone}...`, "info");

    try {
        let result;
        if (typeof AHDApi !== "undefined" && AHDApi.sendOtp) {
            result = await AHDApi.sendOtp(cleanPhone, "phone");
        } else {
            const resp = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: cleanPhone, type: "phone" })
            });
            result = await resp.json();
            if (!resp.ok) throw new Error(result.error || "Failed to send OTP.");
        }

        const otpCode = result?.otp || "123456";

        // CRITICAL: The OTP field remains EMPTY! The user manually types the code they receive.
        if (otpEl) {
            otpEl.value = "";
            otpEl.placeholder = "Enter 6-digit OTP";
            otpEl.focus();
        }

        // Show realistic SMS notification banner at the top of the viewport
        if (typeof AHDApi !== "undefined" && AHDApi.showSmsBanner) {
            AHDApi.showSmsBanner(cleanPhone, otpCode, "phone");
        }

        showMsg(msgEl, `📲 SMS sent to +91 ${cleanPhone}! Enter the 6-digit code to login.`, "success");

        // Start 30s countdown timer
        if (btnEl) {
            if (_loginOtpTimers[phoneInputId]) clearInterval(_loginOtpTimers[phoneInputId]);

            let countdown = 30;
            btnEl.disabled = true;
            btnEl.textContent = `Resend in ${countdown}s`;

            _loginOtpTimers[phoneInputId] = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    btnEl.textContent = `Resend in ${countdown}s`;
                } else {
                    clearInterval(_loginOtpTimers[phoneInputId]);
                    delete _loginOtpTimers[phoneInputId];
                    btnEl.disabled = false;
                    btnEl.textContent = "📲 Resend OTP";
                }
            }, 1000);
        }
    } catch (err) {
        console.error("Login OTP error:", err);
        showMsg(msgEl, err.message || "Failed to send OTP. Please try again.", "error");
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.textContent = "📲 Send OTP";
        }
    }
}

// Submit Mobile OTP Login
async function submitOtpLogin(role) {
    const isSeller = (role === "seller");
    const phoneInputId = isSeller ? "sellerOtpPhone" : "customerOtpPhone";
    const otpInputId = isSeller ? "sellerLoginOtp" : "customerLoginOtp";
    const btnId = isSeller ? "sellerOtpLoginSubmit" : "customerOtpLoginSubmit";
    const msgId = isSeller ? "sellerOtpLoginMessage" : "customerOtpLoginMessage";

    const phoneEl = document.getElementById(phoneInputId);
    const otpEl = document.getElementById(otpInputId);
    const btnEl = document.getElementById(btnId);
    const msgEl = document.getElementById(msgId);

    const rawPhone = phoneEl ? phoneEl.value.trim() : "";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const otp = otpEl ? otpEl.value.trim() : "";

    if (cleanPhone.length !== 10) {
        showMsg(msgEl, "Please enter your 10-digit mobile number.", "error");
        if (phoneEl) phoneEl.focus();
        return;
    }

    if (!otp || otp.length !== 6) {
        showMsg(msgEl, "Please enter the 6-digit OTP received on your mobile.", "error");
        if (otpEl) otpEl.focus();
        return;
    }

    const origText = btnEl ? btnEl.textContent : "";
    if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = "<span>⏳ Verifying OTP...</span>";
    }

    try {
        let authResult;
        if (typeof AHDApi !== "undefined" && typeof AHDApi.loginWithOtp === "function") {
            authResult = await AHDApi.loginWithOtp(cleanPhone, otp, role);
        } else {
            const resp = await fetch("/api/auth/login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: cleanPhone, otp, role })
            });
            authResult = await resp.json();
            if (!resp.ok) throw new Error(authResult.error || "Login failed.");
        }

        const user = authResult?.user || {};
        const userName = user.name || "User";
        showMsg(msgEl, `✅ Welcome back, ${userName}! Opening account...`, "success");

        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get("redirect");
        const defaultTarget = (user.role === "seller" || role === "seller") ? "account.html" : "home.html";
        const targetUrl = redirectParam || defaultTarget;

        setTimeout(() => {
            window.location.replace(targetUrl);
        }, 500);

    } catch (err) {
        console.error("OTP login failed:", err);
        showMsg(msgEl, err.message || "Invalid or expired OTP. Please try again.", "error");
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.textContent = origText || "Verify OTP & Login";
        }
    }
}

// Shared Password Login Submission Logic
async function submitLogin(role) {
    const isCustomer = (role === "customer");
    const identifierInput = document.getElementById(isCustomer ? "customerEmail" : "sellerEmail");
    const passwordInput = document.getElementById(isCustomer ? "customerPassword" : "sellerPassword");
    const messageEl = document.getElementById(isCustomer ? "customerLoginMessage" : "sellerLoginMessage");
    const buttonEl = document.getElementById(isCustomer ? "customerLoginSubmit" : "sellerLoginSubmit");

    const identifier = identifierInput ? identifierInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!identifier) {
        showMsg(messageEl, "Please enter your email or 10-digit mobile number.", "error");
        if (identifierInput) identifierInput.focus();
        return;
    }

    if (!password) {
        showMsg(messageEl, "Please enter your password.", "error");
        if (passwordInput) passwordInput.focus();
        return;
    }

    const originalText = buttonEl ? buttonEl.textContent : "";
    if (buttonEl) {
        buttonEl.disabled = true;
        buttonEl.innerHTML = "<span>⏳ Logging in...</span>";
    }

    try {
        let authResult;
        if (typeof AHDApi !== "undefined" && typeof AHDApi.login === "function") {
            authResult = await AHDApi.login(identifier, password, role);
        } else if (typeof AHDAuth !== "undefined" && typeof AHDAuth.login === "function") {
            const user = await AHDAuth.login(identifier, password, role);
            authResult = { user };
        } else {
            throw new Error("Authentication service is unavailable.");
        }

        const user = authResult?.user || {};
        const userName = user.name || "User";
        showMsg(messageEl, `✅ Welcome back, ${userName}! Opening account...`, "success");

        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get("redirect");
        const defaultTarget = (user.role === "seller" || role === "seller") ? "account.html" : "home.html";
        const targetUrl = redirectParam || defaultTarget;

        setTimeout(() => {
            window.location.replace(targetUrl);
        }, 450);

    } catch (err) {
        console.error("Login failed:", err);
        showMsg(
            messageEl,
            err.message || "Invalid email/phone or password. Please try again.",
            "error"
        );
        if (buttonEl) {
            buttonEl.disabled = false;
            buttonEl.textContent = originalText || "Login";
        }
    }
}

// 1-Click Demo Login Helper
async function quickFillAndLogin(role) {
    if (role === "seller") {
        switchLoginTab("seller");
        switchLoginMethod("password");
        const emailInput = document.getElementById("sellerEmail");
        const passInput = document.getElementById("sellerPassword");
        if (emailInput) emailInput.value = "seller@ahd.in";
        if (passInput) passInput.value = "123456";
        await submitLogin("seller");
    } else {
        switchLoginTab("customer");
        switchLoginMethod("password");
        const emailInput = document.getElementById("customerEmail");
        const passInput = document.getElementById("customerPassword");
        if (emailInput) emailInput.value = "customer@ahd.in";
        if (passInput) passInput.value = "123456";
        await submitLogin("customer");
    }
}

function showMsg(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = `message ${type}`;
    el.style.display = "block";
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        if (btn) btn.textContent = "🙈";
    } else {
        input.type = "password";
        if (btn) btn.textContent = "👁️";
    }
}

// DOM Setup
document.addEventListener("DOMContentLoaded", () => {
    // Detect page context
    if (document.querySelector(".seller-login-card")) {
        _activeRole = "seller";
    } else {
        _activeRole = "customer";
    }

    // Customer Password Form Submit
    const custForm = document.getElementById("customerLoginForm");
    if (custForm) {
        custForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitLogin("customer");
        });
    }

    // Customer OTP Form Submit
    const custOtpForm = document.getElementById("customerOtpLoginForm");
    if (custOtpForm) {
        custOtpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitOtpLogin("customer");
        });
    }

    // Seller Password Form Submit
    const sellForm = document.getElementById("sellerLoginForm");
    if (sellForm) {
        sellForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitLogin("seller");
        });
    }

    // Seller OTP Form Submit
    const sellOtpForm = document.getElementById("sellerOtpLoginForm");
    if (sellOtpForm) {
        sellOtpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            submitOtpLogin("seller");
        });
    }

    // Password Toggles
    const custPassToggle = document.getElementById("customerPasswordToggle");
    if (custPassToggle) {
        custPassToggle.addEventListener("click", () => {
            togglePasswordVisibility("customerPassword", custPassToggle);
        });
    }

    const sellPassToggle = document.getElementById("sellerPasswordToggle");
    if (sellPassToggle) {
        sellPassToggle.addEventListener("click", () => {
            togglePasswordVisibility("sellerPassword", sellPassToggle);
        });
    }

    // Navigation and Redirect buttons
    const bindNav = (id, targetUrl) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", () => { window.location.href = targetUrl; });
    };

    bindNav("customerLoginButton", "customer-login.html");
    bindNav("sellerLoginButton", "seller-login.html");
    bindNav("createAccountButton", "signup.html");
    bindNav("customerCreateAccount", "customer-signup.html");
    bindNav("sellerCreateAccount", "seller-signup.html");
    bindNav("customerBackHome", "home.html");
    bindNav("sellerBackHome", "home.html");
    bindNav("backHomeButton", "home.html");
});