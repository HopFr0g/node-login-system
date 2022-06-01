"use strict";

import {loadNotification} from "/scripts/notification-boxes.js";

// SIGN UP ERROR CODES:
// 0) Reserved for "success" status
// 1) Username must be between 3 and 16 characters long
// 2) Username can only contain letters, numbers and characters _ - .
// 3) The username is already taken
// 4) Password must be between 6 and 32 characters long
// 5) Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 6) Invalid e-mail format
// 7) For security reasons, only emails ${allowedMailServices.join(", ")} are allowed
// ...) The email address is already taken (no error code to avoid "user enumeration" attack)

const notifications = [
    {
        "title": "Done!",
        "description": "Look for the verification link in your e-mail inbox. You can sign up with the same e-mail address again if you haven't clicked the verification link yet",
        "id": "signup-notification",
        "type": "success"
    },
    {
        "title": "Error",
        "description": "Username must be between 3 and 16 characters long",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Username can only contain letters, numbers and characters _ - .",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "The username is already taken",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Password must be between 6 and 32 characters long",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Invalid e-mail format",
        "id": "signup-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "For security reasons, only emails '@gmail.com', '@outlook.com', '@hotmail.com' and '@yahoo.com' are allowed",
        "id": "signup-notification",
        "type": "error"
    }
];

loadNotification(notifications);