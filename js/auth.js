/* =========================================================
   AHD MARKETPLACE
   AUTH SYSTEM
   IndexedDB Authentication

   FEATURES:
   ✔ Signup
   ✔ Login
   ✔ Current User
   ✔ Logout
   ✔ Find User By Phone
   ✔ Forgot Password
   ✔ Password Update
   ✔ No localStorage
   ✔ No sessionStorage

   DATABASE VERSION: 3
   ========================================================= */

const AHDAuth = (() => {

    const DB_NAME = "AHDMarketplaceDB";
    const DB_VERSION = 4;

    const USER_STORE = "users";
    const CURRENT_USER_STORE = "currentUser";


    /* =====================================================
       NORMALIZE PHONE
    ===================================================== */

    function normalizePhone(phone) {

        return String(phone || "")
            .replace(/\D/g, "");

    }


    /* =====================================================
       OPEN DATABASE
    ===================================================== */

    function openDatabase() {

        return new Promise((resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            /* =================================================
               DATABASE UPGRADE
            ================================================= */

            request.onupgradeneeded = function (event) {

                const db =
                    event.target.result;

                const transaction =
                    event.target.transaction;


                /* =============================================
                   USERS STORE
                ============================================= */

                let userStore;


                if (
                    !db.objectStoreNames.contains(
                        USER_STORE
                    )
                ) {

                    userStore =
                        db.createObjectStore(
                            USER_STORE,
                            {
                                keyPath: "email"
                            }
                        );

                } else {

                    userStore =
                        transaction.objectStore(
                            USER_STORE
                        );

                }


                /* =============================================
                   PHONE INDEX
                ============================================= */

                if (
                    !userStore.indexNames.contains("phone")
                ) {

                    userStore.createIndex(
                        "phone",
                        "phone",
                        {
                            unique: true
                        }
                    );

                }


                /* =============================================
                   CURRENT USER STORE
                ============================================= */

                if (
                    !db.objectStoreNames.contains(
                        CURRENT_USER_STORE
                    )
                ) {

                    db.createObjectStore(
                        CURRENT_USER_STORE,
                        {
                            keyPath: "id"
                        }
                    );

                }

                if (!db.objectStoreNames.contains("products")) {
                    db.createObjectStore("products", { keyPath: "id" });
                }

                if (!db.objectStoreNames.contains("requests")) {
                    db.createObjectStore("requests", { keyPath: "requestId" });
                }

                if (!db.objectStoreNames.contains("deals")) {
                    db.createObjectStore("deals", { keyPath: "dealId" });
                }

            };


            request.onsuccess = function () {

                const db =
                    request.result;


                /* =============================================
                   DATABASE VERSION CHANGE
                ============================================= */

                db.onversionchange = function () {

                    db.close();

                };

                /* =============================================
                   SEED DEMO USERS (For offline testing)
                ============================================= */
                try {
                    const tx = db.transaction(USER_STORE, "readwrite");
                    const store = tx.objectStore(USER_STORE);
                    const checkCust = store.get("customer@ahd.in");
                    checkCust.onsuccess = function () {
                        if (!checkCust.result) {
                            store.put({
                                name: "Rahul Sharma",
                                email: "customer@ahd.in",
                                phone: "9876543210",
                                role: "customer",
                                password: "123456",
                                location: "Agra, Uttar Pradesh",
                                createdAt: new Date().toISOString()
                            });
                        }
                    };
                    const checkSell = store.get("seller@ahd.in");
                    checkSell.onsuccess = function () {
                        if (!checkSell.result) {
                            store.put({
                                name: "Aman Gupta",
                                email: "seller@ahd.in",
                                phone: "9123456789",
                                role: "seller",
                                password: "123456",
                                location: "Agra, Uttar Pradesh",
                                createdAt: new Date().toISOString()
                            });
                        }
                    };
                } catch (_) {}


                resolve(db);

            };


            request.onerror = function () {

                reject(
                    request.error ||
                    new Error(
                        "Unable to open AHD database."
                    )
                );

            };


            request.onblocked = function () {

                reject(
                    new Error(
                        "AHD database is blocked. Please close other AHD tabs and try again."
                    )
                );

            };

        });

    }



    /* =====================================================
       CREATE ACCOUNT
    ===================================================== */

    async function createAccount(userData) {

        const db =
            await openDatabase();


        const email =
            String(userData.email || "")
                .trim()
                .toLowerCase();


        const phone =
            normalizePhone(
                userData.phone
            );


        if (!email) {

            throw new Error(
                "Email is required."
            );

        }


        if (!phone) {

            throw new Error(
                "Mobile number is required."
            );

        }


        const user = {

            ...userData,

            email: email,

            phone: phone,

            location:
                userData.location ||
                "Agra, Uttar Pradesh",

            createdAt:
                new Date().toISOString()

        };


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    USER_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    USER_STORE
                );


            /* =============================================
               EMAIL CHECK
            ============================================= */

            const emailCheck =
                store.get(email);


            emailCheck.onsuccess =
                function () {

                    if (emailCheck.result) {

                        reject(
                            new Error(
                                "This email is already registered."
                            )
                        );

                        return;

                    }


                    /* =====================================
                       PHONE CHECK
                    ===================================== */

                    let phoneIndex;

                    try {

                        phoneIndex =
                            store.index("phone");

                    } catch (error) {

                        reject(
                            new Error(
                                "Phone authentication index is unavailable."
                            )
                        );

                        return;

                    }


                    const phoneCheck =
                        phoneIndex.get(phone);


                    phoneCheck.onsuccess =
                        function () {

                            if (phoneCheck.result) {

                                reject(
                                    new Error(
                                        "This phone number is already registered."
                                    )
                                );

                                return;

                            }


                            /* =================================
                               ADD USER
                            ================================= */

                            const addRequest =
                                store.add(user);


                            addRequest.onsuccess =
                                function () {

                                    /* 
                                       Current user transaction
                                       after successful save
                                    */

                                    setCurrentUser(
                                        user.email
                                    )
                                    .then(() => {

                                        resolve(user);

                                    })
                                    .catch(error => {

                                        reject(error);

                                    });

                                };


                            addRequest.onerror =
                                function () {

                                    reject(
                                        addRequest.error
                                    );

                                };

                        };


                    phoneCheck.onerror =
                        function () {

                            reject(
                                phoneCheck.error
                            );

                        };

                };


            emailCheck.onerror =
                function () {

                    reject(
                        emailCheck.error
                    );

                };

        });

    }



    /* =====================================================
       LOGIN
    ===================================================== */

    async function login(
        identifier,
        password,
        role
    ) {

        const db =
            await openDatabase();


        const loginIdentifier =
            String(identifier || "")
                .trim();


        const normalizedPhone =
            normalizePhone(
                loginIdentifier
            );


        const normalizedEmail =
            loginIdentifier.toLowerCase();


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    USER_STORE,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    USER_STORE
                );


            const request =
                store.getAll();


            request.onsuccess =
                function () {

                    const users =
                        request.result || [];


                    const user =
                        users.find(item => {

                            const emailMatch =
                                String(
                                    item.email || ""
                                )
                                .trim()
                                .toLowerCase()
                                === normalizedEmail;


                            const phoneMatch =
                                normalizePhone(
                                    item.phone
                                )
                                === normalizedPhone;


                            return (

                                (
                                    emailMatch ||
                                    phoneMatch
                                )

                                &&

                                item.password ===
                                password

                                &&

                                item.role ===
                                role

                            );

                        });


                    if (!user) {

                        reject(
                            new Error(
                                "Email/Phone or password is incorrect."
                            )
                        );

                        return;

                    }


                    setCurrentUser(
                        user.email
                    )
                    .then(() => {

                        resolve(user);

                    })
                    .catch(error => {

                        reject(error);

                    });

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        });

    }



    /* =====================================================
       SET CURRENT USER
    ===================================================== */

    async function setCurrentUser(email) {

        const db =
            await openDatabase();


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    CURRENT_USER_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    CURRENT_USER_STORE
                );


            const request =
                store.put({

                    id: 1,

                    email:
                        String(email || "")
                            .trim()
                            .toLowerCase()

                });


            request.onsuccess =
                function () {

                    resolve();

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        });

    }



    /* =====================================================
       GET CURRENT USER
    ===================================================== */

    async function getUser() {

        const db =
            await openDatabase();


        return new Promise((resolve, reject) => {

            const currentTransaction =
                db.transaction(
                    CURRENT_USER_STORE,
                    "readonly"
                );


            const currentStore =
                currentTransaction.objectStore(
                    CURRENT_USER_STORE
                );


            const currentRequest =
                currentStore.get(1);


            currentRequest.onsuccess =
                function () {

                    const currentUser =
                        currentRequest.result;

                    if (!currentUser) {
                        resolve(null);
                        return;
                    }

                    if (!currentUser.email) {
                        resolve(currentUser);
                        return;
                    }

                    /* =====================================
                       GET FULL USER
                    ===================================== */
                    try {
                        const userTransaction =
                            db.transaction(
                                USER_STORE,
                                "readonly"
                            );

                        const userStore =
                            userTransaction.objectStore(
                                USER_STORE
                            );

                        const userRequest =
                            userStore.get(
                                currentUser.email
                            );

                        userRequest.onsuccess =
                            function () {
                                resolve(
                                    userRequest.result ||
                                    currentUser
                                );
                            };

                        userRequest.onerror =
                            function () {
                                resolve(currentUser);
                            };
                    } catch (_) {
                        resolve(currentUser);
                    }

                };


            currentRequest.onerror =
                function () {

                    reject(
                        currentRequest.error
                    );

                };

        });

    }



    /* =====================================================
       CHECK LOGIN
    ===================================================== */

    async function isLoggedIn() {

        const user =
            await getUser();

        return !!user;

    }



    /* =====================================================
       REQUIRE LOGIN
    ===================================================== */

    async function requireLogin() {

        const user =
            await getUser();


        if (!user) {

            window.location.href =
                "login.html";

            return false;

        }


        return true;

    }



    /* =====================================================
       LOGOUT
    ===================================================== */

    async function logout() {

        const db =
            await openDatabase();


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    CURRENT_USER_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    CURRENT_USER_STORE
                );


            const request =
                store.delete(1);


            request.onsuccess =
                function () {

                    window.location.replace(
                        "index.html"
                    );

                    resolve();

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        });

    }



    /* =====================================================
       FIND USER BY PHONE
       Forgot Password
       
       IMPORTANT:
       Index par depend nahi karega.
       Existing old database users ko bhi find karega.
    ===================================================== */

    async function findUserByPhone(phone) {

        const db =
            await openDatabase();


        const normalizedPhone =
            normalizePhone(phone);


        if (!normalizedPhone) {

            return null;

        }


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    USER_STORE,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    USER_STORE
                );


            const request =
                store.getAll();


            request.onsuccess =
                function () {

                    const users =
                        request.result || [];


                    const user =
                        users.find(item => {

                            return (
                                normalizePhone(
                                    item.phone
                                )
                                ===
                                normalizedPhone
                            );

                        });


                    resolve(
                        user || null
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error ||
                        new Error(
                            "Unable to find account."
                        )
                    );

                };

        });

    }



    /* =====================================================
       RESET PASSWORD
       
       Phone
          ↓
       Find User
          ↓
       Update Password
          ↓
       Transaction Complete
          ↓
       SUCCESS
    ===================================================== */

    async function resetPassword(
        phone,
        newPassword
    ) {

        const db =
            await openDatabase();


        const normalizedPhone =
            normalizePhone(phone);


        const password =
            String(
                newPassword || ""
            );


        if (!normalizedPhone) {

            throw new Error(
                "Invalid mobile number."
            );

        }


        if (!password) {

            throw new Error(
                "New password is required."
            );

        }


        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    USER_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    USER_STORE
                );


            /* =============================================
               IMPORTANT:
               getAll() use kar rahe hain.

               Isse old database/index problem
               reset password ko affect nahi karegi.
            ============================================= */

            const request =
                store.getAll();


            request.onsuccess =
                function () {

                    const users =
                        request.result || [];


                    const user =
                        users.find(item => {

                            return (
                                normalizePhone(
                                    item.phone
                                )
                                ===
                                normalizedPhone
                            );

                        });


                    if (!user) {

                        reject(
                            new Error(
                                "No account found with this mobile number."
                            )
                        );

                        return;

                    }


                    /* =====================================
                       UPDATE USER
                    ===================================== */

                    user.password =
                        password;


                    user.updatedAt =
                        new Date().toISOString();


                    /* 
                       Phone ko normalized format mein
                       maintain karenge.
                    */

                    user.phone =
                        normalizedPhone;


                    const updateRequest =
                        store.put(user);


                    updateRequest.onerror =
                        function () {

                            reject(
                                updateRequest.error ||
                                new Error(
                                    "Unable to update password."
                                )
                            );

                        };

                };


            request.onerror =
                function () {

                    reject(
                        request.error ||
                        new Error(
                            "Unable to access user accounts."
                        )
                    );

                };


            /* =============================================
               MOST IMPORTANT PART

               IndexedDB transaction complete hone ke baad
               hi success return hoga.
            ============================================= */

            transaction.oncomplete =
                function () {

                    resolve(true);

                };


            transaction.onerror =
                function () {

                    reject(
                        transaction.error ||
                        new Error(
                            "Password update transaction failed."
                        )
                    );

                };


            transaction.onabort =
                function () {

                    reject(
                        transaction.error ||
                        new Error(
                            "Password update was cancelled."
                        )
                    );

                };

        });

    }



    /* =====================================================
       UPDATE PROFILE
    ===================================================== */

    async function updateProfile(userData) {

        const db = await openDatabase();

        const email = String(userData.email || "").trim().toLowerCase();

        if (!email) {
            throw new Error("Email is required to update profile.");
        }

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    [USER_STORE, CURRENT_USER_STORE],
                    "readwrite"
                );

            const userStore =
                transaction.objectStore(USER_STORE);

            const currentStore =
                transaction.objectStore(CURRENT_USER_STORE);

            const userReq = userStore.get(email);

            userReq.onsuccess = function () {

                const existing = userReq.result || {};

                const updated = {
                    ...existing,
                    ...userData,
                    email: email,
                    phone: existing.phone || userData.phone,
                    updatedAt: new Date().toISOString()
                };

                const putReq = userStore.put(updated);

                putReq.onsuccess = function () {

                    currentStore.put({
                        id: 1,
                        email: email
                    });

                };

                putReq.onerror = function () {
                    reject(putReq.error || new Error("Failed to update user."));
                };

            };

            userReq.onerror = function () {
                reject(userReq.error || new Error("User not found."));
            };

            transaction.oncomplete = function () {

                if (window.AHDApi && typeof window.AHDApi.syncProfileToBackend === "function") {
                    window.AHDApi.syncProfileToBackend(userData).catch(() => {});
                }

                resolve(true);

            };

            transaction.onerror = function () {
                reject(transaction.error || new Error("Profile update failed."));
            };

        });

    }



    /* =====================================================
       DELETE ACCOUNT
    ===================================================== */

    async function deleteAccount() {

        const user = await getUser();

        if (!user || !user.email) {
            throw new Error("No active user session.");
        }

        const db = await openDatabase();

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    [USER_STORE, CURRENT_USER_STORE],
                    "readwrite"
                );

            const userStore =
                transaction.objectStore(USER_STORE);

            const currentStore =
                transaction.objectStore(CURRENT_USER_STORE);

            userStore.delete(user.email);
            currentStore.delete(1);

            transaction.oncomplete = function () {
                resolve(true);
            };

            transaction.onerror = function () {
                reject(transaction.error || new Error("Account deletion failed."));
            };

        });

    }



    /* =====================================================
       EXPORT
    ===================================================== */

    return {

        createAccount,

        login,

        getUser,

        isLoggedIn,

        requireLogin,

        logout,

        findUserByPhone,

        resetPassword,

        setCurrentUser,

        updateProfile,

        deleteAccount

    };

})();