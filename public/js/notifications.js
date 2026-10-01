/* =========================================
   AHD NOTIFICATIONS MODULE
========================================= */


/*
    IMPORTANT:

    अभी notifications frontend memory में हैं।

    localStorage / sessionStorage इस्तेमाल नहीं किया गया है।

    Real AHD में इन्हें backend/database से
    dynamically load किया जाएगा.
*/


let notifications = [

    {
        id: "N001",

        type: "match",

        icon: "🎯",

        title: "New Match Found",

        message:
            "आपकी requirement के लिए नया product match मिला है।",

        time: "2 min ago",

        read: false,

        product: {

            name:
                "Samsung Galaxy S23",

            price:
                42000,

            image:
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80",

            id:
                "P001"

        },

        action:
            "matches.html"

    },


    {
        id: "N002",

        type: "message",

        icon: "💬",

        title: "New Message",

        message:
            "Rahul Sharma ने आपको message भेजा है।",

        time: "10 min ago",

        read: false,

        product: {

            name:
                "Samsung Galaxy S23",

            price:
                42000,

            image:
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80",

            id:
                "P001"

        },

        action:
            "messages.html?seller=Rahul%20Sharma&product=P001"

    },


    {
        id: "N003",

        type: "deal",

        icon: "🤝",

        title: "Offer Received",

        message:
            "आपके product के लिए ₹40,000 का offer received हुआ है।",

        time: "25 min ago",

        read: false,

        product: {

            name:
                "Samsung Galaxy S23",

            price:
                42000,

            image:
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80",

            id:
                "P001"

        },

        action:
            "deal.html?dealId=DEAL001&productId=P001"

    },


    {
        id: "N004",

        type: "deal",

        icon: "✅",

        title: "Deal Confirmed",

        message:
            "आपकी deal successfully confirm हो गई है।",

        time: "1 hour ago",

        read: true,

        product: {

            name:
                "Dell Inspiron Laptop",

            price:
                35000,

            image:
                "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=500&q=80",

            id:
                "P003"

        },

        action:
            "deal.html?dealId=DEAL002&productId=P003"

    },


    {
        id: "N005",

        type: "message",

        icon: "💬",

        title: "New Message",

        message:
            "Aman Gupta ने आपके offer का reply किया है।",

        time: "2 hours ago",

        read: true,

        product: {

            name:
                "iPhone 13 128GB",

            price:
                38000,

            image:
                "https://images.unsplash.com/photo-1592286927505-2fd4b5e8c2e7?auto=format&fit=crop&w=500&q=80",

            id:
                "P002"

        },

        action:
            "messages.html?seller=Aman%20Gupta&product=P002"

    },


    {
        id: "N006",

        type: "product",

        icon: "🛍",

        title: "Product Interested",

        message:
            "किसी buyer ने आपके product में interest दिखाया है।",

        time: "Yesterday",

        read: true,

        product: {

            name:
                "Wooden Study Table",

            price:
                4500,

            image:
                "https://images.unsplash.com/photo-1518455027359-f3f8164ba6b7?auto=format&fit=crop&w=500&q=80",

            id:
                "P005"

        },

        action:
            "product.html?id=P005"

    },


    {
        id: "N007",

        type: "deal",

        icon: "❌",

        title: "Deal Rejected",

        message:
            "Seller ने आपका previous offer reject कर दिया है।",

        time: "Yesterday",

        read: true,

        product: {

            name:
                "iPhone 13 128GB",

            price:
                38000,

            image:
                "https://images.unsplash.com/photo-1592286927505-2fd4b5e8c2e7?auto=format&fit=crop&w=500&q=80",

            id:
                "P002"

        },

        action:
            "deal.html?dealId=DEAL003&productId=P002"

    },


    {
        id: "N008",

        type: "account",

        icon: "👤",

        title: "Profile Updated",

        message:
            "आपकी AHD profile successfully update हो गई है।",

        time: "2 days ago",

        read: true,

        action:
            "account.html"

    }

];


let currentFilter = "all";

/* =========================================
   SYNC NOTIFICATIONS WITH BACKEND SQLITE
========================================= */

async function syncBackendNotifications() {
    try {
        let userId = "";
        if (typeof AHDAuth !== "undefined" && AHDAuth.getCurrentUser) {
            const user = AHDAuth.getCurrentUser();
            if (user) userId = user.id || user.email || user.phone;
        }

        const endpoint = userId ? `/api/notifications?userId=${encodeURIComponent(userId)}` : "/api/notifications";
        const res = await fetch(endpoint);
        if (!res.ok) return;

        const backendList = await res.json();
        if (Array.isArray(backendList) && backendList.length > 0) {
            backendList.forEach(bn => {
                const exists = notifications.some(n => n.id === bn.id);
                if (!exists) {
                    notifications.unshift({
                        id: bn.id,
                        type: bn.type || "worker",
                        icon: bn.type === "worker" ? "👷" : (bn.type === "order" ? "📦" : "🔔"),
                        title: bn.title || "New Notification",
                        message: bn.message || "",
                        time: bn.createdAt ? new Date(bn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
                        read: Boolean(bn.read),
                        action: bn.link || "notifications.html"
                    });
                }
            });
            renderNotifications();
            updateCounts();
        }
    } catch (_) {}
}

/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeNotifications
);


