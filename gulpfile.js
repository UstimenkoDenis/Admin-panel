const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');

const dist = 'C:/openServer/OSPanel/domains/localhost/react_admin/admin'
// 1 задача - чтобы index.html копировался на сервер

gulp.task("copy-html",()=>{
    return gulp.src('./app/src/index.html')
        .pipe(gulp.dest(dist))
     
})
// чтобы запустить задачу пишем gulp copy-html
// gulp скопирует и теперь мы можем в браузере зайти http://localhost/react_admin/admin/ и там будет наш html !

// jS будем формировать при помощи webpack

gulp.task("build-js",()=>{
    return gulp.src('./app/src/main.js')
        .pipe(webpack({
                mode: 'development',
                output: {
                    filename: 'script.js'
                },
                watch: false,
                devtool: 'source-map',
                ////////////////////////////////////////////// этот код вставлен с сайта webpack
                module: {
                  rules: [
                    {
                      test: /\.m?js$/,
                      exclude: /(node_modules|bower_components)/,
                      use: {
                        loader: 'babel-loader',
                        options: {
                          presets:[['@babel/preset-env',{     // запишем настройки для пресета
                                debug: true,
                                corejs: 3,
                                useBuiltIns: "usage"

                                // далее в package.json допишем "browserslist": [
//                                  "last 2 chrome versions",
//                                  "last 2 firefox versions",
//                                  "last 2 ios versions",
                             //   ]
                          }],
                          "@babel/react"]
                        }
                      }
                    }
                  ]
                }
             ////////////////////////////////////////////// этот код вставлен с сайта webpack
        }))
        .pipe(gulp.dest(dist))
})


// Запусить задучу :
// gulp copy-html
// gulp build-js

gulp.task('build-sass', () => {
  return gulp.src('./app/scss/style.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest(dist))
})

gulp.task('copy-api', () => {
  return gulp.src('./app/api/**/*.*')
            .pipe(gulp.dest(dist+'/api'))
})

gulp.task('copy-assets', () => {
  return gulp.src('./app/assets/**/*.*')
           .pipe(gulp.dest(dist + '/assets'))
})

// gulp сдеди за изменениями:
// за чем следим, какая задача
gulp.task('watch', () => {
  return gulp.watch('./app/src/index.html', gulp.parallel('copy-html'));
         gulp.watch('./app/assets/**/*.*', gulp.parallel('copy-assets'));
         gulp.watch('./app/api/**/*.*', gulp.parallel('copy-api'));
         gulp.watch('./app/scss/**/*.scss', gulp.parallel('build-sass'));
         gulp.watch('./src/**/*.*', gulp.parallel('build-js'));
         
});
// Важно watch - отслеживает только последующие изменения после запуска этой команды

// Поэтому сделаем таск билд чтобы полностью сбилдить наш проект - будет запускать не только те задачи которые нужны
// в данный момент а сразу все

gulp.task('build', gulp.parallel('copy-html', 'copy-assets', 'copy-api', 'build-sass', 'build-js'));

// чтобы запускать все одной командой gulp :

gulp.task('default', gulp.parallel('watch', 'build')); 