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

    const file = fs.readFileSync(f, "utf8");

    const lines = file
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const [ module ] = parseName(lines, "namespace");

    const [ className, baseClass, typeParams ] = parseName(lines, "public class");

    const iClass = "I" + className;

    let iClassFull = iClass;

    if (typeParams.length > 0) {
        iClassFull += "<";
        iClassFull += typeParams.join(", ");
        iClassFull += ">";
    }

    if (baseClass) {
        iClassFull = [iClassFull, baseClass].join(" extends ");
    }

    const csprops = lines
        .filter(l => l.startsWith("public") && !l.startsWith("public class"));

    const iprops = csprops.map(p => {
        const noPublic = p.slice("public ".length);

        let [type, name] = noPublic.split(" ").slice(0, 2);
        if (type.endsWith("?")) {
            type = type.slice(0, type.length - 1);
        }

        return `${name}: ${typeMap(type)}`;
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
        ${iprops.join(",\n\t\t")}
    }
}
`)
}

module.exports = csts;