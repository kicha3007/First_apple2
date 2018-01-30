module.exports = function () {

    $.gulp.task('serve', function() {
        $.bs.init({
            server: {
                baseDir: "./build/"
            },
            notify: false // Отключаем уведомления
        });
    });

};
