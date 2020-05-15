const gulp = require('gulp');
const webpack = require('webpack-stream')

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

// gulp copy-html
// gulp build-js