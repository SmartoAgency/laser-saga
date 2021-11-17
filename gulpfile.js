const proxy = 'lazerSaga';
const projectName = 'laser-saga';
const outputPathProject = `./wp-content/themes/${projectName}/`;

const fs = require('fs');
const gulp = require('gulp');
const rename = require('gulp-rename');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
// pug
const pug = require('gulp-pug');
// css
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// js
const importFile = require('gulp-file-include');
const uglify = require('gulp-uglify-es').default;

// img
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
// svg
const svgSprites = require('gulp-svg-sprites');
const cheerio = require('gulp-cheerio');
const cleanSvg = require('gulp-cheerio-clean-svg');
// eslint
const eslint = require('gulp-eslint');

// webpack
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const paths = {
  root: `${outputPathProject}`,
  templateStyles: {
    main: './src/assets/s3d/styles/pages',
  },
  templates: {
    pages: './src/pug/pages/*.pug',
    src: './src/pug/**/*.pug',
    dest: `${outputPathProject}`,
  },
  phpTemplates: {
    src: './src/assets/s3d/template/*.php',
    dest: `${outputPathProject}/assets/s3d/template/`,
  },
  styles: {
    main: './src/assets/s3d/styles/main.scss',
    importsFiles: 'src/assets/s3d/styles/assets/templates.scss',
    stylesPages: 'src/assets/s3d/styles/pages',
    src: './src/**/*.scss',
    dest: `${outputPathProject}/assets/s3d/styles/`,
  },
  scripts: {
    src: './src/**/*.js',
    dest: `${outputPathProject}/assets/s3d/scripts/`,
  },
  fonts: {
    src: './src/assets/fonts/**/*',
    dest: `${outputPathProject}/assets/fonts`,
  },
  images: {
    src: './src/assets/s3d/images/**/*',
    dest: `${outputPathProject}/assets/s3d/images`,
  },
  svgSprite: {
    src: './src/assets/s3d/svg-sprite/*.svg',
    dest: './src/assets/s3d/svg-sprite/sprite/',
  },
  libs: {
    src: './src/assets/s3d/scripts/libs/libs.js',
    dest: './src/assets/s3d/scripts/gulp-modules/',
  },
  video: {
    src: './src/assets/video/**/*',
    dest: `${outputPathProject}/assets/video`,
  },
  models: {
    src: './src/assets/models/**/*',
    dest: `${outputPathProject}/assets/models`,
  },
  static: {
    src: './src/static/**/*.*',
    dest: `${outputPathProject}/static/`,
  },
};

// create fn for translate content
const translateContentDev = translateContent(paths);
const video = () => translateContentDev('video');
const models = () => translateContentDev('models');
const phpTemplates = () => translateContentDev('phpTemplates');
const fonts = () => translateContentDev('fonts');
const staticFolder = () => translateContentDev('static');
const images = () => translateContentDev('images');

// слежка
function watch() {
  gulp.watch(paths.templateStyles.main, watchScssTemplates);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.phpTemplates.src, phpTemplates);
  gulp.watch(paths.scripts.src, scripts); // for webpack

  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.libs.src, libs);
  gulp.watch(paths.static.src, staticFolder);
  gulp.watch(paths.video.src, video);
  gulp.watch(paths.models.src, models);
  gulp.watch('./src/pug/**/*.html', templates);
  gulp.watch('./src/assets/svg-sprite/*.*', svgSprite);
}

// creater templates scss

function watchScssTemplates() {
  scssTemplateCreater();
  return gulp.src(paths.templates.pages);
}

function scssTemplateCreater() {
  fs.readdir(paths.styles.stylesPages, (err, nameFiles) => {
    const filesNameWithoutExt = nameFiles.map(el => el.replace(/\.scss/g, ''));
    const contentImportsFiles = filesNameWithoutExt.reduce((acc, el) => `${acc}@import './pages/${el}';\n`, '');

    fs.writeFile(contentImportsFiles, paths.styles.importsFiles, null, () => {});
  });
}

// следим за build и релоадим браузер
function server() {
  browserSync.init({
    // server: paths.root,
    notify: false,
    proxy,
  });
  browserSync.watch(`${paths.root}/**/*.*`, browserSync.reload);
}


// очистка
function clean() {
  return del(paths.root);
}

// pug
function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.root));
}

// eslint
function testJsLint() {
  return gulp.src(paths.ts.src)
    .pipe(eslint())
    .pipe(eslint.format());
  // .pipe(eslint.failAfterError());
}

