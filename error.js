"use strict";

// Function that creates an Error object and adds "description" and "code" atributes to it:
const createError = (description, code) => {
    let errorObject = new Error();
    !description ? errorObject.description = "Unexpected error." : errorObject.description = description;
    !code ? errorObject.code = 500 : errorObject.code = code;
    return errorObject;
}

module.exports = {createError};