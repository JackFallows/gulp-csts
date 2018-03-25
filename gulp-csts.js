const map = require("map-stream");
const gutil = require("gulp-util");
const csts = require("./csts");

const cstsPlugin = function ({ outputDir }) {
    return map(function (file, cb) {
        let error;

        try {
            csts(file.path, outputDir);
        } catch (e) {
            error = new gutil.PluginError("gulp-csts", e, { showStack: true });
        }

        cb(error, file);
    });
};

module.exports = cstsPlugin;