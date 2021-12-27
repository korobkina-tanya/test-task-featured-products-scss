import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/styles/styles.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/styles', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Copy

const copy = () => {
  return gulp.src('source/img/*.*')
    .pipe(gulp.dest('build/img'));
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/styles/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

export default gulp.parallel(
    styles,
    html,
    copy,
    gulp.series(
      server,
      watcher
    )
  );
