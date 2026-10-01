/* =====================================================
   AHD MARKETPLACE
   GLOBAL JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("AHD Marketplace Frontend Loaded");

    /* ================= SEARCH ================= */

    const searchInputs =
        document.querySelectorAll("[data-search]");

    searchInputs.forEach(function (input) {

        input.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                const value =
                    input.value.trim();

                if (value !== "") {

                    window.location.href =
                        "search.html?q=" +
                        encodeURIComponent(value);

                }

            }

        });

    });


    /* ================= SELL BUTTON ================= */

    const sellButtons =
        document.querySelectorAll("[data-sell]");

    sellButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "sell.html";

        });

    });


    /* ================= ACCOUNT ================= */

    const accountButtons =
        document.querySelectorAll("[data-account]");

    accountButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            window.location.href = "account.html";

        });

    });

});