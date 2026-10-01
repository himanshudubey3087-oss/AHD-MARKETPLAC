/* =========================================================
   AHD MARKETPLACE
   FORGOT PASSWORD

   FLOW:
   Phone
      ↓
   OTP
      ↓
   New Password
      ↓
   Password Updated
      ↓
   Login

   DEMO OTP:
   123456
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           ELEMENTS
        ================================================= */

        const phoneStep =
            document.getElementById("phoneStep");

        const otpStep =
            document.getElementById("otpStep");

        const passwordStep =
            document.getElementById("passwordStep");


        const phoneInput =
            document.getElementById("phoneNumber");

        const otpInput =
            document.getElementById("otp");

        const newPasswordInput =
            document.getElementById("newPassword");

        const confirmPasswordInput =
            document.getElementById(
                "confirmPassword"
            );


        const sendOtpButton =
            document.getElementById(
                "sendOtpButton"
            );

        const verifyOtpButton =
            document.getElementById(
                "verifyOtpButton"
            );

        const resetPasswordButton =
            document.getElementById(
                "resetPasswordButton"
            );


        const message =
            document.getElementById(
                "forgotMessage"
            );


        /* =================================================
           DEMO OTP
        ================================================= */

        const DEMO_OTP =
            "123456";


        /* =================================================
           VARIABLES
        ================================================= */

        let verifiedPhone = "";

        let verifiedRole = "customer";


        /* =================================================
           EDIT PROFILE SE AAYA PHONE
           
           Example:
           forgot-password.html?phone=9876543210
        ================================================= */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const urlPhone =
            urlParams.get("phone");


        if (urlPhone) {

            const normalizedUrlPhone =
                String(urlPhone)
                    .replace(/\D/g, "");


            if (
                normalizedUrlPhone.length === 10
            ) {

                phoneInput.value =
                    normalizedUrlPhone;

            }

        }



        /* =================================================
           SEND OTP
        ================================================= */

        sendOtpButton.addEventListener(
            "click",
            async () => {

                const phone =
                    phoneInput.value
                        .trim()
                        .replace(/\D/g, "");


                clearMessage();


                /* =========================================
                   PHONE VALIDATION
                ========================================= */

                if (
                    !/^[0-9]{10}$/.test(phone)
                ) {

                    showMessage(
                        "Please enter a valid 10 digit mobile number.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   BUTTON STATE
                ========================================= */

                sendOtpButton.disabled =
                    true;

                sendOtpButton.textContent =
                    "Checking...";


                try {

                    /* =====================================
                       FIND USER
                    ===================================== */

                    const user =
                        await AHDAuth.findUserByPhone(
                            phone
                        );


                    if (!user) {

                        showMessage(
                            "This mobile number is not registered.",
                            "error"
                        );

                        return;

                    }


                    /* =====================================
                       SAVE VERIFIED PHONE
                    ===================================== */

                    verifiedPhone =
                        phone;


                    verifiedRole =
                        user.role ||
                        "customer";


                    /* =====================================
                       MOVE TO OTP
                    ===================================== */

                    phoneStep.style.display =
                        "none";

                    otpStep.style.display =
                        "block";


                    showMessage(
                        "OTP sent successfully. Demo OTP is 123456.",
                        "success"
                    );


                } catch (error) {

                    showMessage(
                        error.message ||
                        "Unable to send OTP.",
                        "error"
                    );

                } finally {

                    sendOtpButton.disabled =
                        false;

                    sendOtpButton.textContent =
                        "Send OTP";

                }

            }
        );



        /* =================================================
           VERIFY OTP
        ================================================= */

        verifyOtpButton.addEventListener(
            "click",
            () => {

                const otp =
                    otpInput.value
                        .trim();


                clearMessage();


                /* =========================================
                   OTP VALIDATION
                ========================================= */

                if (
                    !verifiedPhone
                ) {

                    showMessage(
                        "Please verify your mobile number first.",
                        "error"
                    );

                    return;

                }


                if (
                    otp !== DEMO_OTP
                ) {

                    showMessage(
                        "Invalid OTP. Please enter the correct OTP.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   OTP VERIFIED
                ========================================= */

                otpStep.style.display =
                    "none";

                passwordStep.style.display =
                    "block";


                showMessage(
                    "OTP verified successfully.",
                    "success"
                );

            }
        );



        /* =================================================
           RESET PASSWORD
        ================================================= */

        resetPasswordButton.addEventListener(
            "click",
            async () => {

                const newPassword =
                    newPasswordInput.value;


                const confirmPassword =
                    confirmPasswordInput.value;


                clearMessage();


                /* =========================================
                   PHONE VERIFICATION CHECK
                ========================================= */

                if (
                    !verifiedPhone
                ) {

                    showMessage(
                        "Please verify your mobile number first.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   PASSWORD EMPTY CHECK
                ========================================= */

                if (
                    !newPassword ||
                    !confirmPassword
                ) {

                    showMessage(
                        "Please fill both password fields.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   PASSWORD LENGTH
                ========================================= */

                if (
                    newPassword.length < 6
                ) {

                    showMessage(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   PASSWORD MATCH
                ========================================= */

                if (
                    newPassword !==
                    confirmPassword
                ) {

                    showMessage(
                        "Password and Confirm Password do not match.",
                        "error"
                    );

                    return;

                }


                /* =========================================
                   BUTTON STATE
                ========================================= */

                resetPasswordButton.disabled =
                    true;

                resetPasswordButton.textContent =
                    "Updating Password...";


                try {

                    /* =====================================
                       UPDATE PASSWORD
                    ===================================== */

                    const result =
                        await AHDAuth.resetPassword(
                            verifiedPhone,
                            newPassword
                        );


                    if (!result) {

                        throw new Error(
                            "Password update failed."
                        );

                    }

/* =====================================
   SUCCESS
===================================== */

showMessage(
    "Password reset successfully! Redirecting to login...",
    "success"
);


/* =====================================
   LOGIN PAGE FIX

   Customer Forgot Password
   → Customer Login

   Seller Forgot Password
   → Seller Login
===================================== */

setTimeout(() => {

    const referrer =
        document.referrer.toLowerCase();


    /* =================================
       SELLER LOGIN SE FORGOT PASSWORD
    ================================= */

    if (
        referrer.includes("seller-login.html")
    ) {

        window.location.replace(
            "seller-login.html"
        );

    }

    /* =================================
       CUSTOMER LOGIN SE FORGOT PASSWORD
    ================================= */

    else {

        window.location.replace(
            "customer-login.html"
        );

    }

}, 1200);


                } catch (error) {

                    showMessage(
                        error.message ||
                        "Unable to reset password.",
                        "error"
                    );


                } finally {

                    resetPasswordButton.disabled =
                        false;

                    resetPasswordButton.textContent =
                        "Reset Password";

                }

            }
        );



        /* =================================================
           SHOW MESSAGE
        ================================================= */

        function showMessage(
            text,
            type
        ) {

            if (!message) {
                return;
            }


            message.textContent =
                text;


            message.className =
                "message " + type;

        }



        /* =================================================
           CLEAR MESSAGE
        ================================================= */

        function clearMessage() {

            if (!message) {
                return;
            }


            message.textContent =
                "";


            message.className =
                "message";

        }

    }
);