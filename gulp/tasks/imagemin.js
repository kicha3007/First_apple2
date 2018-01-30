module.exports = function () {

    // $.gulp.task('img', function () {
    //     return $.gulp.src("src/static/img/*.{png,jpg,gif}")
    //         .pipe($.gp.tingpng("API_KEY"))
    //         .pipe($.gulp.dest("build/static/img/"))
    // });


    $.gulp.task('imagemin', function() {
        return $.gulp.src('src/static/img/**/*')
            .pipe($.gp.imagemin())
            .pipe($.gulp.dest('build/static/img/'))
    });


};