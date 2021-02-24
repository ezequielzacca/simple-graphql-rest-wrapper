const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const nodemon = require("gulp-nodemon");
const sourcemaps = require("gulp-sourcemaps");
const relativeSourcemapsSource = require("gulp-relative-sourcemaps-source");
const cache = require("gulp-cached");

gulp.task("assets", () => {
    return gulp
        .src([
            "./src/**/*",
            "!./src/**/*.ts"
        ])
        .pipe(cache("cache_assets", { optimizeMemory: true }))
        .pipe(gulp.dest("dist"));
});

gulp.task(
    "compile",
    gulp.series(() => {
        return gulp
            .src("src/**/*.ts")
            .pipe(cache("cache_compile", { optimizeMemory: true }))
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(relativeSourcemapsSource({ dest: "dist" }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("dist"));
    }, "assets")
);

let started = false;
gulp.task("nodemon", (cb) => {
    if (started) {
        return cb();
    }

    let stream = nodemon({
        script: "dist/app.js",
    });
    stream
        .on("start", () => {
            if (!started) {
                started = true;
                cb();
            }
        })
        .on("restart", function () {
            cb();
        });
});

gulp.task("default", () => gulp.watch(
    [
        "src/**/*.ts",
        "*.json"
    ],
    { ignoreInitial: false },
    gulp.series("compile", "nodemon")
));



