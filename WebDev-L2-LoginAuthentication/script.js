// =========================
// SECURE AUTHENTICATION DEMO
// =========================

// This project is a client-side internship/demo authentication system.
// Passwords are hashed using the Web Crypto API (SHA-256) before storage.
// This is NOT a replacement for server-side production authentication.


// =========================
// COMMON HELPERS
// =========================

function getUsers() {
    try {
        const savedUsers = localStorage.getItem("secureauth_users");

        if (!savedUsers) {
            return [];
        }

        const users = JSON.parse(savedUsers);

        return Array.isArray(users) ? users : [];

    } catch (error) {

        console.error("Unable to load users:", error);

        return [];
    }
}


function saveUsers(users) {

    try {

        localStorage.setItem(
            "secureauth_users",
            JSON.stringify(users)
        );

        return true;

    } catch (error) {

        console.error("Unable to save users:", error);

        return false;
    }
}


// =========================
// SHA-256 PASSWORD HASHING
// =========================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(
            (byte) =>
                byte.toString(16).padStart(2, "0")
        )
        .join("");
}


// =========================
// FORM MESSAGE HELPER
// =========================

function showFormMessage(
    element,
    message,
    type = "error"
) {

    if (!element) {
        return;
    }

    element.textContent = message;

    if (type === "success") {

        element.style.color = "#16a34a";

    } else {

        element.style.color = "#dc2626";
    }
}


// =========================
// USERNAME VALIDATION
// =========================

function isValidUsername(username) {

    return (
        username.length >= 3 &&
        username.length <= 30
    );
}


// =========================
// PASSWORD VALIDATION
// =========================

function isValidPassword(password) {

    const minimumLength =
        password.length >= 8;

    const containsNumber =
        /\d/.test(password);

    return minimumLength && containsNumber;
}


// =========================
// EMAIL NORMALIZATION
// =========================

function normalizeEmail(email) {

    return email
        .trim()
        .toLowerCase();
}


// =========================
// USERNAME NORMALIZATION
// =========================

function normalizeUsername(username) {

    return username
        .trim()
        .toLowerCase();
}


// =========================
// LOGIN SESSION
// =========================

function createSession(user) {

    const session = {

        username: user.username,

        email: user.email,

        loginTime:
            new Date().toISOString()
    };


    localStorage.setItem(
        "secureauth_session",
        JSON.stringify(session)
    );
}


function getSession() {

    try {

        const savedSession =
            localStorage.getItem(
                "secureauth_session"
            );

        if (!savedSession) {
            return null;
        }

        return JSON.parse(savedSession);

    } catch (error) {

        console.error(
            "Unable to read session:",
            error
        );

        return null;
    }
}


function clearSession() {

    localStorage.removeItem(
        "secureauth_session"
    );
}


// =========================
// REGISTRATION
// =========================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const usernameInput =
                document.getElementById(
                    "registerUsername"
                );

            const emailInput =
                document.getElementById(
                    "registerEmail"
                );

            const passwordInput =
                document.getElementById(
                    "registerPassword"
                );

            const confirmPasswordInput =
                document.getElementById(
                    "confirmPassword"
                );

            const messageElement =
                document.getElementById(
                    "registerMessage"
                );


            // =========================
            // GET VALUES
            // =========================

            const username =
                usernameInput.value.trim();

            const email =
                normalizeEmail(
                    emailInput.value
                );

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            // =========================
            // EMPTY VALIDATION
            // =========================

            if (
                !username ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                showFormMessage(
                    messageElement,
                    "Please fill in all required fields."
                );

                return;
            }


            // =========================
            // USERNAME VALIDATION
            // =========================

            if (!isValidUsername(username)) {

                showFormMessage(
                    messageElement,
                    "Username must be between 3 and 30 characters."
                );

                return;
            }


            // =========================
            // PASSWORD VALIDATION
            // =========================

            if (!isValidPassword(password)) {

                showFormMessage(
                    messageElement,
                    "Password must be at least 8 characters and contain at least 1 number."
                );

                return;
            }


            // =========================
            // CONFIRM PASSWORD
            // =========================

            if (password !== confirmPassword) {

                showFormMessage(
                    messageElement,
                    "Passwords do not match."
                );

                return;
            }


            // =========================
            // LOAD USERS
            // =========================

            const users = getUsers();


            // =========================
            // DUPLICATE CHECK
            // =========================

            const normalizedUsername =
                normalizeUsername(username);


            const userExists =
                users.some(
                    (user) =>
                        user.usernameNormalized ===
                            normalizedUsername ||
                        user.email === email
                );


            if (userExists) {

                showFormMessage(
                    messageElement,
                    "An account with that username or email already exists."
                );

                return;
            }


            // =========================
            // HASH PASSWORD
            // =========================

            let passwordHash;

            try {

                passwordHash =
                    await hashPassword(password);

            } catch (error) {

                console.error(
                    "Password hashing failed:",
                    error
                );

                showFormMessage(
                    messageElement,
                    "Unable to securely process your password. Please try again."
                );

                return;
            }


            // =========================
            // CREATE USER
            // =========================

            const newUser = {

                username: username,

                usernameNormalized:
                    normalizedUsername,

                email: email,

                passwordHash:
                    passwordHash,

                createdAt:
                    new Date().toISOString()
            };


            users.push(newUser);


            // =========================
            // SAVE USER
            // =========================

            const saved =
                saveUsers(users);


            if (!saved) {

                showFormMessage(
                    messageElement,
                    "Unable to create the account. Please try again."
                );

                return;
            }


            // =========================
            // SUCCESS
            // =========================

            showFormMessage(
                messageElement,
                "Registration successful! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1500);

        }
    );
}


