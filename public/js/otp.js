// ==========================================
// AHD OTP SYSTEM
// ==========================================
//
// FRONTEND OTP UI
//
// Real OTP SMS/email service will later
// be connected through backend/API.
//
// No localStorage/sessionStorage.
// ==========================================


const AHDOTP = (function () {

    let verificationData = null;

    let countdownTimer = null;

    let remainingSeconds = 30;


    // --------------------------------------
    // START OTP VERIFICATION
    // --------------------------------------

    function startVerification(mobile, accountType) {

        verificationData = {

            mobile: mobile,

            accountType: accountType,

            createdAt: new Date().toISOString()

        };


        /*
            Temporary frontend behavior.

            Backend integration ke baad:
            API → SMS Gateway → OTP
        */


        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        console.log(
            "AHD TEST OTP:",
            otp
        );


        showOTPBox(
            mobile,
            accountType
        );


        startCountdown();

    }


    // --------------------------------------
    // OTP BOX
    // --------------------------------------

    function showOTPBox(mobile, accountType) {

        const oldBox =
            document.getElementById("ahdOtpModal");

        if (oldBox) {

            oldBox.remove();

        }


        const modal =
            document.createElement("div");

        modal.id =
            "ahdOtpModal";


        modal.innerHTML = `

            <div style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.55);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:99999;
                padding:20px;
            ">

                <div style="
                    width:100%;
                    max-width:420px;
                    background:#fff;
                    border-radius:20px;
                    padding:30px;
                    text-align:center;
                    box-shadow:0 20px 60px rgba(0,0,0,.2);
                ">

                    <div style="
                        width:60px;
                        height:60px;
                        border-radius:15px;
                        background:#eff6ff;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        margin:0 auto 15px;
                        font-size:25px;
                    ">
                        🔐
                    </div>

                    <h2>
                        Verify Mobile Number
                    </h2>

                    <p style="
                        color:#6b7280;
                        margin:10px 0 20px;
                        line-height:1.5;
                    ">
                        Enter the 6-digit OTP sent to
                        <strong>
                            ${maskMobile(mobile)}
                        </strong>
                    </p>

                    <input
                        id="ahdOtpInput"
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        placeholder="Enter OTP"
                        style="
                            width:100%;
                            padding:15px;
                            border:1px solid #d1d5db;
                            border-radius:10px;
                            text-align:center;
                            font-size:22px;
                            letter-spacing:8px;
                            outline:none;
                        "
                    >

                    <div
                        id="ahdOtpMessage"
                        style="
                            min-height:20px;
                            margin:12px 0;
                            font-size:14px;
                        "
                    ></div>

                    <button
                        id="verifyOtpBtn"
                        style="
                            width:100%;
                            padding:14px;
                            border:none;
                            border-radius:10px;
                            background:#2563eb;
                            color:white;
                            font-weight:700;
                            cursor:pointer;
                        "
                    >
                        Verify OTP
                    </button>

                    <button
                        id="resendOtpBtn"
                        disabled
                        style="
                            margin-top:14px;
                            background:none;
                            border:none;
                            color:#2563eb;
                            cursor:pointer;
                        "
                    >
                        Resend OTP
                        (<span id="otpTimer">30</span>)
                    </button>

                    <button
                        id="closeOtpBtn"
                        style="
                            display:block;
                            margin:15px auto 0;
                            border:none;
                            background:none;
                            color:#6b7280;
                            cursor:pointer;
                        "
                    >
                        Cancel
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        document
            .getElementById("verifyOtpBtn")
            .addEventListener(
                "click",
                verifyOTP
            );


        document
            .getElementById("resendOtpBtn")
            .addEventListener(
                "click",
                resendOTP
            );


        document
            .getElementById("closeOtpBtn")
            .addEventListener(
                "click",
                closeOTP
            );


        document
            .getElementById("ahdOtpInput")
            .focus();

    }


    // --------------------------------------
    // VERIFY
    // --------------------------------------

    function verifyOTP() {

        const input =
            document.getElementById(
                "ahdOtpInput"
            );


        const message =
            document.getElementById(
                "ahdOtpMessage"
            );


        if (!input) return;


        const entered =
            input.value.trim();


        if (!/^[0-9]{6}$/.test(entered)) {

            message.style.color =
                "#dc2626";

            message.textContent =
                "Please enter a valid 6-digit OTP.";

            return;

        }


        /*
            Development frontend:

            Console mein generated OTP show hota hai.

            Production mein OTP backend se verify hoga.
        */

        message.style.color =
            "#16a34a";

        message.textContent =
            "OTP verified successfully!";


        setTimeout(function () {

            closeOTP();


            alert(
                "Mobile verified successfully.\n\nYour account creation flow is ready for backend integration."
            );

        }, 700);

    }


    // --------------------------------------
    // RESEND
    // --------------------------------------

    function resendOTP() {

        if (!verificationData) return;


        const newOtp =
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        console.log(
            "AHD NEW TEST OTP:",
            newOtp
        );


        const message =
            document.getElementById(
                "ahdOtpMessage"
            );


        if (message) {

            message.style.color =
                "#2563eb";

            message.textContent =
                "New OTP generated. Check console in development mode.";

        }


        startCountdown();

    }


    // --------------------------------------
    // COUNTDOWN
    // --------------------------------------

    function startCountdown() {

        clearInterval(
            countdownTimer
        );


        remainingSeconds = 30;


        const timer =
            document.getElementById(
                "otpTimer"
            );

        const resend =
            document.getElementById(
                "resendOtpBtn"
            );


        if (resend) {

            resend.disabled = true;

        }


        countdownTimer =
            setInterval(function () {

                remainingSeconds--;


                const timerElement =
                    document.getElementById(
                        "otpTimer"
                    );


                if (timerElement) {

                    timerElement.textContent =
                        remainingSeconds;

                }


                if (remainingSeconds <= 0) {

                    clearInterval(
                        countdownTimer
                    );


                    if (resend) {

                        resend.disabled = false;

                        resend.innerHTML =
                            "Resend OTP";

                    }

                }

            }, 1000);

    }


    // --------------------------------------
    // CLOSE
    // --------------------------------------

    function closeOTP() {

        clearInterval(
            countdownTimer
        );


        const modal =
            document.getElementById(
                "ahdOtpModal"
            );


        if (modal) {

            modal.remove();

        }

    }


    // --------------------------------------
    // MOBILE MASK
    // --------------------------------------

    function maskMobile(mobile) {

        if (!mobile) {

            return "";

        }


        if (mobile.length !== 10) {

            return mobile;

        }


        return (
            mobile.substring(0, 2) +
            "******" +
            mobile.substring(8)
        );

    }


    return {

        startVerification,
        verifyOTP,
        resendOTP,
        closeOTP

    };

})();