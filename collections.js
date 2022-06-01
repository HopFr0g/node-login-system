"use strict";

const dbManager = require("./dbmanager.js");
const idGenerator = require("./id-generator.js");
const collectionValidator = require("./collection-validator.js");

const getDbDir = userId => {
    return __dirname + "/users/collections/" + userId + ".db";
}

const getCollections = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            const collections = await dbManager.getRows(getDbDir(userId), "__collections");
            resolve(collections);
        } catch (error) {
            reject(error);
        }
    });
}

const renameCollection = (userId, collectionId, collectionName) => {
    return new Promise(async (resolve, reject) => {
        try {
            await dbManager.editRow(getDbDir(userId), "__collections", "id", collectionId, "name", collectionName);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const deleteCollection = (userId, collectionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await dbManager.removeTable(getDbDir(userId), collectionId);
            await dbManager.removeRow(getDbDir(userId), "__collections", "id", collectionId);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const createCollectionsDatabase = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            await dbManager.createDataBase(getDbDir(userId));
            await dbManager.createTable(getDbDir(userId), "__collections", {name: "id", type: "TEXT", primaryKey: true}, {name: "name", type: "TEXT", primaryKey: true});
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const createCollection = userId => {
    return new Promise(async (resolve, reject) => {
        try {
            const collections = await dbManager.getRows(getDbDir(userId), "__collections");
            
            if (collections.length >= 3)
                return reject("You've reached the maximum amount of collections. Delete or edit one of your existing collections.");
            
            let collectionIds = [];
            let collectionNames = [];
            
            for (let collection of collections) {
                collectionIds.push(collection.id);
                collectionNames.push(collection.name);
            }
            
            let validId = false;
            let id = "";
            while (!validId) {
                id = idGenerator.generateId(8);
                
                if (collectionIds.indexOf(id) == -1)
                    validId = true;
            }
            
            let validName = false;
            let defaultName = "My new collection ";
            let nameNumber = 1;
            while (!validName) {
                if (collectionNames.indexOf(defaultName + nameNumber.toString()) == -1)
                    validName = true;
                else
                    ++nameNumber;
            }
            
            await dbManager.addRow(getDbDir(userId), "__collections", {id, name: defaultName + nameNumber.toString()});
            
            await dbManager.createTable(getDbDir(userId), id, {name: "id", type: "TEXT", primaryKey: true}, {name: "date", type: "TEXT"}, {name: "repeat", type: "INTEGER"}, {name: "title", type: "TEXT"}, {name: "description", type: "TEXT"});
            
            resolve({id, name: defaultName + nameNumber.toString()});
        } catch (error) {
            reject(error);
        }
    });
}

const getEntries = (userId, collectionId) => {
    return new Promise(async (resolve, reject) => {
        if (typeof collectionId != "string")
            return reject("The provided collection ID is invalid.");
        
        try {
            await collectionValidator.validateCollectionId(userId, collectionId); /// TODO
            
            let entries = await dbManager.getRows(getDbDir(userId), collectionId);
            resolve(entries);
        } catch (error) {
            reject(error);
        }
    });
}

const saveEntry = (userId, collectionId, entryData) => {
    return new Promise(async (resolve, reject) => {
        
    });
}

// getEntries("hopfr0g", "98lo0pCm").then(data => console.log(data)).catch(error => console.log(error));

module.exports = {getCollections, renameCollection, deleteCollection, createCollectionsDatabase, createCollection, getEntries};