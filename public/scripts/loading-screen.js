/*

To use it, just add:

<div class="loading-screen" style="display: none">
    <img src="/img/loading.gif">
</div>

at the end of the container that need a loading screen in your html file 
and attach /styles/loading-screen.css

paste this line:

import {displayLoadingScreen, hideLoadingScreen} from "/scripts/loading-screen.js";

in the javascript file that will decide when the loading screen should be toggled 

*/

const loadingScreen = document.querySelector(".loading-screen");

const displayLoadingScreen = () => {
    loadingScreen.removeAttribute("style");
}

const hideLoadingScreen = () => {
    loadingScreen.setAttribute("style", "display: none");
}

export {displayLoadingScreen, hideLoadingScreen};