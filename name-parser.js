function parseNameLine(lines, starts) {
    let name = lines
        .filter(l => l.startsWith(starts))[0]
        .slice(starts.length)
        .trim();

    let baseClass = null;
    if (name.includes(":")) {
        [ name, baseClass ] = name.split(":").map(n => n.trim());
    }

    let typeParams = [];
    if (name.includes("<")) {
        typeParams = name
            .slice(name.indexOf("<") + 1, name.indexOf(">"))
            .split(",")
            .map(t => t.trim());

        name = name.slice(0, name.indexOf("<"));
    }

    return [ name, baseClass, typeParams ];
}

module.exports = parseNameLine;