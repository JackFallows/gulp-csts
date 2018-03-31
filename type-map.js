const makeTypeMap = customTypes => type => {
    switch (type) {
        case "int":
            return "number";
        case "string":
            return "string";
        case "bool":
            return "boolean";
        default:
            if (customTypes) {
                return customTypes[type] || `I${type}`;
            }

            return `I${type}`;
    }
};

module.exports = makeTypeMap;