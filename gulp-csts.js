const map = require("map-stream");
const gutil = require("gulp-util");

const cstsPlugin = function ({ outputDir, types }) {
    return map(function (file, cb) {
        const loadFile = require("./load-file")(file.path);
        const createFile = require("./create-file")(outputDir);
        const csts = require("./csts")(loadFile, createFile);
        
        let error;

        try {
            csts(types);
        } catch (e) {
            error = new gutil.PluginError("gulp-csts", e, { showStack: true });
        }

        cb(error, file);
    });
};

module.exports = cstsPlugin;