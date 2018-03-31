const fs = require("fs");

const makeCsts = (loadFile, createFile) => (customTypes) => {
    const typeMap = require("./type-map")(customTypes);
    const extractGenerics = require("./extract-generics")(typeMap);
    const { parseNamespace, parseClass } = require("./name-parser")(extractGenerics);
    
    const lines = loadFile();

    const { name: module } = parseNamespace(lines);

    let { result: { name: className, baseClass, typeParams }, parseProperty } = parseClass(lines);

    let iClassFull = typeMap(className);

    if (typeParams.length > 0) {
        iClassFull += "<";
        iClassFull += typeParams.join(", ");
        iClassFull += ">";
    }

    if (baseClass) {
        let baseTypeParams = null;
        if (baseClass.includes("<")) {
            baseTypeParams = extractGenerics(typeParams, baseClass);

            baseClass = baseClass.slice(0, baseClass.indexOf("<"));
        }

        baseClass = typeMap(baseClass);
        iClassFull = [iClassFull, baseClass].join(" extends ");

        if (baseTypeParams && baseClass !== "any") {
            iClassFull += `<${baseTypeParams.join(", ")}>`;
        }
    }

    const csprops = lines
        .filter(l => l.startsWith("public") && !l.startsWith("public class"));

    const iprops = csprops.map(p => {
        const noPublic = p.slice("public ".length);

        let type, name;

        if (noPublic.includes("<")) {
            let indexOfSpaceAfterBracket = noPublic.indexOf(" ", noPublic.indexOf(">"));
            type = noPublic.slice(0, indexOfSpaceAfterBracket).trim();
            name = noPublic.slice(indexOfSpaceAfterBracket, noPublic.indexOf(" ", indexOfSpaceAfterBracket + 1)).trim();
        } else {
            [ type, name ] = noPublic.split(" ").slice(0, 2);
        }
        
        if (type.endsWith("?")) {
            type = type.slice(0, type.length - 1);
            name += "?";
        }

        let propTypeParams = null;
        if (type.includes("<")) {
            propTypeParams = extractGenerics(typeParams, type);

            type = type.slice(0, type.indexOf("<"));
        }

        const mappedType = typeMap(type);
        let field = `${name}: ${mappedType}`;
        if (propTypeParams && mappedType !== "any") {
            field += `<${propTypeParams.join(", ")}>`;
        }

        return field;
    });

    const contents = `
// This is a generated file. Any manual changes you make will be overwritten.

declare module ${module} {
    export interface ${iClassFull} {
        ${iprops.join(";\n\t\t") + (iprops.length > 0 ? ";" : "")}
    }
}
`;

    createFile(className, contents);
    
    return contents;
};

module.exports = makeCsts;