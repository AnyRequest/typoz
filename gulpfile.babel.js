const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const tsify = require('tsify');
const minify = require('gulp-minify');
// const alias = require('@gulp-plugin/alias');

const routes = {
  typescript: {
    dest: 'dist',
  },
};

const tsOptions = tsProject.options;

const typescript = () =>
  tsProject
    .src()
    .pipe(tsProject())
    // .plugin(tsify)
    .js
    // .pipe(alias({ config: tsOptions }))
    .pipe(uglify())
    // .pipe(minify())
    .pipe(gulp.dest(routes.typescript.dest));

module.exports.dev = gulp.series(typescript);
