"use strict";

import {loadNotification} from "/scripts/notification-boxes.js";

const form = document.getElementById("signin-form");
const usernameInput = document.getElementById("username");

form.addEventListener("click", () => {
    usernameInput.value = usernameInput.value.toLowerCase();
});

// SIGN IN CODES:
// 0) Wrong username or password
// 1) You must be logged in to access this site
// 2) SUCCESS: Password changed successfully. You can now log in with your new password (Redirect from resetpassword)

const notifications = [
    {
        "title": "Error",
        "description": "Wrong username or password",
        "id": "signin-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "You must be logged in to access this site",
        "id": "signin-notification",
        "type": "error"
    },
    {
        "title": "Success!",
        "description": "Password changed successfully. You can now log in with your new password",
        "id": "signin-notification",
        "type": "success"
    }
];

loadNotification(notifications);