function initializeNotifications() {

    renderNotifications();

    updateCounts();

    syncBackendNotifications();


    document
        .querySelectorAll(".notification-tab")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        this.dataset.filter;


                    document
                        .querySelectorAll(
                            ".notification-tab"
                        )
                        .forEach(tab => {

                            tab.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add(
                        "active"
                    );


                    renderNotifications();

                }
            );

        });


    document
        .getElementById(
            "markAllReadButton"
        )
        .addEventListener(
            "click",
            markAllAsRead
        );

}


/* =========================================
   RENDER NOTIFICATIONS
========================================= */

function renderNotifications() {

    const list =
        document.getElementById(
            "notificationList"
        );


    const empty =
        document.getElementById(
            "emptyNotifications"
        );


    list.innerHTML = "";


    const filtered =
        notifications.filter(
            notification =>
                matchesFilter(
                    notification
                )
        );


    if (filtered.length === 0) {

        empty.classList.remove(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );


    filtered.forEach(
        notification => {

            list.insertAdjacentHTML(

                "beforeend",

                createNotificationHTML(
                    notification
                )

            );

        }
    );

}


/* =========================================
   FILTER
========================================= */

function matchesFilter(
    notification
) {

    if (
        currentFilter ===
        "all"
    ) {

        return true;

    }


    if (
        currentFilter ===
        "unread"
    ) {

        return !notification.read;

    }


    return (
        notification.type ===
        currentFilter
    );

}


/* =========================================
   CREATE CARD
========================================= */

function createNotificationHTML(
    notification
) {

    const unreadClass =
        notification.read
            ? ""
            : "unread";


    const unreadDot =
        notification.read
            ? ""
            : `<span class="unread-dot"></span>`;


    let productHTML = "";


    if (
        notification.product
    ) {

        productHTML = `

            <div class="notification-product">

                <img
                    src="${escapeAttribute(
                        notification.product.image
                    )}"
                    alt="${escapeAttribute(
                        notification.product.name
                    )}"
                >

                <div class="notification-product-info">

                    <strong>
                        ${escapeHTML(
                            notification.product.name
                        )}
                    </strong>

                    <span>
                        AHD Product
                    </span>

                </div>

                <div class="notification-product-price">

                    ₹${formatPrice(
                        notification.product.price
                    )}

                </div>

            </div>

        `;

    }


    return `

        <article
            class="notification-card ${unreadClass}"
            onclick="openNotification('${notification.id}')"
        >


            <div
                class="notification-icon ${notification.type}"
            >

                ${notification.icon}

            </div>


            <div class="notification-content">


                <div class="notification-top">

                    <h3 class="notification-title">

                        ${escapeHTML(
                            notification.title
                        )}

                        ${unreadDot}

                    </h3>


                    <span class="notification-time">

                        ${escapeHTML(
                            notification.time
                        )}

                    </span>

                </div>


                <p class="notification-message">

                    ${escapeHTML(
                        notification.message
                    )}

                </p>


                ${productHTML}


            </div>


            <div class="notification-action">

                <button
                    onclick="
                        event.stopPropagation();
                        openNotification('${notification.id}');
                    "
                >

                    Open

                </button>

            </div>


        </article>

    `;

}


/* =========================================
   OPEN NOTIFICATION
========================================= */

function openNotification(
    notificationId
) {

    const notification =
        notifications.find(
            item =>
                item.id ===
                notificationId
        );


    if (!notification) {
        return;
    }


    notification.read = true;


    updateCounts();


    if (
        notification.action
    ) {

        window.location.href =
            notification.action;

        return;

    }


    renderNotifications();

}


/* =========================================
   MARK ALL READ
========================================= */

function markAllAsRead() {

    notifications.forEach(
        notification => {

            notification.read = true;

        }
    );


    updateCounts();

    renderNotifications();

}


/* =========================================
   UPDATE COUNTS
========================================= */

function updateCounts() {

    const unread =
        notifications.filter(
            notification =>
                !notification.read
        ).length;


    const unreadElement =
        document.getElementById(
            "unreadCount"
        );


    const headerCount =
        document.getElementById(
            "headerNotificationCount"
        );


    unreadElement.textContent =
        unread;


    headerCount.textContent =
        unread;


    if (unread > 0) {

        headerCount.classList.remove(
            "hidden"
        );

    } else {

        headerCount.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   ADD NOTIFICATION
========================================= */

function addNotification(
    notification
) {

    const newNotification = {

        id:
            notification.id ||
            "N-" +
            Date.now(),

        type:
            notification.type ||
            "account",

        icon:
            notification.icon ||
            "🔔",

        title:
            notification.title ||
            "New Notification",

        message:
            notification.message ||
            "",

        time:
            notification.time ||
            "Just now",

        read:
            false,

        product:
            notification.product ||
            null,

        action:
            notification.action ||
            "notifications.html"

    };


    notifications.unshift(
        newNotification
    );


    updateCounts();

    renderNotifications();

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href =
        "home.html";

}


/* =========================================
   PRICE FORMAT
========================================= */

function formatPrice(
    price
) {

    return Number(price)
        .toLocaleString("en-IN");

}


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(value);

}