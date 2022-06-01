"use strict";

import {loadNotification} from "/scripts/notification-boxes.js";

// RESET PASSWORD ERROR CODES:
// 0) Password must be between 6 and 32 characters long
// 1) Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 2) The provided reset password id does not exist

const notifications = [
    {
        "title": "Error",
        "description": "Password must be between 6 and 32 characters long",
        "id": "resetpassword-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system",
        "id": "resetpassword-notification",
        "type": "error"
    },
    {
        "title": "Error",
        "description": "The provided reset password id does not exist",
        "id": "resetpassword-notification",
        "type": "error"
    }
];

loadNotification(notifications);