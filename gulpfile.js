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

gulp.task("clean",function(){
	 return gulp.src(['./dist/css',"./dist/js",'./dist/tpl'])
        .pipe(clean())
})

gulp.task('buildJs', function() {
    return gulp.src('src/**/*.js')
        .pipe(concat("main.js"))
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
})
gulp.task('buildCss', function() {
    return gulp.src('src/css/*.css')
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            browsers:['last 2 versions','Android >= 4.0']
            }))
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
})
//view 下的二级目录全部拷贝
gulp.task("buildHtml",function(){
	return gulp.src('./src/view/**/*.html')
	 .pipe(rename({dirname: ''})).pipe(
		gulp.dest('./dist/tpl')
	)
})

// 页面部分拷贝到生产目录
gulp.task("buildHtml",function(){

return gulp.src('./src/index.html').pipe(
		gulp.dest('./dist'))
})
//把编译好的文件注入到页面
gulp.task("build",["clean","buildCss","buildJs","buildHtml"],function(){
	var sources = gulp.src(['./dist/css/*.css','./dist/js/*.js'], {read: false});

	return target.pipe(inject(sources,{ralative:true})).pipe(
		gulp.dest('./dist')
	)
	
})
//默认的就是构建服务
gulp.task('default', ['build']);
//启动服务
gulp.task("serve",["build"],function(){
// 启动服务
    browserSync.init({
        server: {
            baseDir: "./",
            index: './dist/index.html',
//			      middleware: middleware
        }
    });
    // 监听文件变化
    gulp.watch(["src/**/*.html",'src/css/*.css','src/**/*.js'],['build']);
    gulp.watch("dist/index.html").on("change",browserSync.reload);
})
gulp.task('moveHtml',function(){
  return gulp.src('src/action/view/**/*.html')
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('pages'))
})

