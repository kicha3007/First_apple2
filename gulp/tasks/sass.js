module.exports = function () {

    $.gulp.task('sass', function () {
        return $.gulp.src("src/static/scss/main.scss")
            .pipe($.gp.sourcemaps.init())
            .pipe($.gp.sass())
            // .on("error", $.gp.notify.onError({
            //     message: "Error: <%= error.message %>",
            //     title: "Error running something"
            // }))
            .on("error", $.gp.notify.onError())
            .pipe($.gp.csso())
            .pipe($.gp.cssbeautify({
                indent: '  ',
                openbrace: 'end-of-line',
                autosemicolon: false
            }))
            .pipe($.gp.sourcemaps.write())
            .pipe($.gulp.dest("build/static/css/"))
            .pipe($.bs.reload({
                stream: true
            }));
    });

};
