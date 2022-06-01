/* Window for notifications and error warnings:
 
To use notification pop-ups, simply add this snippet to your HTML document:

<div class="notification" style="display: none">
    <div class="notification__window">
        <h3 class="notification__window-title"></h3>
        <p class="notification__window-description"></p>
        <button class="notification__window-button fancy__button-green"></button>
        <p class="notification__window-alternativebutton" style="display: none"></p>
    </div>
</div>

Attach notification.css and fancy.css file to your document.
Make sure to put:
    - import {displayNotification} from "/scripts/notification.js";
on the js file that will call displayNotification function, and put:
    - type="module"
attribute on the <script> tag of THE SAME JS FILE THAT WILL CALL DISPLAYNOTIFICATION FUNCTION.
*/

const display = () => {
    const notification = document.querySelector(".notification");
    notification.removeAttribute("style");
}

const setButton = (buttonQuerySelector, buttonSettings) => {
    const button = document.querySelector(buttonQuerySelector);
    
    // Remove button's default style (like style="display: none"):
    button.removeAttribute("style");
    
    // Set button inner text:
    if (!buttonSettings || typeof buttonSettings["text"] != "string")
        // Set default button text if it is not correctly specified on buttonSettings object:
        button.innerHTML = "Ok";
    else
        button.innerHTML = buttonSettings["text"];
    
    // Set default behavior for the button if the buttonSettings object is not defined or doesnt define a redirect nor a callback:
    if (!buttonSettings || (typeof buttonSettings["redirect"] != "string" && typeof buttonSettings["callback"] != "function")) {
        button.addEventListener("click", () => {
            hideNotification();
        });
        // Display notification:
        display();
        return;
    }
        
    // Set button redirect if it is defined:
    if (typeof buttonSettings["redirect"] == "string") {
        button.addEventListener("click", () => {
            location.href = buttonSettings["redirect"];
        });
        // Display notification:
        display();
        return;
    }
    
    // Set button callback if it is defined:
    if (typeof buttonSettings["callback"] == "function")
        button.addEventListener("click", () => {
            buttonSettings["callback"]();
            hideNotification();
        });
}

const displayNotification = (title, description, buttonSettings, alternativeButtonSettings) => {
    // buttonSettings format: {"text": string, "redirect": url, "callback": function}
    
    // Set title and description of the notification window:
    const notificationTitle = document.querySelector(".notification__window-title");
    const notificationDescription = document.querySelector(".notification__window-description");
    notificationTitle.innerHTML = title;
    notificationDescription.innerHTML = description;
    
    // Set main button settings:
    setButton(".notification__window-button", buttonSettings);
    
    // Set alternative button settings, only if settings are provided:
    if (alternativeButtonSettings != undefined)
        setButton(".notification__window-alternativebutton", alternativeButtonSettings);
    
    // Display notification:
    display();
}

const hideNotification = () => {
    const notification = document.querySelector(".notification");
    notification.setAttribute("style", "display: none");
}

export {displayNotification}; // Export the displayNotification function in a javascript file