"use strict";

const dbManager = require("./dbmanager.js");

const getDbDir = userId => {
    return __dirname + "/users/collections/" + userId + ".db";
}

const checkCollectionIdExists = (userId, collectionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let collection = await dbManager.findRow(getDbDir(userId), "__collections", "id", collectionId);
            if (collection)
                return resolve(true);
            return resolve(false);
        } catch (error) {
            reject(error);
        }
    });
}

const checkCollectionNameExists = (userId, collectionName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let collection = await dbManager.findRow(getDbDir(userId), "__collections", "name", collectionName);
            if (collection)
                return resolve(true);
            return resolve(false);
        } catch (error) {
            reject(error);
        }
    });
}

const checkEntryIdExists = (userId, collectionId, entryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let entry = await dbManager.findRow(getDbDir(userId), collectionId, "id", entryId);
            if (entry)
                return resolve(true);
            return resolve(false);
        } catch (error) {
            reject(error);
        }
    });
}

const validateCollectionName = collectionName => {
    return new Promise((resolve, reject) => {
        if (typeof collectionName != "string" || collectionName.length > 32)
            return reject("Collection name must not exceed 32 characters.");
        resolve(collectionName);
    });
}

const validateEntryDate = date => {
    return new Promise((resolve, reject) => {
        // El método toISOString() devuelve una cadena en el formato simplificado extendido ISO (ISO 8601)
        // YYYY-MM-DDTHH:mm:ss.sssZ
        // El uso horario no tiene retraso respecto a UTC, como lo denota el sufijo "Z".
        
        
    });
}

const validateEntryRepeat = repeat => {
    return new Promise((resolve, reject) => {
        
    });
}

const validateEntryTitle = title => {
    return new Promise((resolve, reject) => {
        
    });
}

const validateEntryDescription = description => {
    return new Promise((resolve, reject) => {
        
    });
}

// .then(data => console.log(data)).catch(error => console.log(error));

module.exports = {};