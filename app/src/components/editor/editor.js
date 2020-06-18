import '../../helpers/iframeLoader.js';
import axios from 'axios';
import React, {Component} from 'react';
import DOMHelper from '../../helpers/dom-helper';

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
       this.currentPage = page; 
        // Получим чистый исходный код страницы
        axios
            .get(`../${page}?rnd=${Math.random()}`)    // ?rnd=${Math.random} - чтобы обойти кэширование на странице
            .then(res => DOMHelper.parseStrToDOM(res.data)) //  переведем текст в DOM структуру 
            .then(DOMHelper.wrapTextNodes)  // оборачиваем текстовые ноды
            .then(dom => {
                this.virtualDom = dom; // нашу чистую копию записываем в свойство virtualDom
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../temp.html"))
            .then(() => this.enableEditing()) 
   
                  
    }

    save() {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        axios
            .post("./api/savePage.php", {pageName: this.currentPage, html})
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach( element => {
            element.contentEditable = "true";                 // ставим ему свойство редактирования
            element.addEventListener("input", () => {
                this.onTextEdit(element);  // этот метод отвечает за синхронизацию всех изменений
            });
        });        
    }

    onTextEdit(element) {
        const id = element.getAttribute("nodeid")
        this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
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
            <>     
                <button onClick = {() => this.save()}>Click</button>    
                <iframe src = {this.currentPage} frameBorder = "0"></iframe>
                 
            </>

            // <>
            //     <input
            //         onChange={(e) => {this.setState({newPageName: e.target.value})}} 
            //         type="text"/>
            //     <button onClick={this.createNewPage}>Создать страницу</button>
            //     {pages}
            // </>
        )
    }
}