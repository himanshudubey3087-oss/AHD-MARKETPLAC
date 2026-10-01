/* =========================================================
   AHD MATCH1
   WORKER MATCHING ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   WORKER DATABASE - TEMPORARY FRONTEND DATA
   ========================================================= */

const MATCH1_WORKERS = [

    {
        id: "W001",

        name: "Rakesh Kumar",

        role: "Electrician",

        location: "Agra",

        rating: 4.8,

        experienceYears: 7,

        experience: "7 Years",

        charge: 800,

        availability: "Available",

        skills: [
            "Electrical Repair",
            "Wiring",
            "Fan Repair",
            "AC Wiring"
        ],

        description:
            "Experienced electrician for home and commercial electrical work."
    },


    {
        id: "W002",

        name: "Amit Sharma",

        role: "Maths Tutor",

        location: "Agra",

        rating: 4.9,

        experienceYears: 5,

        experience: "5 Years",

        charge: 500,

        availability: "Available",

        skills: [
            "Mathematics",
            "Class 10",
            "Class 12",
            "Home Tuition"
        ],

        description:
            "Experienced mathematics tutor for school students."
    },


    {
        id: "W003",

        name: "Mohit Verma",

        role: "Computer Technician",

        location: "Firozabad",

        rating: 4.7,

        experienceYears: 6,

        experience: "6 Years",

        charge: 700,

        availability: "Available",

        skills: [
            "Laptop Repair",
            "Windows",
            "Computer Repair",
            "Software"
        ],

        description:
            "Computer and laptop repair specialist."
    },


    {
        id: "W004",

        name: "Suresh Kumar",

        role: "Plumber",

        location: "Agra",

        rating: 4.6,

        experienceYears: 8,

        experience: "8 Years",

        charge: 600,

        availability: "Available",

        skills: [
            "Plumbing",
            "Pipe Repair",
            "Bathroom Repair",
            "Water Tank"
        ],

        description:
            "Professional plumber with residential repair experience."
    },


    {
        id: "W005",

        name: "Vijay Singh",

        role: "AC Technician",

        location: "Agra",

        rating: 4.7,

        experienceYears: 6,

        experience: "6 Years",

        charge: 900,

        availability: "Available",

        skills: [
            "AC Repair",
            "AC Installation",
            "Cooling Problem",
            "Refrigerator Repair"
        ],

        description:
            "AC and refrigerator repair technician."
    },


    {
        id: "W006",

        name: "Rajesh Yadav",

        role: "Carpenter",

        location: "Mathura",

        rating: 4.5,

        experienceYears: 9,

        experience: "9 Years",

        charge: 1000,

        availability: "Available",

        skills: [
            "Furniture",
            "Wood Work",
            "Door Repair",
            "Table Repair"
        ],

        description:
            "Professional carpenter for furniture and wood work."
    }

];


/* =========================================================
   DEFAULT WORK REQUEST
   ========================================================= */

const DEFAULT_WORK_REQUEST = {

    requestId: "WR-DEMO",

    status: "Pending",

    worker: {
        role: "Electrician",
        location: "Agra"
    },

    job: {
        title: "Electrician Required",
        type: "Part Time",
        salary: 1000,
        location: "Agra"
    },

    requirement: {

        work: "Electrician",

        location: "Agra",

        budget: 1000,

        requiredDate: "",

        duration: "",

        message:
            "Need an experienced electrician for electrical repair work."

    }

};


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let match1Request = null;

let matchedWorkers = [];


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeMatch1
);


function initializeMatch1() {

    loadWorkRequest();

    calculateMatches();

    document
        .getElementById("workerSort")
        ?.addEventListener(
            "change",
            sortWorkers
        );

}


/* =========================================================
   LOAD REQUEST
   ========================================================= */

function loadWorkRequest() {

    /*
       First preference:
       worker-profile.js se generated request
    */

    if (
        window.AHDCurrentWorkRequest
    ) {

        match1Request =
            window.AHDCurrentWorkRequest;

    }

    else {

        /*
           Demo fallback.
        */

        match1Request =
            DEFAULT_WORK_REQUEST;

    }


    displayRequirement();

}


/* =========================================================
   DISPLAY REQUIREMENT
   ========================================================= */

