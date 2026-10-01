/* =========================================================
   AHD MARKETPLACE
   WORKER PROFILE SYSTEM
   CONFIRM WORKER → WORKER CHAT / REQUEST
========================================================= */


/* =========================================================
   WORKERS DATABASE
========================================================= */

const workers = {

    /* -----------------------------------------------------
       WORKER W001
    ----------------------------------------------------- */

    W001: {

        id: "W001",

        name: "Rakesh Kumar",

        role: "Electrician",

        location: "Agra, Uttar Pradesh",

        rating: 4.8,

        reviews: 126,

        experience: "7 Years",

        charge: 500,

        avatar: "https://i.pravatar.cc/300?img=12",

        verified: true,

        available: true,

        about:
            "Professional electrician with 7+ years of experience. I provide home wiring, electrical repair, fan installation, switchboard repair and other electrical services.",

        skills: [
            "Home Wiring",
            "Electrical Repair",
            "Fan Installation",
            "Switchboard Repair",
            "MCB Installation",
            "Inverter Installation",
            "Fault Finding"
        ],

        experienceList: [

            {
                icon: "⚡",
                title: "Residential Electrical Work",
                text:
                    "5+ years working on residential electrical projects."
            },

            {
                icon: "🔧",
                title: "Electrical Repair",
                text:
                    "Experienced in diagnosing and repairing electrical faults."
            },

            {
                icon: "🏠",
                title: "Home Wiring",
                text:
                    "Complete wiring and rewiring services."
            }

        ],

        workHistory: [

            {
                title: "Complete Home Wiring",
                company: "Private Customer",
                location: "Agra",
                date: "2026"
            },

            {
                title: "Electrical Repair & Maintenance",
                company: "Residential Project",
                location: "Agra",
                date: "2025"
            }

        ],

        preferredLocation: "Agra & Nearby",

        workingHours: "9 AM - 7 PM",

        preferredJobType: "Full Time / Part Time",

        job: {

            title: "Electrician Required",

            type: "Full Time",

            salary: "₹15,000 - ₹20,000 / Month",

            location: "Agra",

            posted: "2 days ago"

        },

        reviewsList: [

            {
                name: "Amit",
                rating: 5,
                text:
                    "Very good work. Came on time and completed the electrical repair properly."
            },

            {
                name: "Rahul",
                rating: 5,
                text:
                    "Professional and reasonable charges. Recommended."
            }

        ]

    },


    /* -----------------------------------------------------
       WORKER W002
    ----------------------------------------------------- */

    W002: {

        id: "W002",

        name: "Amit Sharma",

        role: "Maths Tutor",

        location: "Agra, Uttar Pradesh",

        rating: 4.9,

        reviews: 98,

        experience: "5 Years",

        charge: 400,

        avatar: "https://i.pravatar.cc/300?img=13",

        verified: true,

        available: true,

        about:
            "Experienced mathematics tutor helping students understand mathematics through simple concepts, examples and regular practice.",

        skills: [

            "Mathematics",
            "Algebra",
            "Geometry",
            "Calculus",
            "School Tuition",
            "Exam Preparation"

        ],

        experienceList: [

            {
                icon: "📚",
                title: "School Tuition",
                text:
                    "Teaching mathematics to school students."
            },

            {
                icon: "🎓",
                title: "Exam Preparation",
                text:
                    "Special focus on board and competitive exams."
            }

        ],

        workHistory: [

            {
                title: "Mathematics Tutor",
                company: "Private Tuition",
                location: "Agra",
                date: "2026"
            }

        ],

        preferredLocation: "Agra",

        workingHours: "4 PM - 9 PM",

        preferredJobType: "Part Time",

        job: {

            title: "Mathematics Tutor Required",

            type: "Part Time",

            salary: "₹8,000 - ₹15,000 / Month",

            location: "Agra",

            posted: "1 day ago"

        },

        reviewsList: [

            {
                name: "Pooja",
                rating: 5,
                text:
                    "Explains difficult maths concepts very easily."
            },

            {
                name: "Neha",
                rating: 5,
                text:
                    "Very helpful and patient teacher."
            }

        ]

    },


    /* -----------------------------------------------------
       WORKER W003
    ----------------------------------------------------- */

    W003: {

        id: "W003",

        name: "Mohit Verma",

        role: "Computer Technician",

        location: "Firozabad, Uttar Pradesh",

        rating: 4.7,

        reviews: 74,

        experience: "6 Years",

        charge: 350,

        avatar: "https://i.pravatar.cc/300?img=14",

        verified: true,

        available: true,

        about:
            "Computer technician providing laptop, desktop, software and networking support for homes, students and small businesses.",

        skills: [

            "Laptop Repair",
            "Desktop Repair",
            "Windows Installation",
            "Software Installation",
            "Networking",
            "Computer Maintenance"

        ],

        experienceList: [

            {
                icon: "💻",
                title: "Computer Repair",
                text:
                    "Experienced in laptop and desktop troubleshooting."
            },

            {
                icon: "🌐",
                title: "Networking",
                text:
                    "Home and small office networking setup."
            }

        ],

        workHistory: [

            {
                title: "Computer Maintenance",
                company: "Local Business",
                location: "Firozabad",
                date: "2026"
            }

        ],

        preferredLocation: "Firozabad & Agra",

        workingHours: "10 AM - 8 PM",

        preferredJobType: "Full Time / Part Time",

        job: {

            title: "Computer Technician Required",

            type: "Full Time",

            salary: "₹12,000 - ₹18,000 / Month",

            location: "Firozabad",

            posted: "3 days ago"

        },

        reviewsList: [

            {
                name: "Saurabh",
                rating: 5,
                text:
                    "Laptop problem was solved quickly."
            },

            {
                name: "Ankit",
                rating: 4,
                text:
                    "Good technical knowledge."
            }

        ]

    }

};


