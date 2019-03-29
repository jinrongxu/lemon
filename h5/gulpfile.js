const gulp = require("gulp");
const sass = require("gulp-sass");
const webServer = require("gulp-webserver");

gulp.task("devCss", () => {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css/"))
});
gulp.task("watch", () => {
    gulp.watch("./src/scss/*.scss", gulp.series("devCss"))
});
gulp.task("server", () => {
    return gulp.src("./src")
        .pipe(webServer({
            port: 5555,
            livereload: true,
            proxies: [{
                //登录
                source: "/api/login",
                target: "http://localhost:3000/api/login"
            }, {
                //查找全部
                source: "/api/findBill",
                target: "http://localhost:3000/api/findBill"
            }, {
                //删除
                source: "/api/delBill",
                target: "http://localhost:3000/api/delBill"
            }, {
                //增加
                source: "/api/addBill",
                target: "http://localhost:3000/api/addBill"
            }, {
                //按时间查找
                source: "/api/timer",
                target: "http://localhost:3000/api/timer"
            }, {
                //查找类
                source: "/api/findClass",
                target: "http://localhost:3000/api/findClass"
            }]
        }))

});
gulp.task("dev", gulp.series("server", "devCss", "watch"))