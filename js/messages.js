/* =========================================================
   AHD MARKETPLACE
   MESSAGES + WORKER REQUEST SYSTEM
========================================================= */


/* =========================================================
   DEMO CHATS
========================================================= */

let chats = [

    {
        id: "CHAT001",
        type: "PRODUCT",
        name: "Rahul Sharma",
        avatar: "https://i.pravatar.cc/150?img=11",
        status: "Online",
        product: {
            id: "P001",
            name: "iPhone 13",
            price: "₹38,000",
            image: "https://picsum.photos/300/200?random=11"
        },
        messages: [
            {
                sender: "them",
                text: "Hello, iPhone available hai.",
                time: "10:30 AM"
            },
            {
                sender: "me",
                text: "Last price kya hai?",
                time: "10:32 AM"
            },
            {
                sender: "them",
                text: "₹37,000 final.",
                time: "10:34 AM"
            }
        ]
    },

    {
        id: "CHAT002",
        type: "PRODUCT",
        name: "Amit Singh",
        avatar: "https://i.pravatar.cc/150?img=15",
        status: "Online",
        product: {
            id: "P002",
            name: "HP Laptop",
            price: "₹28,000",
            image: "https://picsum.photos/300/200?random=12"
        },
        messages: [
            {
                sender: "them",
                text: "Laptop abhi available hai.",
                time: "11:10 AM"
            }
        ]
    }

];


/* =========================================================
   CURRENT CHAT
========================================================= */

let activeChatId = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeMessages();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeMessages() {

    checkIncomingWorkerRequest();

    checkIncomingSellerChat();

    renderChatList();

    setupSearch();

    setupMessageForm();

}


/* =========================================================
   CHECK WORKER REQUEST
========================================================= */

function checkIncomingWorkerRequest() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const type =
        params.get("type");


    /*
       Worker request only
    */

    if (
        type !== "worker-request"
    ) {

        return;

    }


    const workerId =
        params.get("workerId");


    const workerName =
        params.get("workerName") ||
        params.get("worker") ||
        "Worker";


    const workerRole =
        params.get("workerRole") ||
        params.get("role") ||
        "Professional Worker";


    const workerAvatar =
        params.get("workerAvatar") ||
        "https://i.pravatar.cc/150?img=12";


    const requestId =
        params.get("requestId") ||
        "WORK-" + Date.now();


    const workTitle =
        params.get("workTitle") ||
        "Work Request";


    const budget =
        params.get("budget") ||
        "To be discussed";


    const location =
        params.get("location") ||
        "To be discussed";


    const workDate =
        params.get("workDate") ||
        "To be discussed";


    const duration =
        params.get("duration") ||
        "To be discussed";


    const details =
        params.get("details") ||
        "Customer wants to discuss this work with you.";


    /*
       Check if chat already exists
    */

    let chat =
        chats.find(
            function (item) {

                return (
                    item.type === "WORKER" &&
                    item.workerId === workerId
                );

            }
        );


    /*
       Create worker chat
    */

    if (!chat) {

        chat = {

            id:
                "WORKCHAT-" +
                Date.now(),

            type:
                "WORKER",

            workerId:
                workerId,

            name:
                workerName,

            role:
                workerRole,

            avatar:
                workerAvatar,

            status:
                "Request Pending",

            workRequest: {

                requestId:
                    requestId,

                status:
                    "Pending",

                title:
                    workTitle,

                budget:
                    budget,

                location:
                    location,

                date:
                    workDate,

                duration:
                    duration,

                details:
                    details

            },

            messages: [

                {
                    sender:
                        "system",

                    text:
                        "You selected " +
                        workerName +
                        " as your worker.",

                    time:
                        getCurrentTime()

                }

            ]

        };


        chats.unshift(
            chat
        );

    }

    else {

        /*
           Update existing request
        */

        chat.workRequest = {

            requestId:
                requestId,

            status:
                "Pending",

            title:
                workTitle,

            budget:
                budget,

            location:
                location,

            date:
                workDate,

            duration:
                duration,

            details:
                details

        };


        chat.status =
            "Request Pending";

    }


    /*
       Open selected worker
    */

    activeChatId =
        chat.id;


    renderChatList();

    openChat(
        chat.id
    );

}


/* =========================================================
   SELLER CHAT
========================================================= */

