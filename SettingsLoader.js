const fs = require("fs");

const load = fieldName => {
    try {
        const data = fs.readFileSync("./settings.json");
        const dataObj = JSON.parse(data);
        if (dataObj[fieldName])
            return dataObj[fieldName];
        throw `Error reading ${fieldName}.`;
    } catch (error) {
        throw `Error reading ${fieldName} from ${__dirname}/settings.json`;
    }
}

module.exports = {load}