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
       this.currentPage = `../${page}?rnd=${Math.random()}`; // ?rnd=${Math.random} - чтобы обойти кэширование на странице
        // Получим чистый исходный код страницы
        axios
            .get(`../${page}`)    
            .then(res => this.parseStrToDOM(res.data)) //  переведем текст в DOM структуру 
            .then(this.wrapTextNodes)  // оборачиваем текстовые ноды
            .then(dom => {
                this.virtualDom = dom; // нашу чистую копию записываем в свойство virtualDom
                return dom;
            })
            .then(this.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../temp.html"))
            .then(() => this.enableEditing()) 
   
                  
    }

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach( element => {
            element.contentEditable = "true";                 // ставим ему свойство редактирования
            element.addEventListener("input", () => {
                this.onTextEdit(element);  // этот метод отвечает за синхронизацию всех изменений
            })
        });        
    }

    onTextEdit(element) {
        const id = element.getAttribute("nodeid")
        this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML;
    }

    // Чтобы перевести обычный тект в DOM структуру :
    parseStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }

    wrapTextNodes(dom) { //оборачивает все текстовые узлы
        const body = dom.body;        
        let textNodes = [];

        function recursy (element) {
            element.childNodes.forEach(node => {

                if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, "").length > 0) { // избавимся от пустых текстовых узлов  
                    textNodes.push(node); // добавляем в наш массив текстовый узел                
                } else {
                    recursy(node); 
                }
            })
        };
        recursy(body);
        
        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor'); // создаем свой собственный тэг text-editor для каждого текстового узла
            node.parentNode.replaceChild(wrapper, node);      // заменит элемент DOM  node на элемент DOM  wrapper 
            wrapper.appendChild(node);                        // и добавим внутрь wrapper наш контент  node        
            wrapper.setAttribute("nodeid", i)   
        })
        return dom;
    }

    // превратим DOM структуру в строку чтобы отправить на сервер
    serializeDOMToString(dom) {
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
                      
            <iframe src = {this.currentPage} frameBorder = "0"></iframe>
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