"use strict";

/* Simple script that gives functionality to the responsive menu button.
   Use it together with the responsive.css file. */

const responsiveButton = document.querySelector(".nav-responsive__button");

responsiveButton.addEventListener("click", () => {
    const menuDesplegable = document.querySelector(".nav-responsive__a-container");
    menuDesplegable.style.transform == "" ? menuDesplegable.style.transform = "translateY(calc(100vh + 60px))" : menuDesplegable.style.transform = "";
});