const fs = require("fs");

const makeCreateFile = dir => (className, contents) => {
    const filename = className.toLowerCase() + ".d.ts";

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(`${dir}/${filename}`, contents);
};

module.exports = makeCreateFile;