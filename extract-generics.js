const makeExtractGenerics = typeMap => (internalTypeParams, type) => {
    if (!type.includes("<")) {
        return [];
    }
    
    let generics = type.slice(type.indexOf("<") + 1, type.indexOf(">"))
        .split(",")
        .map(t => t.trim());

    if (internalTypeParams === true) {
        return generics;
    }
    
    return generics.map(g => {
        if (!internalTypeParams.includes(g)) {
            return typeMap(g);
        }

        return g;
    });
};

module.exports = makeExtractGenerics;