"use strict";

import {loadNotification} from "/scripts/notification-boxes.js";

// ACCOUNT CONFIGURATION ERROR CODES:
// 0) CHANGE PASSWORD: Reserved for "success" status
// 1) CHANGE PASSWORD: The current password is incorrect
// 2) CHANGE PASSWORD: Password must be between 6 and 32 characters long
// 3) CHANGE PASSWORD: Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 4) DELETE ACCOUNT: Wrong password

const notifications = [
    {
        "title": "Success!",
        "description": "Password changed successfully",
        "id": "changepassword-notification",
        "type": "success"
    },
    {
        "title": "Error",
        "description": "The current password is incorrect",
        "id": "changepassword-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Password must be between 6 and 32 characters long",
        "id": "changepassword-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system",
        "id": "changepassword-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Wrong password",
        "id": "deleteaccount-notification",
        "type": "error"
    }
];

loadNotification(notifications);