// =========================
// LOGIN
// =========================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const identifierInput =
                document.getElementById(
                    "loginIdentifier"
                );

            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );

            const messageElement =
                document.getElementById(
                    "loginMessage"
                );


            const identifier =
                identifierInput.value.trim();

            const password =
                passwordInput.value;


            // =========================
            // EMPTY VALIDATION
            // =========================

            if (!identifier || !password) {

                showFormMessage(
                    messageElement,
                    "Please enter your username/email and password."
                );

                return;
            }


            // =========================
            // HASH ENTERED PASSWORD
            // =========================

            let passwordHash;

            try {

                passwordHash =
                    await hashPassword(password);

            } catch (error) {

                console.error(
                    "Password hashing failed:",
                    error
                );

                showFormMessage(
                    messageElement,
                    "Unable to process your login securely. Please try again."
                );

                return;
            }


            // =========================
            // FIND USER
            // =========================

            const users = getUsers();

            const normalizedIdentifier =
                identifier.toLowerCase();


            const user =
                users.find(
                    (item) =>
                        item.usernameNormalized ===
                            normalizedIdentifier ||
                        item.email ===
                            normalizedIdentifier
                );


            // =========================
            // GENERIC CREDENTIAL ERROR
            // =========================

            if (
                !user ||
                user.passwordHash !== passwordHash
            ) {

                showFormMessage(
                    messageElement,
                    "Invalid username/email or password."
                );

                return;
            }


            // =========================
            // CREATE SESSION
            // =========================

            createSession(user);


            // =========================
            // SUCCESS
            // =========================

            showFormMessage(
                messageElement,
                "Login successful. Redirecting...",
                "success"
            );


            loginForm.reset();


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }
    );
}


// =========================
// DASHBOARD PROTECTION
// =========================

const isDashboardPage =
    window.location.pathname
        .toLowerCase()
        .endsWith("dashboard.html");


if (isDashboardPage) {

    const session =
        getSession();


    // =========================
    // NO SESSION
    // =========================

    if (!session) {

        window.location.replace(
            "index.html"
        );

    } else {

        // =========================
        // SHOW USER INFORMATION
        // =========================

        const userName =
            document.getElementById(
                "userName"
            );

        const dashboardUsername =
            document.getElementById(
                "dashboardUsername"
            );

        const dashboardEmail =
            document.getElementById(
                "dashboardEmail"
            );


        if (userName) {

            userName.textContent =
                session.username;
        }


        if (dashboardUsername) {

            dashboardUsername.textContent =
                session.username;
        }


        if (dashboardEmail) {

            dashboardEmail.textContent =
                session.email;
        }
    }
}


// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            clearSession();

            window.location.replace(
                "index.html"
            );

        }
    );
}


// =========================
// PREVENT LOGGED-IN USER
// FROM SEEING LOGIN PAGE
// =========================

const isLoginPage =
    window.location.pathname
        .toLowerCase()
        .endsWith("index.html");


if (isLoginPage) {

    const session =
        getSession();


    if (session) {

        window.location.replace(
            "dashboard.html"
        );

    }
}