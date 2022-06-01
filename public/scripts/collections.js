"use strict";

import {displayNotification} from "/scripts/notification.js";
import {displayLoadingScreen, hideLoadingScreen} from "/scripts/loading-screen.js";
import {getCollections, renameCollection, deleteCollection, createCollection} from "/scripts/reqmgr.js";

// DISPLAY NOTIFICATION PARAMETERS:
// title, description, buttonSettings, alternativeButtonSettings
// buttonSettings format: {"text": string, "redirect": url, "callback": function}

const createButton = document.querySelector(".create-button");
createButton.addEventListener("click", async () => {
    displayLoadingScreen();
    try {
        let collectionData = await createCollection();
        let collection = setCollection(collectionData.id, collectionData.name);
        
        const mainSection = document.querySelector(".main");
        mainSection.appendChild(collection);
        
        hideLoadingScreen();
    } catch (error) {
        hideLoadingScreen();
        displayNotification("Error", error);
    }
});

const setCollection = (id, name) => {
    // Elements creation:
    let container = document.createElement("DIV");
    let input = document.createElement("INPUT");
    let buttonSave = document.createElement("BUTTON");
    let buttonRemove = document.createElement("BUTTON");
    // ID and class definition:
    container.id = id;
    container.classList.add("collection");
    input.classList.add("collection__input");
    input.classList.add("fancy__input");
    buttonSave.classList.add("collection__button-save");
    buttonSave.classList.add("fancy__button-disabled");
    buttonRemove.classList.add("collection__button-remove");
    buttonRemove.classList.add("fancy__button-red");
    // Text content adding:
    input.value = name;
    buttonSave.innerHTML = `<i class="fas fa-save"></i>`;
    buttonRemove.innerHTML = `<i class="fas fa-trash"></i>`;
    // Listeners:
    input.addEventListener("change", () => {
        if (buttonSave.classList.contains("fancy__button-disabled")) {
            buttonSave.classList.remove("fancy__button-disabled");
            buttonSave.classList.add("fancy__button-green");
        }
    });
    buttonSave.addEventListener("click", async () => {
        if (!buttonSave.classList.contains("fancy__button-disabled")) {
            displayLoadingScreen();
            try  {
                await renameCollection(container.id, input.value);
                
                buttonSave.classList.remove("fancy__button-green");
                buttonSave.classList.add("fancy__button-disabled");
                
                hideLoadingScreen();
            } catch (error) {
                hideLoadingScreen();
                displayNotification("Error", error);
            }
        }
    });
    buttonRemove.addEventListener("click", async () => {
        displayLoadingScreen();
        try {
            await deleteCollection(container.id);
            
            container.remove();
            
            hideLoadingScreen();
        } catch (error) {
            hideLoadingScreen();
            displayNotification("Error", error);
        }
    });
    // Structure assambly:
    container.appendChild(input);
    container.appendChild(buttonSave);
    container.appendChild(buttonRemove);
    
    return container;
}

const printCollections = (collections) => {
    const fragment = document.createDocumentFragment();
    
    for (let collection of collections)
        fragment.appendChild(setCollection(collection.id, collection.name));
    
    const mainSection = document.querySelector(".main");
    mainSection.appendChild(fragment);
}

const loadAll = async () => {
    // Load all collections' ID's inside "collections" array:
    try {
        let collections = await getCollections();
        
        // Print all collections and hide loading screen when collections are printed:
        printCollections(collections);
        hideLoadingScreen();
    } catch (error) {
        hideLoadingScreen();
        displayNotification("Error", error, {text: "Back to home page", redirect: "/"});
    }
}

loadAll();