"use strict";

/* 
    SIMPLE NOTIFICATION BOXES:
    
    Just add the following HTML code inside the form where you will use the notification box:
    
    <div class="notification" id="NOTIFICATION ID HERE" style="display: none;">
        <h4 class="notification__title"></h4>
        <p class="notification__description"></p>
    </div>

    This library will detect the "code" url parameter and display a notification according to the code.
    
    BE SURE TO CREATE A JSON FILE WITH THE FOLLOWING STRUCTURE TO DEFINE THE NOTIFICATION CODES:
    
    [{title:"string", description:"string", notificationid:"NOTIFICATION ID HERE", type:"success" or "error"} , {...} , {...}]
*/

import {getUrlParameters} from "/scripts/url-reader.js"; // File necessary for the operation of this script.

var notifications;

const checkNotificationFormat = index => {
    return Array.isArray(notifications)
        && !isNaN(index)
        && notifications[index]
        && typeof notifications[index].title == "string"
        && typeof notifications[index].description == "string"
        && (notifications[index].type == "success" || notifications[index].type == "error")
        && document.getElementById(notifications[index].id); // Check if the HTML element with the provided id exists.
}

const printNotification = (title, description, id, warningClass) => {
    const warningContainer = document.getElementById(id);
    const warningTitle = warningContainer.querySelector(".notification__title");
    const warningDescription = warningContainer.querySelector(".notification__description");
    warningTitle.innerHTML = title;
    warningDescription.innerHTML = description;
    warningContainer.classList.add(warningClass);
    warningContainer.removeAttribute("style");
}

const manageNotification = code => {
    code = parseInt(code);
    if (!checkNotificationFormat(code))
        throw "Failed to load notification from url parameter 'code'";
    printNotification(notifications[code].title, notifications[code].description, notifications[code].id, notifications[code].type);
}

const getCode = () => {
    const urlParameters = getUrlParameters();
    return urlParameters.code
}

const loadNotification = notificationJson => {
    try {
        notifications = notificationJson;
        let code = getCode();
        if (code)
            manageNotification(code);
    } catch (error) {
        console.error(error);
    }
}

export {loadNotification};