/* =========================================================
   GET WORKER ID FROM URL
========================================================= */

function getWorkerId() {

    const params =
        new URLSearchParams(window.location.search);

    return (
        params.get("workerId") ||
        params.get("id") ||
        "W001"
    );

}


/* =========================================================
   GET CURRENT WORKER
========================================================= */

function getCurrentWorker() {

    const workerId = getWorkerId();

    return workers[workerId] || null;

}


/* =========================================================
   LOAD WORKER
========================================================= */

function loadWorker() {

    const worker =
        getCurrentWorker();

    if (!worker) {

        showWorkerNotFound();

        return;

    }

    renderWorker(worker);

}


/* =========================================================
   RENDER WORKER
========================================================= */

function renderWorker(worker) {


    /* -----------------------------------------------------
       BASIC INFORMATION
    ----------------------------------------------------- */

    setText(
        "workerName",
        worker.name
    );

    setText(
        "workerRole",
        worker.role
    );

    setText(
        "workerLocation",
        worker.location
    );

    setText(
        "workerRating",
        worker.rating
    );

    setText(
        "reviewCount",
        worker.reviews
    );

    setText(
        "workerExperience",
        worker.experience
    );

    setText(
        "workerAbout",
        worker.about
    );

    setText(
        "bigRating",
        worker.rating
    );


    /* -----------------------------------------------------
       CHARGE
    ----------------------------------------------------- */

    setText(
        "workerCharge",
        "₹" + worker.charge
    );


    /* -----------------------------------------------------
       SIDEBAR
    ----------------------------------------------------- */

    setText(
        "sideExperience",
        worker.experience
    );

    setText(
        "sideLocation",
        worker.location
    );

    setText(
        "sideAvailability",
        worker.available
            ? "Available"
            : "Busy"
    );


    /* -----------------------------------------------------
       PREFERENCES
    ----------------------------------------------------- */

    setText(
        "preferredLocation",
        worker.preferredLocation
    );

    setText(
        "workingHours",
        worker.workingHours
    );

    setText(
        "preferredJobType",
        worker.preferredJobType
    );


    /* -----------------------------------------------------
       PROFILE IMAGE
    ----------------------------------------------------- */

    const avatar =
        document.getElementById(
            "workerAvatar"
        );

    if (avatar) {

        avatar.src =
            worker.avatar;

        avatar.alt =
            worker.name;

    }


    /* -----------------------------------------------------
       VERIFIED BADGE
    ----------------------------------------------------- */

    const verified =
        document.getElementById(
            "verifiedBadge"
        );

    if (verified) {

        verified.style.display =
            worker.verified
                ? "inline-flex"
                : "none";

    }


    /* -----------------------------------------------------
       AVAILABILITY BADGE
    ----------------------------------------------------- */

    const availability =
        document.getElementById(
            "availabilityBadge"
        );

    if (availability) {

        availability.textContent =
            worker.available
                ? "Available"
                : "Currently Busy";

        availability.classList.toggle(
            "available",
            worker.available
        );

        availability.classList.toggle(
            "busy",
            !worker.available
        );

    }


    /* -----------------------------------------------------
       JOB
    ----------------------------------------------------- */

    if (worker.job) {

        setText(
            "jobTitle",
            worker.job.title
        );

        setText(
            "jobType",
            worker.job.type
        );

        setText(
            "jobSalary",
            worker.job.salary
        );

        setText(
            "jobLocation",
            "📍 " + worker.job.location
        );

        setText(
            "jobPosted",
            worker.job.posted
        );

    }


    /* -----------------------------------------------------
       SKILLS
    ----------------------------------------------------- */

    renderSkills(
        worker.skills
    );


    /* -----------------------------------------------------
       EXPERIENCE
    ----------------------------------------------------- */

    renderExperience(
        worker.experienceList
    );


    /* -----------------------------------------------------
       WORK HISTORY
    ----------------------------------------------------- */

    renderHistory(
        worker.workHistory
    );


    /* -----------------------------------------------------
       REVIEWS
    ----------------------------------------------------- */

    renderReviews(
        worker.reviewsList
    );

}