function checkIncomingSellerChat() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    /*
       Don't process worker request
    */

    if (
        params.get("type") ===
        "worker-request"
    ) {

        return;

    }


    const seller =
        params.get("seller");


    const product =
        params.get("product");


    if (
        !seller &&
        !product
    ) {

        return;

    }


    let chat =
        chats.find(
            function (item) {

                return (
                    item.type === "PRODUCT" &&
                    item.name === seller
                );

            }
        );


    if (!chat) {

        chat = {

            id:
                "CHAT-" +
                Date.now(),

            type:
                "PRODUCT",

            name:
                seller ||
                "Seller",

            avatar:
                "https://i.pravatar.cc/150?img=16",

            status:
                "Online",

            product: {

                id:
                    "PRODUCT-" +
                    Date.now(),

                name:
                    product ||
                    "Product",

                price:
                    "Price not available",

                image:
                    "https://picsum.photos/300/200?random=20"

            },

            messages: [

                {

                    sender:
                        "system",

                    text:
                        "Chat started with seller.",

                    time:
                        getCurrentTime()

                }

            ]

        };


        chats.unshift(
            chat
        );

    }


    activeChatId =
        chat.id;


    renderChatList();

    openChat(
        chat.id
    );

}


/* =========================================================
   RENDER CHAT LIST
========================================================= */

