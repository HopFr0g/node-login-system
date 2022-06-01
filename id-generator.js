"use strict";

const dbManager = require("./dbmanager.js");

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const getRandomId = length => {
    const asciiRanges = [[65, 90], [97, 122], [48, 57]];
    let id = "";
    for (let i = 0; i < length; ++i) {
        let range = asciiRanges[getRandomNumber(0, asciiRanges.length - 1)];
        let randomNumber = getRandomNumber(range[0], range[1]);
        id += String.fromCharCode(randomNumber);
    }
    return id;
}

const generateId = (length, databaseInfo /* optional */ ) => {
    if (!length)
        length = 16;
    
    if (!databaseInfo)
        return getRandomId(length);
    
    return new Promise(async (resolve, reject) => {    
        let id = "";
        let isValid = false;
        
        while (!isValid) {
            id = getRandomId(length);
            
            if (!databaseInfo)
                isValid = true;
            else
                try {
                    isValid = !await dbManager.findRow(databaseInfo.dir, databaseInfo.table, databaseInfo.column, id);
                } catch (error) {
                    reject(error);
                }
        }
        
        return resolve(id);
    });
}

module.exports = {generateId};