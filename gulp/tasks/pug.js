module.exports = function () {

    $.gulp.task('pug', function () {
        return $.gulp.src("src/pug/pages/*.pug")
            .pipe($.gp.pug({
                pretty: true
            })).on("error", $.gp.notify.onError())
            .on('error', console.log)
            .pipe($.gulp.dest("build"))
            .on("end", $.bs.reload);
    });

};