function displayRequirement() {

    const requirement =
        match1Request.requirement || {};

    const job =
        match1Request.job || {};


    setText(
        "requirementTitle",
        requirement.work ||
        job.title ||
        "Work Requirement"
    );


    setText(
        "requirementStatus",
        match1Request.status ||
        "Pending"
    );


    setText(
        "workRequired",
        requirement.work ||
        job.title ||
        "-"
    );


    setText(
        "workLocation",
        requirement.location ||
        job.location ||
        "-"
    );


    setText(
        "workBudget",
        requirement.budget
            ? formatPrice(requirement.budget)
            : job.salary
                ? formatPrice(job.salary)
                : "Any"
    );


    setText(
        "workType",
        job.type ||
        "Any"
    );


    setText(
        "workDate",
        requirement.requiredDate ||
        "Flexible"
    );


    setText(
        "workDuration",
        requirement.duration ||
        "Flexible"
    );


    setText(
        "workMessage",
        requirement.message ||
        "No additional requirement."
    );

}


/* =========================================================
   CALCULATE MATCHES
   ========================================================= */

function calculateMatches() {

    const requirement =
        match1Request.requirement || {};


    matchedWorkers =
        MATCH1_WORKERS
            .map(worker => {

                const result =
                    calculateWorkerScore(
                        worker,
                        requirement
                    );

                return {

                    ...worker,

                    score:
                        result.score,

                    reasons:
                        result.reasons

                };

            })

            .filter(
                worker =>
                    worker.score >= 30
            )

            .sort(
                (a, b) =>
                    b.score - a.score
            );


    renderWorkers();

}


/* =========================================================
   WORKER SCORE
   ========================================================= */

function calculateWorkerScore(
    worker,
    requirement
) {

    let score = 0;

    const reasons = [];


    const requestedWork =
        String(
            requirement.work || ""
        ).toLowerCase();


    /* =====================================================
       ROLE MATCH
       ===================================================== */

    if (
        requestedWork &&
        (
            worker.role
                .toLowerCase()
                .includes(requestedWork)

            ||

            requestedWork
                .includes(
                    worker.role.toLowerCase()
                )
        )
    ) {

        score += 35;

        reasons.push(
            "Worker role matches your requirement"
        );

    }

    else {

        const skillFound =
            worker.skills.some(
                skill =>
                    requestedWork.includes(
                        skill.toLowerCase()
                    )
                    ||
                    skill
                        .toLowerCase()
                        .includes(
                            requestedWork
                        )
            );


        if (skillFound) {

            score += 25;

            reasons.push(
                "Relevant skill matches"
            );

        }

    }


    /* =====================================================
       LOCATION
       ===================================================== */

    const requestedLocation =
        String(
            requirement.location ||
            "Agra"
        ).toLowerCase();


    if (
        worker.location
            .toLowerCase() ===
        requestedLocation
    ) {

        score += 20;

        reasons.push(
            "Worker is in your location"
        );

    }

    else {

        score += 10;

        reasons.push(
            "Worker is available nearby"
        );

    }


    /* =====================================================
       BUDGET
       ===================================================== */

    const budget =
        Number(
            requirement.budget || 0
        );


    if (budget > 0) {

        if (
            worker.charge <= budget
        ) {

            score += 20;

            reasons.push(
                "Charge is within your budget"
            );

        }

        else if (
            worker.charge <=
            budget * 1.10
        ) {

            score += 10;

            reasons.push(
                "Charge is close to your budget"
            );

        }

    }

    else {

        score += 10;

    }


    /* =====================================================
       RATING
       ===================================================== */

    if (
        worker.rating >= 4.5
    ) {

        score += 10;

        reasons.push(
            "Highly rated worker"
        );

    }


    /* =====================================================
       EXPERIENCE
       ===================================================== */

    if (
        worker.experienceYears >= 5
    ) {

        score += 10;

        reasons.push(
            `${worker.experience} experience`
        );

    }


    /* =====================================================
       AVAILABILITY
       ===================================================== */

    if (
        worker.availability ===
        "Available"
    ) {

        score += 5;

        reasons.push(
            "Currently available"
        );

    }


    return {

        score:
            Math.min(score, 100),

        reasons

    };

}


/* =========================================================
   RENDER WORKERS
   ========================================================= */

function renderWorkers() {

    const grid =
        document.getElementById(
            "workerGrid"
        );

    const empty =
        document.getElementById(
            "noWorker"
        );


    if (!grid) return;


    grid.innerHTML = "";


    setText(
        "workerCount",
        `${matchedWorkers.length} suitable worker${
            matchedWorkers.length === 1
                ? ""
                : "s"
        } found`
    );


    if (
        matchedWorkers.length === 0
    ) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    matchedWorkers.forEach(
        worker => {

            grid.appendChild(
                createWorkerCard(
                    worker
                )
            );

        }
    );

}


