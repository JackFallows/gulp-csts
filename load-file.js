const fs = require("fs");

const makeLoadFile = path => () => {
    const file = fs.readFileSync(path, "utf8");

    return file
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);
};

module.exports = makeLoadFile;