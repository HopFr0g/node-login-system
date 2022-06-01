"use strict";

// On login error codes:
// 0: Wrong username or password (or not verified account)
// 1: You must be loged in to see this content

const bcrypt = require("bcrypt");

const IdGenerator = require("./IdGenerator.js");
const DbManager = require("./DbManager.js");

const authenticate = async (username, password) => {
    try {
        let id = username.toLowerCase();
        const userData = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "id", id);
        return userData.verified && await bcrypt.compare(password, userData.password);
    } catch (error) {
        return false;
    }
}

const registerUser = userData => {
    return new Promise(async (resolve, reject) => {
        try {
            // if there was a previous registration not confirmed for this email, remove the row from "userdata" table from "users.db":
            const registrationNotConfirmed = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "email", userData.email);
            if (registrationNotConfirmed)
                await DbManager.removeRow(__dirname + "/users/users.db", "userdata", "id", registrationNotConfirmed.id);
            // generate an id for the user (they username on lowercase) and another id for the confirmation email:
            const userId = userData.username.toLowerCase();
            const confirmationId = await IdGenerator.generateId(64, {"dir":__dirname + "/users/users.db", "table":"userdata", "column":"confirmationid"});
            // hash the password to store it securely in the database:
            const encryptedPassword = await bcrypt.hash(userData.password, 8);
            // add user data to "userdata" table from "users.db":
            await DbManager.addRow(__dirname + "/users/users.db", "userdata", {"id": userId, "username": userData.username, "password": encryptedPassword, "email": userData.email, "verified": "0", "level": "0", "confirmationid": confirmationId, "resetpasswordid": null});
            // resolve with the confirmation id:
            resolve(confirmationId);
        } catch (error) {
            reject(error);
        }
    });
}

const confirmUser = userConfirmationId => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get object with user data from "userdata" table on "users.db":
            const userData = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "confirmationid", userConfirmationId);
            // Use the short id to modify the "verified" column on the "userdata" table from "users.db":
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "id", userData.id, "verified", 1);
            // Once verified the email address, remove the confirmation id from "userdata" table on "users.db" (the confirmation id is not needed anymore):
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "id", userData.id, "confirmationid", null);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const sendResetPasswordEmail = async email => { // TODO
    try {
        if (typeof email != "string")
            throw "Invalid email format.";
        const userData = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "email", email);
        if (userData) {
            const resetPasswordId = await IdGenerator.generateId(64, {"dir":__dirname + "/users/users.db", "table":"userdata", "column":"confirmationid"});
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "email", email, "resetpasswordid", resetPasswordId);
            // TODO: Send email with reset password link
            console.log("http://localhost:3000/resetpassword/" + resetPasswordId);
        }
    } catch (error) {
        console.error(error);
    }
}

const resetPassword = (resetPasswordId, password) => {
    return new Promise(async (resolve, reject) => { 
        try {
            const encryptedPassword = await bcrypt.hash(password, 8);
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "resetpasswordid", resetPasswordId, "password", encryptedPassword);
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "resetpasswordid", resetPasswordId, "resetpasswordid", null);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const changePassword = (id, newpassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const encryptedPassword = await bcrypt.hash(newpassword, 8);
            await DbManager.editRow(__dirname + "/users/users.db", "userdata", "id", id, "password", encryptedPassword);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

const deleteAccount = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await DbManager.removeRow(__dirname + "/users/users.db", "userdata", "id", id);
            // TODO: When there are more files for the user, delete it too.
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {authenticate, registerUser, confirmUser, sendResetPasswordEmail, resetPassword, changePassword, deleteAccount};