function renderChatList() {

    const container =
        document.getElementById(
            "chatList"
        );


    if (!container) return;


    container.innerHTML = "";


    const total =
        document.getElementById(
            "totalChats"
        );


    if (total) {

        total.textContent =
            chats.length;

    }


    if (
        chats.length === 0
    ) {

        container.innerHTML = `

            <div class="no-chats">

                <div>
                    💬
                </div>

                <p>
                    No conversations yet
                </p>

            </div>

        `;

        return;

    }


    chats.forEach(
        function (chat) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "chat-item";


            if (
                chat.id ===
                activeChatId
            ) {

                item.classList.add(
                    "active"
                );

            }


            const lastMessage =
                getLastMessage(
                    chat
                );


            item.innerHTML = `

                <img
                    src="${chat.avatar}"
                    alt="${escapeHTML(chat.name)}"
                >

                <div class="chat-item-info">

                    <div class="chat-item-top">

                        <strong>
                            ${escapeHTML(chat.name)}
                        </strong>

                        <small>
                            ${lastMessage.time}
                        </small>

                    </div>

                    <div class="chat-item-bottom">

                        <span>
                            ${escapeHTML(lastMessage.text)}
                        </span>

                        <b class="${chat.type.toLowerCase()}-badge">
                            ${chat.type}
                        </b>

                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    openChat(
                        chat.id
                    );

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   OPEN CHAT
========================================================= */

function openChat(chatId) {

    const chat =
        chats.find(
            function (item) {

                return item.id === chatId;

            }
        );


    if (!chat) return;


    activeChatId =
        chatId;


    const empty =
        document.getElementById(
            "emptyChat"
        );


    const active =
        document.getElementById(
            "activeChat"
        );


    if (empty) {

        empty.style.display =
            "none";

    }


    if (active) {

        active.style.display =
            "flex";

    }


    renderActiveChat(
        chat
    );


    renderChatList();

}


/* =========================================================
   RENDER ACTIVE CHAT
========================================================= */

function renderActiveChat(chat) {


    /* -----------------------------------------------------
       HEADER
    ----------------------------------------------------- */

    const avatar =
        document.getElementById(
            "activeAvatar"
        );


    if (avatar) {

        avatar.src =
            chat.avatar;

        avatar.alt =
            chat.name;

    }


    setText(
        "activeName",
        chat.name
    );


    setText(
        "activeStatus",
        chat.status
    );


    /* -----------------------------------------------------
       DETAILS
    ----------------------------------------------------- */

    renderChatDetails(
        chat
    );


    /* -----------------------------------------------------
       MESSAGES
    ----------------------------------------------------- */

    renderMessages(
        chat
    );

}


/* =========================================================
   CHAT DETAILS
========================================================= */

function renderChatDetails(chat) {

    const product =
        document.getElementById(
            "chatProduct"
        );


    const workerRequest =
        document.getElementById(
            "workerRequestPanel"
        );


    /*
       PRODUCT CHAT
    */

    if (
        chat.type === "PRODUCT"
    ) {

        if (product) {

            product.style.display =
                "block";


            product.innerHTML = `

                <div class="chat-product-card">

                    <img
                        src="${chat.product.image}"
                        alt=""
                    >

                    <div>

                        <strong>
                            ${escapeHTML(chat.product.name)}
                        </strong>

                        <p>
                            ${escapeHTML(chat.product.price)}
                        </p>

                    </div>

                </div>

            `;

        }


        if (workerRequest) {

            workerRequest.style.display =
                "none";

        }


        const productButton =
            document.getElementById(
                "productButton"
            );


        if (productButton) {

            productButton.style.display =
                "inline-flex";

        }


        return;

    }


    /*
       WORKER CHAT
    */

    if (
        chat.type === "WORKER"
    ) {

        if (product) {

            product.style.display =
                "none";

        }


        const productButton =
            document.getElementById(
                "productButton"
            );


        if (productButton) {

            productButton.style.display =
                "none";

        }


        if (workerRequest) {

            workerRequest.style.display =
                "block";

            renderWorkerRequest(
                chat
            );

        }

    }

}


/* =========================================================
   WORKER REQUEST
========================================================= */

function renderWorkerRequest(chat) {

    const request =
        chat.workRequest;


    if (!request) return;


    const summary =
        document.getElementById(
            "requestSummary"
        );


    if (summary) {

        summary.innerHTML = `

            <div class="request-row">

                <span>
                    Work
                </span>

                <strong>
                    ${escapeHTML(request.title)}
                </strong>

            </div>


            <div class="request-row">

                <span>
                    Budget
                </span>

                <strong>
                    ₹${escapeHTML(
                        String(request.budget)
                    )}
                </strong>

            </div>


            <div class="request-row">

                <span>
                    Location
                </span>

                <strong>
                    ${escapeHTML(request.location)}
                </strong>

            </div>


            <div class="request-row">

                <span>
                    Date
                </span>

                <strong>
                    ${escapeHTML(request.date)}
                </strong>

            </div>


            <div class="request-row">

                <span>
                    Duration
                </span>

                <strong>
                    ${escapeHTML(request.duration)}
                </strong>

            </div>


            <div class="request-description">

                <span>
                    Details
                </span>

                <p>
                    ${escapeHTML(request.details)}
                </p>

            </div>


            <div class="request-status">

                Status:

                <strong>
                    ${escapeHTML(request.status)}
                </strong>

            </div>

        `;

    }


    updateRequestButtons(
        request.status
    );

}


/* =========================================================
   ACCEPT / REJECT BUTTON STATE
========================================================= */

function updateRequestButtons(status) {

    const accept =
        document.getElementById(
            "acceptRequestBtn"
        );


    const reject =
        document.getElementById(
            "rejectRequestBtn"
        );


    if (!accept || !reject) return;


    if (
        status === "Accepted"
    ) {

        accept.disabled =
            true;

        reject.disabled =
            true;

        accept.textContent =
            "✓ Accepted";

        reject.textContent =
            "Rejected";

        return;

    }


    if (
        status === "Rejected"
    ) {

        accept.disabled =
            true;

        reject.disabled =
            true;

        accept.textContent =
            "Request Rejected";

        reject.textContent =
            "✕ Rejected";

        return;

    }


    accept.disabled =
        false;

    reject.disabled =
        false;

    accept.textContent =
        "✓ Accept Request";

    reject.textContent =
        "✕ Reject Request";


    /*
       Attach buttons only once
    */

    accept.onclick =
        acceptWorkerRequest;

    reject.onclick =
        rejectWorkerRequest;

}


/* =========================================================
   ACCEPT WORKER REQUEST
========================================================= */

function acceptWorkerRequest() {

    const chat =
        getActiveChat();


    if (!chat) return;


    if (
        chat.type !== "WORKER"
    ) return;


    if (!chat.workRequest) return;


    chat.workRequest.status =
        "Accepted";


    chat.status =
        "Request Accepted";


    chat.messages.push({

        sender:
            "system",

        text:
            "✓ Worker request accepted. You can now continue the conversation.",

        time:
            getCurrentTime()

    });


    renderActiveChat(
        chat
    );


    renderChatList();


window.location.href =
    "deal.html?workerId=" +
    encodeURIComponent(chat.worker.id) +
    "&workerName=" +
    encodeURIComponent(chat.worker.name) +
    "&workerRole=" +
    encodeURIComponent(chat.worker.role) +
    "&workTitle=" +
    encodeURIComponent(chat.request.workTitle) +
    "&budget=" +
    encodeURIComponent(chat.request.budget) +
    "&location=" +
    encodeURIComponent(chat.request.location) +
    "&workDate=" +
    encodeURIComponent(chat.request.workDate) +
    "&duration=" +
    encodeURIComponent(chat.request.duration) +
    "&details=" +
    encodeURIComponent(chat.request.details) +
    "&status=Accepted" +
    "&type=worker";

}
/* =========================================================
   REJECT WORKER REQUEST
========================================================= */

function rejectWorkerRequest() {

    const chat =
        getActiveChat();


    if (!chat) return;


    if (
        chat.type !== "WORKER"
    ) return;


    if (!chat.workRequest) return;


    chat.workRequest.status =
        "Rejected";


    chat.status =
        "Request Rejected";


    chat.messages.push({

        sender:
            "system",

        text:
            "✕ Worker request was rejected.",

        time:
            getCurrentTime()

    });


    renderActiveChat(
        chat
    );


    renderChatList();

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages(chat) {

    const container =
        document.getElementById(
            "messageArea"
        );


    if (!container) return;


    container.innerHTML = "";


    chat.messages.forEach(
        function (message) {

            const div =
                document.createElement(
                    "div"
                );


            if (
                message.sender ===
                "system"
            ) {

                div.className =
                    "system-message";

                div.innerHTML = `

                    <span>
                        ${escapeHTML(message.text)}
                    </span>

                `;

            }

            else {

                div.className =
                    "message " +
                    (
                        message.sender ===
                        "me"
                            ? "sent"
                            : "received"
                    );


                div.innerHTML = `

                    <div class="message-bubble">

                        <p>
                            ${escapeHTML(message.text)}
                        </p>

                        <small>
                            ${escapeHTML(message.time)}
                        </small>

                    </div>

                `;

            }


            container.appendChild(
                div
            );

        }
    );


    /*
       Scroll bottom
    */

    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   MESSAGE FORM
========================================================= */

function setupMessageForm() {

    const form =
        document.getElementById(
            "messageForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            sendMessage();

        }
    );

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) return;


    const text =
        input.value.trim();


    if (!text) return;


    const chat =
        getActiveChat();


    if (!chat) return;


    chat.messages.push({

        sender:
            "me",

        text:
            text,

        time:
            getCurrentTime()

    });


    input.value = "";


    renderMessages(
        chat
    );


    renderChatList();


    simulateReply(
        chat
    );

}


/* =========================================================
   SIMULATE REPLY
========================================================= */

function simulateReply(chat) {

    const typing =
        document.getElementById(
            "typingIndicator"
        );


    if (typing) {

        typing.style.display =
            "block";

    }


    setTimeout(
        function () {

            if (typing) {

                typing.style.display =
                    "none";

            }


            let reply;


            if (
                chat.type ===
                "WORKER"
            ) {

                if (
                    chat.workRequest &&
                    chat.workRequest.status ===
                    "Accepted"
                ) {

                    reply =
                        "Ji, request accepted hai. Work ke details discuss kar lete hain.";

                }

                else {

                    reply =
                        "Ji, aap work ki details bata sakte hain.";

                }

            }

            else {

                reply =
                    "Ji, bataiye. Main aapki help karta hoon.";

            }


            chat.messages.push({

                sender:
                    "them",

                text:
                    reply,

                time:
                    getCurrentTime()

            });


            renderMessages(
                chat
            );


            renderChatList();

        },

        1200
    );

}


/* =========================================================
   SEARCH CHAT
========================================================= */

function setupSearch() {

    const search =
        document.getElementById(
            "chatSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        function () {

            const value =
                search.value
                    .trim()
                    .toLowerCase();


            const items =
                document.querySelectorAll(
                    ".chat-item"
                );


            chats.forEach(
                function (chat, index) {

                    const item =
                        items[index];

                    if (!item) return;


                    const match =
                        chat.name
                            .toLowerCase()
                            .includes(
                                value
                            );


                    item.style.display =
                        match
                            ? "flex"
                            : "none";

                }
            );

        }
    );

}


/* =========================================================
   OPEN PROFILE
========================================================= */

function openProfile() {

    const chat =
        getActiveChat();


    if (!chat) return;


    if (
        chat.type ===
        "WORKER"
    ) {

        window.location.href =
            "worker-profile.html?workerId=" +
            encodeURIComponent(
                chat.workerId
            );

        return;

    }


    window.location.href =
        "seller-profile.html?sellerId=" +
        encodeURIComponent(
            chat.sellerId || ""
        );

}


/* =========================================================
   OPEN PRODUCT
========================================================= */

function openProduct() {

    const chat =
        getActiveChat();


    if (!chat) return;


    if (
        chat.type !==
        "PRODUCT"
    ) {

        return;

    }


    const productId =
        chat.product?.id;


    window.location.href =
        "product.html?id=" +
        encodeURIComponent(
            productId
        );

}


/* =========================================================
   OPEN DEAL
========================================================= */

function openDeal() {

    const chat =
        getActiveChat();


    if (!chat) return;


    if (
        chat.type ===
        "WORKER"
    ) {

        window.location.href =
            "deal.html?type=worker&workerId=" +
            encodeURIComponent(
                chat.workerId
            );

        return;

    }


    window.location.href =
        "deal.html?type=product&productId=" +
        encodeURIComponent(
            chat.product?.id || ""
        );

}


/* =========================================================
   GET ACTIVE CHAT
========================================================= */

function getActiveChat() {

    return chats.find(
        function (chat) {

            return (
                chat.id ===
                activeChatId
            );

        }
    );

}


/* =========================================================
   GET LAST MESSAGE
========================================================= */

function getLastMessage(chat) {

    if (
        !chat.messages ||
        chat.messages.length === 0
    ) {

        return {

            text: "No messages",

            time: ""

        };

    }


    return chat.messages[
        chat.messages.length - 1
    ];

}


/* =========================================================
   CURRENT TIME
========================================================= */

function getCurrentTime() {

    return new Date().toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}