/* =========================================================
   SET TEXT HELPER
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent =
        value ?? "";

}


/* =========================================================
   RENDER SKILLS
========================================================= */

function renderSkills(skills) {

    const container =
        document.getElementById(
            "skillsContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    skills.forEach(
        function (skill) {

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "skill";

            span.textContent =
                skill;

            container.appendChild(
                span
            );

        }
    );

}


/* =========================================================
   RENDER EXPERIENCE
========================================================= */

function renderExperience(items) {

    const container =
        document.getElementById(
            "experienceContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    items.forEach(
        function (item) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "experience-item";

            div.innerHTML = `

                <div class="experience-icon">
                    ${item.icon}
                </div>

                <div>

                    <h3>
                        ${item.title}
                    </h3>

                    <p>
                        ${item.text}
                    </p>

                </div>

            `;

            container.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   RENDER WORK HISTORY
========================================================= */

function renderHistory(items) {

    const container =
        document.getElementById(
            "workHistoryContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    items.forEach(
        function (item) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "history-item";

            div.innerHTML = `

                <h3>
                    ${item.title}
                </h3>

                <p>
                    ${item.company}
                </p>

                <p>
                    📍 ${item.location}
                </p>

                <p>
                    📅 ${item.date}
                </p>

            `;

            container.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   RENDER REVIEWS
========================================================= */

function renderReviews(reviews) {

    const container =
        document.getElementById(
            "reviewsContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    reviews.forEach(
        function (review) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "review";

            const stars =
                "⭐".repeat(
                    Number(review.rating)
                );

            div.innerHTML = `

                <div class="review-user">

                    <strong>
                        ${review.name}
                    </strong>

                    <span class="review-stars">
                        ${stars}
                    </span>

                </div>

                <p>
                    ${review.text}
                </p>

            `;

            container.appendChild(
                div
            );

        }
    );

}


/* =========================================================
   CONTACT WORKER
   DIRECT WORKER CHAT
========================================================= */

function contactWorker() {

    const worker =
        getCurrentWorker();

    if (!worker) return;


    const params =
        new URLSearchParams({

            workerId:
                worker.id,

            worker:
                worker.name,

            role:
                worker.role,

            type:
                "worker-chat"

        });


    window.location.href =
        "messages.html?" +
        params.toString();

}


/* =========================================================
   OPEN CONFIRM WORKER MODAL
========================================================= */

function openConfirmWorker() {

    const worker =
        getCurrentWorker();

    if (!worker) return;


    /* -----------------------------------------------------
       MODAL IMAGE
    ----------------------------------------------------- */

    const image =
        document.getElementById(
            "confirmWorkerImage"
        );

    if (image) {

        image.src =
            worker.avatar;

        image.alt =
            worker.name;

    }


    /* -----------------------------------------------------
       MODAL NAME
    ----------------------------------------------------- */

    setText(
        "confirmWorkerName",
        worker.name
    );


    /* -----------------------------------------------------
       MODAL ROLE + LOCATION
    ----------------------------------------------------- */

    setText(
        "confirmWorkerRole",
        worker.role +
        " • " +
        worker.location
    );


    /* -----------------------------------------------------
       MODAL
    ----------------------------------------------------- */

    const modal =
        document.getElementById(
            "confirmModal"
        );

    if (!modal) {

        /*
           Agar modal HTML mein nahi hai,
           to direct confirm karne ki jagah
           user ko simple confirmation
           de sakte hain.
        */

        const proceed =
            window.confirm(
                "Kya aap " +
                worker.name +
                " ko confirm karna chahte hain?"
            );

        if (proceed) {

            confirmWorker();

        }

        return;

    }


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CONFIRM MODAL
========================================================= */

function closeConfirmWorker() {

    const modal =
        document.getElementById(
            "confirmModal"
        );

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   GET WORK DETAILS
   FROM URL
========================================================= */

function getWorkDetails() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        workTitle:
            params.get("workTitle") ||
            params.get("work") ||
            "",

        budget:
            params.get("budget") ||
            "",

        location:
            params.get("location") ||
            "",

        workDate:
            params.get("workDate") ||
            "",

        duration:
            params.get("duration") ||
            "",

        details:
            params.get("details") ||
            params.get("description") ||
            ""

    };

}


/* =========================================================
   CREATE WORKER REQUEST
========================================================= */

function createWorkerRequest(worker) {

    const work =
        getWorkDetails();


    /*
       If no work information came from
       match1/request flow, use worker's
       job information as fallback.
    */

    const workTitle =
        work.workTitle ||
        worker.job?.title ||
        worker.role + " Service";


    const budget =
        work.budget ||
        String(worker.charge);


    const location =
        work.location ||
        worker.location;


    const workDate =
        work.workDate ||
        "To be discussed";


    const duration =
        work.duration ||
        "To be discussed";


    const details =
        work.details ||
        "Customer has selected this worker and wants to discuss the work details.";


    return {

        requestId:
            "WORK-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 7),

        type:
            "worker-selection",

        status:
            "Pending Worker Response",

        createdAt:
            new Date().toISOString(),


        worker: {

            id:
                worker.id,

            name:
                worker.name,

            role:
                worker.role,

            location:
                worker.location,

            rating:
                worker.rating,

            reviews:
                worker.reviews,

            charge:
                worker.charge,

            avatar:
                worker.avatar

        },


        work: {

            title:
                workTitle,

            budget:
                budget,

            location:
                location,

            workDate:
                workDate,

            duration:
                duration,

            details:
                details

        }

    };

}


/* =========================================================
   CHECK IF WORKER IS ALREADY CONFIRMED
========================================================= */

function isWorkerConfirmed(workerId) {
    if (!workerId) return false;
    try {
        const bookings = JSON.parse(localStorage.getItem("ahd_worker_bookings") || "[]");
        return bookings.some(b => b.workerId === workerId);
    } catch (_) {
        return false;
    }
}

/* =========================================================
   APPLY WORKER CONFIRMED UI STATE
========================================================= */

function applyWorkerConfirmedUI(worker) {
    if (!worker) return;

    // 1. Hero Confirm Button
    const heroBtn = document.getElementById("heroConfirmWorkerBtn") || document.querySelector(".confirm-worker-btn");
    if (heroBtn) {
        heroBtn.innerHTML = "✓ Worker Confirmed";
        heroBtn.classList.add("confirmed");
        heroBtn.setAttribute("disabled", "true");
        heroBtn.style.pointerEvents = "none";
    }

    // 2. Sidebar Job Card Confirm Button
    const sideBtn = document.getElementById("confirmWorkerBtn");
    if (sideBtn) {
        sideBtn.innerHTML = "✓ Worker Confirmed";
        sideBtn.classList.add("confirmed");
        sideBtn.setAttribute("disabled", "true");
        sideBtn.style.pointerEvents = "none";
    }

    // 3. Availability Badge
    const availBadge = document.getElementById("availabilityBadge");
    if (availBadge) {
        availBadge.textContent = "✓ Booked & Confirmed";
        availBadge.className = "available-badge confirmed-status-badge";
    }

    const sideAvail = document.getElementById("sideAvailability");
    if (sideAvail) {
        sideAvail.textContent = "Booked & Confirmed";
        sideAvail.style.color = "#15803d";
    }
}

/* =========================================================
   SHOW WORKER CONFIRMATION TOAST / BANNER
========================================================= */

function showWorkerSuccessToast(worker) {
    const toast = document.getElementById("workerNotificationToast");
    if (!toast) return;

    toast.innerHTML = `
        <div class="toast-icon">🎉</div>
        <div class="toast-content">
            <h4>Worker Confirmed Successfully!</h4>
            <p><strong>${worker.name}</strong> (${worker.role}) has been confirmed. A notification has been sent to the worker, and they will contact you shortly.</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.style.display='none'">✕</button>
    `;
    toast.style.display = "flex";

    toast.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* =========================================================
   FINAL CONFIRM WORKER (REDIRECT TO MESSAGES REMOVED)
========================================================= */

async function confirmWorker() {
    const worker = getCurrentWorker();
    if (!worker) {
        alert("Worker information not found.");
        return;
    }

    // Check if already confirmed
    if (isWorkerConfirmed(worker.id)) {
        showWorkerSuccessToast(worker);
        applyWorkerConfirmedUI(worker);
        closeConfirmWorker();
        return;
    }

    // Button loading feedback
    const finalBtn = document.getElementById("finalConfirmBtn");
    const origText = finalBtn ? finalBtn.innerHTML : "";
    if (finalBtn) {
        finalBtn.innerHTML = "⏳ Confirming Worker...";
        finalBtn.disabled = true;
    }

    // Current user identification
    let customerUser = null;
    try {
        if (typeof AHDAuth !== "undefined" && AHDAuth.getCurrentUser) {
            customerUser = AHDAuth.getCurrentUser();
        }
    } catch (_) {}
    const customerName = customerUser ? (customerUser.name || "Customer") : "Customer";
    const customerId = customerUser ? (customerUser.email || customerUser.phone || customerUser.id || "customer") : "customer";

    // 1. Create and send notification to the Worker
    const workerNotifPayload = {
        userId: worker.id,
        title: `Job Confirmed: ${worker.role}`,
        message: `${customerName} has confirmed your services for ${worker.role} in ${worker.location}. Agreed charge: ₹${worker.charge}.`,
        type: "worker",
        link: `worker-profile.html?id=${worker.id}`
    };

    // 2. Create customer notification
    const customerNotifPayload = {
        userId: customerId,
        title: `Worker Confirmed: ${worker.name}`,
        message: `You have successfully confirmed ${worker.name} (${worker.role}). Notification sent to the worker!`,
        type: "order",
        link: `worker-profile.html?id=${worker.id}`
    };

    // Dispatch notifications to Backend SQLite API
    try {
        if (typeof AHDApi !== "undefined" && AHDApi.createNotification) {
            await Promise.allSettled([
                AHDApi.createNotification(workerNotifPayload),
                AHDApi.createNotification(customerNotifPayload)
            ]);
        } else {
            await Promise.allSettled([
                fetch("/api/notifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(workerNotifPayload)
                }),
                fetch("/api/notifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(customerNotifPayload)
                })
            ]);
        }
    } catch (err) {
        console.warn("Notification dispatch notice:", err);
    }

    // 3. Persist Booking Locally
    const bookingRecord = {
        id: "WBK-" + Date.now(),
        workerId: worker.id,
        workerName: worker.name,
        workerRole: worker.role,
        workerAvatar: worker.avatar,
        charge: worker.charge,
        location: worker.location,
        status: "Confirmed",
        customerName: customerName,
        customerId: customerId,
        confirmedAt: new Date().toISOString()
    };

    try {
        const bookings = JSON.parse(localStorage.getItem("ahd_worker_bookings") || "[]");
        bookings.push(bookingRecord);
        localStorage.setItem("ahd_worker_bookings", JSON.stringify(bookings));
    } catch (_) {}

    // Save as Deal in backend if available
    try {
        if (typeof AHDApi !== "undefined" && AHDApi.saveDeal) {
            await AHDApi.saveDeal({
                id: bookingRecord.id,
                workerId: worker.id,
                title: `Confirmed Worker: ${worker.name} (${worker.role})`,
                buyerEmail: customerId,
                sellerName: worker.name,
                price: worker.charge,
                status: "Accepted",
                date: new Date().toLocaleDateString("en-IN")
            });
        }
    } catch (_) {}

    // Close modal
    closeConfirmWorker();

    // Reset modal button
    if (finalBtn) {
        finalBtn.innerHTML = origText || "✓ Confirm Worker";
        finalBtn.disabled = false;
    }

    // Apply confirmed state to UI
    applyWorkerConfirmedUI(worker);

    // Show on-page confirmation toast
    showWorkerSuccessToast(worker);

    // NOTE: Direct redirect to messages.html is OFF as requested.
}


/* =========================================================
   NOT FOUND
========================================================= */

function showWorkerNotFound() {

    const page =
        document.querySelector(
            ".profile-page"
        );

    if (!page) return;


    page.innerHTML = `

        <div class="worker-not-found">

            <div class="not-found-icon">
                👤
            </div>

            <h2>
                Worker Not Found
            </h2>

            <p>
                This worker profile is not available.
            </p>

            <a href="match1.html">
                Find Workers
            </a>

        </div>

    `;

}


/* =========================================================
   HANDLE CONFIRM BUTTONS
========================================================= */

function setupConfirmButtons() {


    /* -----------------------------------------------------
       HERO CONFIRM BUTTON
    ----------------------------------------------------- */

    const heroConfirmBtn =
        document.getElementById(
            "heroConfirmWorkerBtn"
        ) ||
        document.querySelector(
            ".confirm-worker-btn"
        );

    if (heroConfirmBtn) {

        heroConfirmBtn.addEventListener(
            "click",
            openConfirmWorker
        );

    }


    /* -----------------------------------------------------
       FIRST CONFIRM BUTTON (SIDEBAR)
    ----------------------------------------------------- */

    const confirmBtn =
        document.getElementById(
            "confirmWorkerBtn"
        );

    if (confirmBtn) {

        confirmBtn.addEventListener(
            "click",
            openConfirmWorker
        );

    }


    /* -----------------------------------------------------
       SECOND CONFIRM BUTTON
    ----------------------------------------------------- */

    const confirmBtn2 =
        document.getElementById(
            "confirmWorkerBtn2"
        );

    if (confirmBtn2) {

        confirmBtn2.addEventListener(
            "click",
            openConfirmWorker
        );

    }


    /* -----------------------------------------------------
       FINAL CONFIRM BUTTON
    ----------------------------------------------------- */

    const finalBtn =
        document.getElementById(
            "finalConfirmBtn"
        );

    if (finalBtn) {

        finalBtn.addEventListener(
            "click",
            confirmWorker
        );

    }


    /* -----------------------------------------------------
       CLOSE BUTTON
    ----------------------------------------------------- */

    const closeBtn =
        document.getElementById(
            "closeConfirmModal"
        );

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeConfirmWorker
        );

    }


    /* -----------------------------------------------------
       CANCEL BUTTON
    ----------------------------------------------------- */

    const cancelBtn =
        document.getElementById(
            "cancelConfirmBtn"
        );

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            closeConfirmWorker
        );

    }


    /* -----------------------------------------------------
       OUTSIDE MODAL CLICK
    ----------------------------------------------------- */

    const modal =
        document.getElementById(
            "confirmModal"
        );

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    closeConfirmWorker();

                }

            }
        );

    }

}


/* =========================================================
   SETUP CONTACT BUTTON
========================================================= */

function setupContactButton() {

    const chatBtn =
        document.getElementById(
            "contactWorkerBtn"
        );

    if (!chatBtn) return;


    chatBtn.addEventListener(
        "click",
        contactWorker
    );

}


/* =========================================================
   ESC KEY
========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeConfirmWorker();

            }

        }
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadWorker();

        setupContactButton();

        setupConfirmButtons();

        setupEscapeKey();

        const currentWorker = getCurrentWorker();
        if (currentWorker && isWorkerConfirmed(currentWorker.id)) {
            applyWorkerConfirmedUI(currentWorker);
        }

    }
);