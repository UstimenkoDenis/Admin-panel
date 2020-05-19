import '../../helpers/iframeLoader.js';
import axios from 'axios';
import React, {Component} from 'react';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = "index.html";
        this.state = {
            pageList: [],
            newPageName: ""
        }
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }
    open(page){
        this.currentPage = `../${page}?rnd=${Math.random}`; // ?rnd=${Math.random} - чтобы обойти кэширование на странице

    // Получим чистый исходный код страницы
        axios
            .get(`../${page}`)    
            .then(res => this.parseStrToDOM(res.data)) // в консоль получим не текст а DOM структуру 
            .then(this.wrapTextNodes)
            .then(this.serializeDOMToString())
            .then(html => axios.post('./api/saveTempPage.php', {html}))
   
        // this.iframe.load(this.currentPage, () => { 
        // });
        
    }
// чтобы распарсить строку в DOM структуру :
    parseStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html")
    }

    wrapTextNodes(dom) {
        const body = dom.body;

        let textNodes = [];

        function recursy (element) {
            element.childNodes.forEach(node => {

                if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) { // избавимся от пустых текстовых node 
                    textNodes.push(node); // добавляем в наш массив элемент с текстом
                } else {
                    recursy(node); 
                }
            })
        }

        recursy(body);

        textNodes.forEach(node => {
            const wrapper = dom.createElement('text-editor') // создаем свой собственный тэг text-editor
            node.parentNode.replaceChild(wrapper, node); // заменит элемент node элементом wrapper 
            wrapper.appendChild(node); // и добавим внутрь wraper наш контент  node 
            wrapper.contentEditable = 'true'; // ставим ему свойство редоктирования
        })

        return dom; // измененный dom где все текстовые ноды обернуты нашими элементами
    }
    // превратим DOM структуру в строку чтобы отправить на сервер
    serializeDOMToString(dom){
        // конвертируем 
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    loadPageList() {
        axios
            .get("./api")
            .then(res => this.setState({pageList: res.data}))
    }

    createNewPage() {
        axios
            .post("./api/createNewPage.php", {"name": this.state.newPageName})
            .then(this.loadPageList())
            .catch(() => alert("Страница уже существует!"));
    }

    deletePage(page) {
        axios
            .post("./api/deletePage.php", {"name": page})
            .then(this.loadPageList())
            .catch(() => alert("Страницы не существует!"));
    }

    render() {
        // const {pageList} = this.state;
        // const pages = pageList.map((page, i) => {
        //     return (
        //         <h1 key={i}>{page}
        //             <a 
        //             href="#"
        //             onClick={() => this.deletePage(page)}>(x)</a>
        //         </h1>
        //     )
        // });

        return (
            //чтобы вставить одну страницу в другую воспользуемся iframe 
            <iframe src = {this.currentPage} frameBorder = "0"></iframe>
            // <>
            //     <input
            //         onChange={(e) => {this.setState({newPageName: e.target.value})}} 
            //         type="text"/>
            //     <button onClick={this.createNewPage}>Создать страницу</button>
            //     {pages}
            // </eltv>
        )
    }
}




/// Сохранение редактирования

// 1. Перед тем как передавать нашу страницу в iframe мы должны пройтись по элементам и обозначить текстовые узлы не запуская JS на странице
//    Это будет первоначальная структура которая должна отображаться на странице
// 2. После этого мы должны сохранить две копии нашего DOM дерева. Одна из них не будет подвергаться изменениям от сторонних JS скриптов, а вторая будет
//    передаваться в iframe и будет изменена этими скриптами. Таким образом у нас получится чистая копия которая содержит такую же структуру как у нас была в верстке
//    и загрязненная копия которая у нас уже подвержена работе скриптов и вней что то может поменяться. Затем мы будем отслеживать все изменения в iframe и в 
//    чистой копии делать нужные нам изменения.