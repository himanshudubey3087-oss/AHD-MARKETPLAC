/* =========================================
   AHD JOBS MODULE
========================================= */


/* =========================================
   JOB DATA
========================================= */

const JOBS = [

    {
        id: "J001",

        title: "Delivery Boy",

        company: "Local Delivery Partner",

        category: "Delivery",

        type: "Full Time",

        salary: 18000,

        location: "Agra",

        skills: [
            "Bike",
            "Driving",
            "Smartphone"
        ],

        description:
            "Need a delivery partner for local product deliveries in Agra.",

        postedDays: 1
    },


    {
        id: "J002",

        title: "Part Time Driver",

        company: "Private Employer",

        category: "Driver",

        type: "Part Time",

        salary: 10000,

        location: "Agra",

        skills: [
            "Driving",
            "License",
            "Local Routes"
        ],

        description:
            "Part-time driver required for local travel and daily tasks.",

        postedDays: 2
    },


    {
        id: "J003",

        title: "Computer Operator",

        company: "Apex Services",

        category: "Computer",

        type: "Full Time",

        salary: 16000,

        location: "Agra",

        skills: [
            "Computer",
            "MS Office",
            "Typing"
        ],

        description:
            "Computer operator required for office documentation and data entry.",

        postedDays: 3
    },


    {
        id: "J004",

        title: "Maths Tutor",

        company: "Home Learning",

        category: "Teaching",

        type: "Part Time",

        salary: 12000,

        location: "Agra",

        skills: [
            "Maths",
            "Teaching",
            "Communication"
        ],

        description:
            "Maths tutor required for school students.",

        postedDays: 4
    },


    {
        id: "J005",

        title: "Construction Worker",

        company: "Local Contractor",

        category: "Construction",

        type: "Daily Work",

        salary: 800,

        location: "Firozabad",

        skills: [
            "Construction",
            "Physical Work"
        ],

        description:
            "Workers required for construction and building work.",

        postedDays: 2
    },


    {
        id: "J006",

        title: "Sales Executive",

        company: "Retail Business",

        category: "Sales",

        type: "Full Time",

        salary: 22000,

        location: "Agra",

        skills: [
            "Sales",
            "Communication",
            "Customer Handling"
        ],

        description:
            "Sales executive required for customer handling and product sales.",

        postedDays: 5
    },


    {
        id: "J007",

        title: "Office Assistant",

        company: "Business Office",

        category: "Office",

        type: "Full Time",

        salary: 15000,

        location: "Mathura",

        skills: [
            "MS Office",
            "Communication",
            "Typing"
        ],

        description:
            "Office assistant required for documentation and daily office work.",

        postedDays: 1
    },


    {
        id: "J008",

        title: "Bike Delivery Partner",

        company: "AHD Local Delivery",

        category: "Delivery",

        type: "Daily Work",

        salary: 900,

        location: "Agra",

        skills: [
            "Bike",
            "Driving",
            "Delivery"
        ],

        description:
            "Daily delivery work available for bike owners.",

        postedDays: 1
    },


    {
        id: "J009",

        title: "Data Entry Operator",

        company: "Digital Work Hub",

        category: "Computer",

        type: "Contract",

        salary: 14000,

        location: "Delhi",

        skills: [
            "Typing",
            "Excel",
            "Data Entry"
        ],

        description:
            "Data entry operator required for digital documentation work.",

        postedDays: 6
    }

];


/* =========================================
   STATE
========================================= */

let filteredJobs = [...JOBS];

let activeCategory = "all";


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderJobs();

        setupSearch();

        setupFilters();

        setupModal();

        setupHeroButtons();

    }
);


/* =========================================
   RENDER
========================================= */

function renderJobs() {

    const grid =
        document.getElementById("jobsGrid");

    const empty =
        document.getElementById("emptyState");

    const count =
        document.getElementById("jobCount");


    grid.innerHTML = "";


    count.textContent =
        `${filteredJobs.length} ${
            filteredJobs.length === 1
                ? "job"
                : "jobs"
        } available`;


    if (filteredJobs.length === 0) {

        empty.classList.remove("hidden");

        return;
    }


    empty.classList.add("hidden");


    filteredJobs.forEach(job => {

        grid.appendChild(
            createJobCard(job)
        );

    });

}


