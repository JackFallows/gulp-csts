const fs = require("fs");
const parseName = require("./name-parser");

function csts(f, dir, customTypes) {
    function typeMap(type) {
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
    }

    function extractGenerics(typeParams, type) {
        let generics = type.slice(type.indexOf("<") + 1, type.indexOf(">"))
            .split(",")
            .map(t => t.trim());

        return generics.map(g => {
            if (!typeParams.includes(g)) {
                return typeMap(g);
            }

            return g;
        });
    }

    const file = fs.readFileSync(f, "utf8");

    const lines = file
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const [ module ] = parseName(lines, "namespace");

    let [ className, baseClass, typeParams ] = parseName(lines, "public class");

    const iClass = typeMap(className);

    let iClassFull = iClass;

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

        // console.log(name, typeMap(type), typeParam)
        const mappedType = typeMap(type);
        let field = `${name}: ${mappedType}`;
        // console.log(field, typeParam)
        if (propTypeParams && mappedType !== "any") {
            field += `<${propTypeParams.join(", ")}>`;
        }

        return field;
    });

    const filename = className.toLowerCase() + ".d.ts";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(`${dir}/${filename}`,
        `
// This is a generated file. Any manual changes you make will be overwritten.

declare module ${module} {
    export interface ${iClassFull} {
        ${iprops.join(";\n\t\t")};
    }
}
`)
}

module.exports = csts;