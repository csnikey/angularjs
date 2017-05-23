var gulp = require('gulp');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var clean = require('gulp-clean');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var autoprefixer = require('gulp-autoprefixer');
var proxyMiddleware = require('http-proxy-middleware');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var ScriptFile = [
    'src/action/**/*.js',
];

gulp.task('concatJs', function() {
    return gulp.src(ScriptFile)
        .pipe(concat('main.js'))
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./js/main'))
})
gulp.task('concatJs-dev', function() {
    return gulp.src(ScriptFile)
        .pipe(concat('main.js'))
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(gulp.dest('./js/main'))
})

gulp.task('concatCss', function() {
    return gulp.src('src/style/*.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers:['last 2 versions','Android >= 4.0']
            }))
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('./css/main'))
})
gulp.task('concatCss-dev', function() {
    return gulp.src('src/style/*.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers:['last 2 versions','Android >= 4.0']
            }))
        .pipe(gulp.dest('./css/main'))
})
gulp.task('moveHtml',function(){
  return gulp.src('src/action/view/**/*.html')
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('pages'))
})

gulp.task('inject', ['concatJs', 'concatCss','moveHtml'], function() {
    gulp.src('./src/index.html')
        .pipe(inject(gulp.src(['./js/main/*.js', './css/main/*.css'], {
            read: false
        }), {
            relative: true
        }))
        .pipe(gulp.dest('./'))
})
gulp.task('inject-dev', ['concatJs-dev', 'concatCss-dev','moveHtml'], function() {
    gulp.src('./src/index.html')
        .pipe(inject(gulp.src(['./js/main/*.js', './css/main/*.css'], {
            read: false
        }), {
            relative: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(reload({stream:true}))
})

gulp.task('clean', function() {
    return gulp.src(['./js/main','./css/main','./pages'])
        .pipe(clean())
})

gulp.task('watch', function() {
    gulp.watch(['src/action/**/**/*.js','src/style/*.css'],['build'])
})



gulp.task('serve2', function() {

  var options = {
        target: 'http://dev.kankanyisheng.com', // target host
        changeOrigin: true,               // needed for virtual hosted sites
        pathRewrite: {
            '^/api' : '',
        },
    };
    var middleware = proxyMiddleware('/api', options);

    browserSync.init({
        server: {
            baseDir: "./",
            index: './index.html',
			      middleware: middleware
        }
    });

//  gulp.watch(['src/action/**/*.js','src/style/*.css','src/action/view/**/*.html'],['dev']);
//  gulp.watch("./tpl/**/*.html").on("change", browserSync.reload);
});

gulp.task('serve', ['dev'],function() {

  var options = {
        target: 'http://dev.kankanyisheng.com', // target host
        changeOrigin: true,               // needed for virtual hosted sites
        pathRewrite: {
            '^/api' : '',
        },
    };
    var middleware = proxyMiddleware('/api', options);

    browserSync.init({
        server: {
            baseDir: "./",
            index: './index.html',
			      middleware: middleware
        }
    });

    gulp.watch(['src/action/**/*.js','src/style/*.css','src/action/view/**/*.html'],['dev']);
    gulp.watch("./tpl/**/*.html").on("change", browserSync.reload);
});

gulp.task('build',['clean'],function(){
    gulp.start('inject')
})
gulp.task('dev',['clean'],function(){
    gulp.start('inject-dev')
})

gulp.task('default', ['build'])