/* =========================================
   CREATE JOB CARD
========================================= */

function createJobCard(job) {

    const card =
        document.createElement("article");

    card.className = "job-card";


    const skillsHTML =
        job.skills
            .map(skill =>
                `<span class="skill">${escapeHTML(skill)}</span>`
            )
            .join("");


    card.innerHTML = `

        <div class="job-card-top">

            <span class="job-category">
                ${escapeHTML(job.category)}
            </span>

            <span class="job-type">
                ${escapeHTML(job.type)}
            </span>

        </div>


        <h3>
            ${escapeHTML(job.title)}
        </h3>


        <div class="job-company">
            🏢 ${escapeHTML(job.company)}
        </div>


        <div class="job-info">

            <span>
                📍 ${escapeHTML(job.location)}
            </span>

            <span>
                💼 ${escapeHTML(job.type)}
            </span>

        </div>


        <div class="job-salary">
            ${formatSalary(job.salary)}
        </div>


        <div class="job-skills">
            ${skillsHTML}
        </div>


        <div class="job-card-footer">

            <span class="job-posted">
                ${postedText(job.postedDays)}
            </span>

            <button class="view-job">
                View Job
            </button>

        </div>

    `;


    card
        .querySelector(".view-job")
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openJob(job);

            }
        );


    card.addEventListener(
        "click",
        () => openJob(job)
    );


    return card;
}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    document
        .getElementById("jobSearch")
        .addEventListener(
            "input",
            applyFilters
        );

}


/* =========================================
   FILTERS
========================================= */

function setupFilters() {

    document
        .getElementById("locationFilter")
        .addEventListener(
            "change",
            applyFilters
        );


    document
        .getElementById("jobTypeFilter")
        .addEventListener(
            "change",
            applyFilters
        );


    document
        .getElementById("sortJobs")
        .addEventListener(
            "change",
            applyFilters
        );


    document
        .querySelectorAll(
            ".category-list button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-list button"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );


                    button.classList.add(
                        "selected"
                    );


                    activeCategory =
                        button.dataset.category;


                    applyFilters();

                }
            );

        });


    document
        .getElementById("clearFilters")
        .addEventListener(
            "click",
            clearFilters
        );

}


/* =========================================
   APPLY FILTERS
========================================= */

function applyFilters() {

    const search =
        document
            .getElementById("jobSearch")
            .value
            .trim()
            .toLowerCase();


    const location =
        document
            .getElementById("locationFilter")
            .value;


    const type =
        document
            .getElementById("jobTypeFilter")
            .value;


    filteredJobs =
        JOBS.filter(job => {


            const searchMatch =
                !search ||
                job.title
                    .toLowerCase()
                    .includes(search) ||

                job.company
                    .toLowerCase()
                    .includes(search) ||

                job.category
                    .toLowerCase()
                    .includes(search) ||

                job.skills.some(skill =>
                    skill
                        .toLowerCase()
                        .includes(search)
                );


            const categoryMatch =
                activeCategory === "all" ||
                job.category === activeCategory;


            const locationMatch =
                location === "all" ||
                job.location === location;


            const typeMatch =
                type === "all" ||
                job.type === type;


            return (
                searchMatch &&
                categoryMatch &&
                locationMatch &&
                typeMatch
            );

        });


    sortJobs();


    renderJobs();

}


/* =========================================
   SORT
========================================= */

function sortJobs() {

    const sort =
        document
            .getElementById("sortJobs")
            .value;


    if (sort === "salaryHigh") {

        filteredJobs.sort(
            (a, b) =>
                b.salary - a.salary
        );

    }


    else if (sort === "salaryLow") {

        filteredJobs.sort(
            (a, b) =>
                a.salary - b.salary
        );

    }


    else if (sort === "newest") {

        filteredJobs.sort(
            (a, b) =>
                a.postedDays - b.postedDays
        );

    }

}


/* =========================================
   CLEAR FILTERS
========================================= */

