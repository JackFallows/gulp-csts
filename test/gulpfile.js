const gulp = require("gulp");
const csts = require("../gulp-csts");

gulp.task("default", () => {
    return gulp.src("./Models/*.cs")
        .pipe(csts({ outputDir: "./typings" }));
});