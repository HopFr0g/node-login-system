"use strict";

const renameCollection = (id, name) => {
    return new Promise((resolve, reject) => {
        // Resolves void or rejects string with error message
        const body = {id, name};
        
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        };
        
        fetch("http://localhost:3000/renamecollection", requestOptions).then(async res => {// TODO URL
            if (res.ok)
                resolve();
            else
                res.text().then(data => reject(data));
        }).catch(error => {
            console.error(error);
        });
    });
}

const deleteCollection = id => {
    return new Promise((resolve, reject) => {
        // Resolves void or rejects string with error message
        const body = {id};
        
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        };
        
        fetch("http://localhost:3000/deletecollection", requestOptions).then(async res => {//TODO URL
            if (res.ok)
                resolve();
            else
                res.text().then(data => reject(data));
        }).catch(error => {
            console.error(error);
        });
    });
}

const getCollections = () => {
    return new Promise((resolve, reject) => {
        // Resolves array of objects with collections info for the current loged in user, or rejects string with error msg
        fetch("http://localhost:3000/getcollections").then(async res => {// TODO URL
            if (res.ok)
                res.json().then(data => resolve(data));
            else
                res.text().then(data => reject(data));
        }).catch(error => {
            console.error(error);
        });
    });
}

const createCollection = () => {
    return new Promise((resolve, reject) => {
        // Resolves object with collection info {id, name} or rejects string with error message
        fetch("http://localhost:3000/createcollection").then(async res => {// TODO URL
            if (res.ok)
                res.json().then(data => resolve(data));
            else
                res.text().then(data => reject(data));
        }).catch(error => {
            console.error(error);
        });
    });
}

export {renameCollection, deleteCollection, getCollections, createCollection};