function clearFilters() {

    document
        .getElementById("jobSearch")
        .value = "";


    document
        .getElementById("locationFilter")
        .value = "all";


    document
        .getElementById("jobTypeFilter")
        .value = "all";


    document
        .getElementById("sortJobs")
        .value = "recommended";


    activeCategory = "all";


    document
        .querySelectorAll(
            ".category-list button"
        )
        .forEach(button =>
            button.classList.remove(
                "selected"
            )
        );


    filteredJobs = [...JOBS];

    renderJobs();

}


/* =========================================
   MODAL
========================================= */

function setupModal() {

    document
        .getElementById("postJobButton")
        .addEventListener(
            "click",
            openPostJob
        );


    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closePostJob
        );


    document
        .getElementById("modalOverlay")
        .addEventListener(
            "click",
            closePostJob
        );


    document
        .getElementById("jobForm")
        .addEventListener(
            "submit",
            submitJob
        );

}


/* =========================================
   HERO BUTTONS
========================================= */

function setupHeroButtons() {

    document
        .getElementById("findJobsButton")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("jobSearch")
                    .focus();

                window.scrollTo({
                    top: 420,
                    behavior: "smooth"
                });

            }
        );

}


/* =========================================
   OPEN POST JOB
========================================= */

function openPostJob() {

    /*
        Job posting is an action,
        therefore login can be required.
    */

    if (
        window.AHDAuth &&
        typeof AHDAuth.isLoggedIn === "function" &&
        !AHDAuth.isLoggedIn()
    ) {

        window.location.href =
            "login.html?redirect=jobs.html";

        return;
    }


    document
        .getElementById("postJobModal")
        .classList.remove("hidden");

}


/* =========================================
   CLOSE POST JOB
========================================= */

function closePostJob() {

    document
        .getElementById("postJobModal")
        .classList.add("hidden");

}


/* =========================================
   SUBMIT JOB
========================================= */

function submitJob(event) {

    event.preventDefault();


    const title =
        document
            .getElementById("jobTitle")
            .value
            .trim();


    const category =
        document
            .getElementById("jobCategory")
            .value;


    const type =
        document
            .getElementById("newJobType")
            .value;


    const salary =
        Number(
            document
                .getElementById("jobSalary")
                .value
        );


    const location =
        document
            .getElementById("jobLocation")
            .value
            .trim();


    const skillsText =
        document
            .getElementById("jobSkills")
            .value
            .trim();


    const description =
        document
            .getElementById("jobDescription")
            .value
            .trim();


    const phone =
        document
            .getElementById("jobPhone")
            .value
            .trim();


    const message =
        document.getElementById(
            "jobFormMessage"
        );


    if (
        !title ||
        !category ||
        !type ||
        !salary ||
        !location ||
        !skillsText ||
        !description ||
        !phone
    ) {

        message.textContent =
            "Please fill all required fields.";

        return;
    }


    if (
        !/^[0-9]{10}$/.test(phone)
    ) {

        message.textContent =
            "Enter a valid 10 digit mobile number.";

        return;
    }


    const newJob = {

        id:
            "J" +
            Date.now(),

        title,

        company:
            "AHD User",

        category,

        type,

        salary,

        location,

        skills:
            skillsText
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean),

        description,

        postedDays: 0,

        contact:
            phone

    };


    /*
        Temporary frontend state.

        No localStorage/sessionStorage.
    */

    JOBS.unshift(newJob);

    filteredJobs = [...JOBS];


    message.textContent =
        "Job posted successfully!";


    message.style.color =
        "green";


    renderJobs();


    setTimeout(() => {

        closePostJob();

        document
            .getElementById("jobForm")
            .reset();

        message.textContent = "";

    }, 900);

}


/* =========================================
   OPEN JOB
========================================= */

function openJob(job) {

    /*
        Worker profile / job details
        module will be connected next.

        For now we pass job ID.
    */

    window.location.href =
        `worker-profile.html?jobId=${encodeURIComponent(
            job.id
        )}`;

}


/* =========================================
   HELPERS
========================================= */

function formatSalary(amount) {

    return "₹" +
        Number(amount)
            .toLocaleString("en-IN");

}


function postedText(days) {

    if (days === 0) {
        return "Posted today";
    }

    if (days === 1) {
        return "Posted yesterday";
    }

    return `Posted ${days} days ago`;

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}