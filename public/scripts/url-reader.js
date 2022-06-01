const getUrlParameters = () => {
    // Structure of 'parameters' object:
    // {"parameter1": "value", "parameter2": "value", "parameter3", "value"}
    let parameters = {};
    
    // Access to "search" attribute on the current url to get the content after '?':
    let search = location.search;
    
    // if there is no parameters in the url, return an empty object:
    if (search == "")
        return parameters;
    
    // Remove '?' (the first character):
    let parametersString = search.substr(1);
    
    // Create un array with all parameters and its values (parameters are separated with an '&'):
    let parametersArray = parametersString.split("&");
    
    // Check all parameters in array, separate its keys and values and save them on parameters object:
    for (let item of parametersArray) {
        let tmp = item.split("=");
        if (tmp[0] != "" && tmp[1] != "")
            parameters[tmp[0]] = tmp[1];
    }
    
    return parameters;
}

export {getUrlParameters};