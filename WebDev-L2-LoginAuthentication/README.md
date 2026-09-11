# Login Authentication System

A client-side authentication system developed as part of the Oasis Infobyte Web Development & Designing Internship.

## Objective

The objective of this project is to build a simple authentication system that supports user registration, login validation, session-based access to a protected dashboard, and logout functionality.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- Web Crypto API (SHA-256)

## Features

### Registration

- Username and email registration
- Password validation
- Minimum 8-character password requirement
- Password must contain at least one number
- Duplicate username/email detection
- Confirm password validation

### Login

- Login using username or email
- Password validation
- Generic error message for incorrect credentials
- Successful login redirects to the dashboard

### Protected Dashboard

- Dashboard accessible only after successful login
- Displays logged-in user's account information
- Direct access without a valid session redirects to the login page

### Logout

- Logout button clears the login session
- User is redirected to the login page

### Password Security

Passwords are hashed using SHA-256 through the Web Crypto API before being stored in browser local storage.

> Note: This is a client-side internship/demo authentication project. Production authentication should use server-side authentication, secure password hashing such as bcrypt/Argon2, HTTPS, secure cookies, and a backend database.

## Project Structure

```text
WebDev-L2-LoginAuthentication/
├── index.html
├── register.html
├── dashboard.html
├── style.css
├── script.js
└── README.md