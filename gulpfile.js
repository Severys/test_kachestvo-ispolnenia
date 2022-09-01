const {src, dest, task, series, watch, parallel} = require("gulp");
const rm = require( 'gulp-rm' );
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const {DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS} = require('./gulp.config'); 
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV


task('clean', () => {
  return src(`${DIST_PATH}`, { read: false }).pipe(rm())
})

task('copy:html', () => {
    return src(`${SRC_PATH}/*.html`)
        .pipe(dest(DIST_PATH))
        .pipe(reload({ stream: true}));
   });

task('copy:image', () => {
return src(`${SRC_PATH}/image/*`)
    .pipe(dest(`${DIST_PATH}/image`))
    .pipe(reload({ stream: true}));
});   

task('styles', ()=> {
    return src([...STYLES_LIBS,"src/styles/main.scss"])
        .pipe(gulpif(env==='dev', sourcemaps.init()))
        .pipe(concat('main.min.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        // .pipe(px2rem())
        .pipe(gulpif(env === 'dev',
           autoprefixer({
			cascade: false
		   })
        ))
        .pipe(gulpif(env==='prod',gcmq()))
        .pipe(gulpif(env==='prod',cleanCSS({compatibility: 'ie8'})))
        .pipe(gulpif(env==='dev',sourcemaps.write()))
        .pipe(dest(DIST_PATH))
        .pipe(reload({ stream: true}));
});

task('scripts', () => {
    return src(['src/scripts/*.js'])
    // .pipe(gulpif(env==='dev', sourcemaps.init()))
    .pipe(concat('main.min.js'))
    .pipe(gulpif(env==='dev', uglify()))
    // .pipe(gulpif(env==='dev', sourcemaps.write()))
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true}));
})

task('server', () => {
    browserSync.init({
        server: {
            baseDir: `./${DIST_PATH}`
        },
        open: false,
    });
});

task('watch', () =>{
    watch(`./${SRC_PATH}/styles/**/*.scss`, series('styles'));
    watch(`./${SRC_PATH}/*.html`, series('copy:html'));
    watch(`./${SRC_PATH}/scripts/*.js`, series('scripts'));
});



task(
    'default', 
    series(
        'clean', 
        parallel('copy:html','copy:image', 'styles', 'scripts'),
        parallel('watch', 'server')
    )
);

task(
    'build',
    series( 'clean', 
    parallel('copy:html','copy:image', 'styles', 'scripts')
    )
);