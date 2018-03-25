const fs = require("fs");

function csts(f, dir) {
    function getNameStartsWith(lines, starts) {
        const name = lines
            .filter(l => l.startsWith(starts))[0]
            .slice(starts.length)
            .trim();

        if (name.includes(":")) {
            return name.split(":").map(n => n.trim());
        }

        return name;
    }

    function typeMap(type) {
        switch (type) {
            case "int":
                return "number";
            case "string":
                return "string";
            case "bool":
                return "boolean";
            default:
                return `I${type}`;
        }
    }

    const file = fs.readFileSync(f, "utf8");

    const lines = file
        .split("\r\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const module = getNameStartsWith(lines, "namespace");

    const classNames = getNameStartsWith(lines, "public class");
    const className = Array.isArray(classNames) ? classNames[0] : classNames;
    const iClass = "I" + className;
    const iSubclass = Array.isArray(classNames) ? "I" + classNames[1] : "";
    const iClassFull = Array.isArray(classNames) ? [iClass, iSubclass].join(" extends ") : iClass;

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
declare module ${module} {
    export interface ${iClassFull} {
        ${iprops.join("\n\t\t")}
    }
}
`)
}

module.exports = csts;