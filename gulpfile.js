import gulp from "gulp";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import rename from "gulp-rename";
import browser from "browser-sync";

function styles() {
  return gulp
    .src("source/styles/styles.scss", { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("build/styles", { sourcemaps: "." }))
    .pipe(browser.stream());
}

function html() {
  return gulp.src("source/*.html").pipe(gulp.dest("build"));
}

function copy() {
  return gulp.src("source/img/*.*").pipe(gulp.dest("build/img"));
}

async function server() {
  browser.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
}

async function reload() {
  browser.reload();
}

function watcher() {
  gulp.watch("source/styles/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

gulp.task(
  "default",
  gulp.parallel(styles, html, copy, gulp.series(server, watcher))
);
gulp.task("build", gulp.parallel(styles, html, copy));
