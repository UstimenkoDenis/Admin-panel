import $ from 'jquery'; //Когда  мы используем такой импорт - нам нужна система сбоки в один рабочий файл
$('h1').fadeOut(); //команда будет убирать наш заголовок , но сейчас будет ошибка тк не стоит система сборки


// Приступим к настройке системы сборки нашего проекта
// Наши JS файлы мы будем компилировать при помощи webpack, однако - Все задачи мы будем запускать при помощи GULP 

//////WEBPACK
// Установка webpack:  npm i --save-dev webpack webpack-cli webpack-stream -

//Первый - сам вебпэк
// второй -  чтобы мы могли давать задания из клиента
// последний чтобы все успешно обрабатывалось в gulp 


/// BABEL
// Установка babel npm i @babel/core @babel/preset-env @babel/preset-react babel-loader --save-dev

///// ПОЛИФИЛЫ
// Добавим еще библиотеку содержащую полифилы:     npm i core-js --save