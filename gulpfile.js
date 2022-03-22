const gulp = require("gulp");
const themeKit = require("@shopify/themekit");
const sass = require("gulp-sass")(require("sass"));
const clean = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const replace = require("gulp-replace");
const rename = require("gulp-rename");

gulp.task("sass", function () {
  return gulp
    .src("styles/custom-styles.scss")
    .pipe(sass())
    .pipe(
      clean({
        compatibility: "ie11",
      })
    )
    .pipe(autoprefixer())
    .pipe(replace('"{{', "{{"))
    .pipe(replace('}}"', "}}"))
    .pipe(rename("custom-styles.css.liquid"))
    .pipe(gulp.dest("assets"));
});

gulp.task("watch", function () {
  gulp.watch("styles/**/*.scss", gulp.series("sass"));
  themeKit.command("watch", {
    env: "development",
    "allow-live": true,
  });
});
