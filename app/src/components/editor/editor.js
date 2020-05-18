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
        this.currentPage = `../${page}`;
        this.iframe.load(this.currentPage, () => { // выполнится, когда iframe полностью загрузился
            const body = this.iframe.contentDocument.body;

    // Применим рекурсию. Будем перебирать все узлы до тех пор пока не найдем текстовый
            let textNodes = [];

            function recursy (element) {
                element.childNodes.forEach(node => {

                    if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) { // избавимся от пустых текстовых node 
                        textNodes.push(node);
                    } else {
                        recursy(node);
                    }
                })
            }

           recursy(body);

           textNodes.forEach(node => {
               const wrapper = this.iframe.contentDocument.createElement('text-editor') // создаем свой собственный тэг text-editor
               node.parentNode.replaceChild(wrapper, node);
               wrapper.appendChild(node);
               wrapper.contentEditable = 'true';
           })
        });
        
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

// В html есть ручной режим редактирования элементов
// Любому элементу можем приписать свойство contenteditable и изменять 

//$0.innerHtml - показать все про элемент

//$0.childnodes - какие есть дети

// Поэтому будем искать именно текстовые узлы и включать им contenteditable