// scss
function styles() {
  return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init()) // инциализация sourcemap'ов
    .pipe(sass({
      outputStyle: 'expanded', // компиляции в CSS с отступами
    }))
    .on('error', notify.onError({
      title: 'SCSS',
      message: '<%= error.message %>', // вывод сообщения об ошибке
    }))
    .pipe(sourcemaps.write())
    .pipe(rename('s3d.min.css'))
    .pipe(gulp.dest(paths.styles.dest));
}

function translateContent(path) {
  return key => gulp.src(path[key].src)
    .pipe(gulp.dest(path[key].dest));
}

// svg-sprite
function svgSprite() {
  return gulp.src(paths.svgSprite.src)
  // .pipe(cheerio({
  // 	run: function ($) {
  // 		$('[fill^="#"]').removeAttr('fill');
  // 		$('[style]').removeAttr('style');
  // 	},
  // 	parserOptions: {
  // 		xmlMode: false
  // 	}
  // }))
    .pipe(svgSprites({
      mode: 'symbols',
      preview: false,
      selector: 'icon-%f',
      svg: {
        symbols: 'symbol_sprite.php',
      },
    }))
    .pipe(gulp.dest(paths.svgSprite.dest));
}

gulp.task('clear', () => cache.clearAll());

// webpack
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

// libs-scripts
function libs() {
  return gulp.src(paths.libs.src)
    .pipe(importFile({ //
      prefix: '@@', // импортим все файлы, описанные в результируещем js
      basepath: '@file', //
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.libs.dest));
}

exports.templates = templates;
exports.phpTemplates = phpTemplates;
exports.styles = styles;
exports.scripts = scripts;
exports.testJsLint = testJsLint;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.svgSprite = svgSprite;
exports.libs = libs;
exports.staticFolder = staticFolder;
exports.video = video;
exports.models = models;
exports.watchScssTemplates = watchScssTemplates;


gulp.task('default', gulp.series(
  watchScssTemplates,
  svgSprite,
  clean,
  libs,
  scripts,
  gulp.parallel(styles, phpTemplates, templates, fonts, images, staticFolder, video, models),
  gulp.parallel(watch, server),
));


// -- BUILD PRODUCTION
const pathsProd = {
  root: './prod',
  templates: {
    src: `${outputPathProject}/s3d/*.html`,
    dest: './prod',
  },
  style: {
    src: `${outputPathProject}/assets/s3d/styles/*.css`,
    dest: './prod/assets/s3d/styles',
  },
  js: {
    src: `${outputPathProject}/assets/s3d/scripts/*.js`,
    dest: './prod/assets/s3d/scripts',
  },
  fonts: {
    src: `${outputPathProject}/assets/s3d/fonts/**/*`,
    dest: './prod/assets/fonts',
  },
  static: {
    src: `${outputPathProject}/s3d/static/**/*.*`,
    dest: './prod/static/',
  },
  video: {
    src: `${outputPathProject}/assets/video`,
    dest: './prod/assets/video',
  },
  images: {
    src: `${outputPathProject}/assets/s3d/images/**/*`,
    dest: './prod/assets/s3d/images',
  },
};


const translateContentProd = translateContent(pathsProd);
const _video = () => translateContentProd('video');
const _scripts = () => translateContentProd('js');
const _fonts = () => translateContentProd('fonts');
const _static = () => translateContentProd('static');

// CLEAN PROD FOLDER
function _clean() {
  return del(pathsProd.root);
}
// HTML
function _templates() {
  return gulp.src(pathsProd.templates.src)
    .pipe(gulp.dest(pathsProd.root));
}
// CSS
function _styles() {
  return gulp.src(pathsProd.style.src)
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(pathsProd.style.dest));
}

// IMG
function _images() {
  return gulp.src(pathsProd.images.src)
    .pipe(cache(imagemin([
      imagemin.gifsicle({
        interlaced: true,
      }),
      imagemin.jpegtran({
        progressive: true,
      }),
      imageminJpegRecompress({
        loops: 5,
        min: 85,
        max: 95,
        quality: 'high',
      }),
      imagemin.svgo(),
      imagemin.optipng(),
      imageminPngquant({
        quality: [0.85, 0.90],
        speed: 5,
      }),
    ], {
      verbose: true,
    })))
    .pipe(gulp.dest(pathsProd.images.dest));
}

exports._templates = _templates;
exports._fonts = _fonts;
exports._static = _static;
exports._clean = _clean;
exports._scripts = _scripts;
exports._styles = _styles;
exports._video = _video;
exports._images = _images;

gulp.task('prod', gulp.series(
  _clean,
  gulp.parallel(_templates, _fonts, _static, _video, _scripts, _styles, _images),
));
