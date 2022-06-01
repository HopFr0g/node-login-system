"use strict";

const DbManager = require("./DbManager.js");

const allowedMailServices = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com"];

// ERROR CODES:
// 0) Reserved for "success" status
// 1) Username must be between 3 and 16 characters long
// 2) Username can only contain letters, numbers and characters _ - .
// 3) The username is already taken
// 4) Password must be between 6 and 32 characters long
// 5) Password must contain at least one lowercase, an uppercase, a number and a special character recognized by the system
// 6) Invalid e-mail format
// 7) For security reasons, only emails ${allowedMailServices.join(", ")} are allowed
// 8) The email address is already taken (keep it secret to avoid "user enumeration" attack)

const validateUsernameLength = (username, errorCode) => {
    return new Promise((resolve, reject) => {
        if (typeof username != "string" || username.length < 3 || username.length > 16)
            return reject(errorCode);
        
        resolve(username);
    });
}

const validateUsernameContent = (username, errorCode) => {
    return new Promise((resolve, reject) => {
        const nameRegex = /[a-zA-Z0-9._-]/g;
        
        if (username.match(nameRegex).length != username.length)
            return reject(errorCode);
        
        resolve(username);
    });
}

const validateUsernameAvailability = (username, errorCode) => {
    return new Promise(async (resolve, reject) => {
        const lowercaseName = username.toLowerCase();
        
        if (await DbManager.findRow(__dirname + "/users/users.db", "userdata", "id", lowercaseName))
            return reject(errorCode);
        
        resolve(username);
    });
}

const validatePasswordLength = (password, errorCode) => {
    return new Promise((resolve, reject) => {
        if (typeof password != "string" || password.length < 6 || password.length > 32)
            return reject(errorCode);
        
        resolve(password);
    });
}

const validatePasswordContent = (password, errorCode) => {
    return new Promise((resolve, reject) => {
        const lowerCase = password.match(/[a-z]/g);
        const upperCase = password.match(/[A-Z]/g);
        const numbers = password.match(/[0-9]/g);
        const special = password.match(/[á-úÁ-Úà-ùÀ-Ùâ-ûÂ-Ûä-üÄ-Ü~ñÑ{}\[\]°|!"#$%&/()=?¿¡.,<>\ *:_-]/g);
        
        if (Array.isArray(lowerCase) && Array.isArray(upperCase) && Array.isArray(numbers) && Array.isArray(special) && lowerCase.length > 0 && upperCase.length > 0 && numbers.length > 0 && special.length > 0)
            return resolve(password);
        
        reject(errorCode);
    });
}

const validateEmailFormat = (email, errorCode) => {
    return new Promise((resolve, reject) => {
        email = email.toLowerCase();
        
        if (typeof email != "string" || email.length < 5 || email.length > 76)
            return reject(errorCode)
        
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
        let validFormat;
        validFormat = emailRegex.test(email);
        validFormat = emailRegex.test(email); // RARE PROBLEM: I have to define validFormat two times. If I only define validFormat once, the conditional below doesn't work (is validFormat false on first try?).
        if (validFormat)
            return reject(errorCode);
        
        resolve(email);
    });
}

const validateEmailService = (email, errorCode) => {
    return new Promise((resolve, reject) => {
        email = email.toLowerCase();
        
        let validService = false;
        for (let service of allowedMailServices)
            if (email.indexOf(service) != -1)
                validService = true;
        if (!validService)
            return reject(errorCode);
        
        resolve(email);
    });
}

const validateEmailAvailability = (email, errorCode) => {
    return new Promise(async (resolve, reject) => {
        email = email.toLowerCase();
        
        const rowFound = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "email", email);
        
        if (!rowFound || rowFound.verified == 0)
            return resolve(email);
        
        reject(errorCode);
    });
}

const validateResetPasswordId = (resetPasswordId, errorCode) => {
    return new Promise(async (resolve, reject) => {
        if (typeof resetPasswordId != "string")
            return reject(errorCode);
        
        let userData = await DbManager.findRow(__dirname + "/users/users.db", "userdata", "resetpasswordid", resetPasswordId);
        if (!userData)
            return reject(errorCode);
        
        resolve(resetPasswordId);
    });
}

module.exports = {
    validateUsernameLength,
    validateUsernameContent,
    validateUsernameAvailability,
    validatePasswordLength,
    validatePasswordContent,
    validateEmailFormat,
    validateEmailService,
    validateEmailAvailability,
    validateResetPasswordId
}