/* =========================================================
   CREATE WORKER CARD
   ========================================================= */

function createWorkerCard(
    worker
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "worker-card";


    const initial =
        worker.name
            .charAt(0)
            .toUpperCase();


    const skills =
        worker.skills
            .slice(0, 5)
            .map(
                skill =>
                    `
                    <span class="skill-tag">
                        ${escapeHTML(skill)}
                    </span>
                    `
            )
            .join("");


    const reasons =
        worker.reasons
            .slice(0, 4)
            .map(
                reason =>
                    `
                    <li>
                        ${escapeHTML(reason)}
                    </li>
                    `
            )
            .join("");


    card.innerHTML = `

        <div class="worker-top">

            <div class="worker-avatar">
                ${escapeHTML(initial)}
            </div>


            <div class="worker-details">

                <h3 class="worker-name">
                    ${escapeHTML(worker.name)}
                </h3>

                <p class="worker-role">
                    ${escapeHTML(worker.role)}
                </p>

            </div>


            <span class="worker-match">
                ${worker.score}% Match
            </span>

        </div>


        <div class="worker-info">

            <div class="worker-info-item">

                <span>
                    Location
                </span>

                <strong>
                    📍 ${escapeHTML(worker.location)}
                </strong>

            </div>


            <div class="worker-info-item">

                <span>
                    Rating
                </span>

                <strong>
                    ⭐ ${worker.rating}
                </strong>

            </div>


            <div class="worker-info-item">

                <span>
                    Experience
                </span>

                <strong>
                    ${escapeHTML(worker.experience)}
                </strong>

            </div>


            <div class="worker-info-item">

                <span>
                    Expected Charge
                </span>

                <strong>
                    ${formatPrice(worker.charge)}
                </strong>

            </div>

        </div>


        <div class="worker-skills">

            ${skills}

        </div>


        <div class="match-reasons">

            <div class="match-reasons-title">
                Why this worker matches
            </div>

            <ul>
                ${reasons}
            </ul>

        </div>


        <div class="worker-actions">

            <a
                class="view-worker"
                href="worker-profile.html?workerId=${encodeURIComponent(worker.id)}"
            >
                View Worker
            </a>


            <button
                class="request-worker"
                onclick="requestWorker('${escapeJS(worker.id)}')"
            >
                Request Work
            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   SORT
   ========================================================= */

function sortWorkers(event) {

    const sortType =
        event.target.value;


    if (
        sortType === "match"
    ) {

        matchedWorkers.sort(
            (a, b) =>
                b.score - a.score
        );

    }


    else if (
        sortType === "rating"
    ) {

        matchedWorkers.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    else if (
        sortType === "price-low"
    ) {

        matchedWorkers.sort(
            (a, b) =>
                a.charge - b.charge
        );

    }


    else if (
        sortType === "price-high"
    ) {

        matchedWorkers.sort(
            (a, b) =>
                b.charge - a.charge
        );

    }


    else if (
        sortType === "experience"
    ) {

        matchedWorkers.sort(
            (a, b) =>
                b.experienceYears -
                a.experienceYears
        );

    }


    else if (
        sortType === "distance"
    ) {

        const location =
            match1Request
                .requirement
                ?.location ||
            "Agra";


        matchedWorkers.sort(
            (a, b) => {

                const aSame =
                    a.location === location;

                const bSame =
                    b.location === location;

                return (
                    Number(bSame) -
                    Number(aSame)
                );

            }
        );

    }


    renderWorkers();

}


/* =========================================================
   REQUEST WORKER
   ========================================================= */

function requestWorker(
    workerId
) {

    const worker =
        MATCH1_WORKERS.find(
            item =>
                item.id === workerId
        );


    if (!worker) {

        alert(
            "Worker not found."
        );

        return;

    }


    /*
       Worker profile page.
       Real request creation will happen there.
    */

    window.location.href =
        `worker-profile.html?workerId=${encodeURIComponent(workerId)}` +
        `&requestId=${encodeURIComponent(
            match1Request.requestId ||
            "WR-" + Date.now()
        )}`;

}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "-";

    }

}


function formatPrice(
    value
) {

    const number =
        Number(value || 0);


    return (
        "₹" +
        number.toLocaleString(
            "en-IN"
        )
    );

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeJS(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}