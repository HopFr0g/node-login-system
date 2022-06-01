"use strict";

import {loadNotification} from "/scripts/notification-boxes.js";

// FORGOT PASSWORD CODES:
// 0) If the email entered belongs to an user registered in the system, you will receive an email to reset your password

const notifications = [
    {
        "title": "Done!",
        "description": "If the e-mail entered belongs to an user registered in the system, you will receive an email to reset your password",
        "id": "forgotpassword-notification",
        "type": "success"
    }
];

loadNotification(notifications);