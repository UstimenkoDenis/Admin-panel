export default class DOMHelper {
    
    static parseStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    }

    static wrapTextNodes(dom) { //оборачивает все текстовые узлы
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
    
    static serializeDOMToString(dom) {  
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);        
    }

    static unwrapTextNodes(dom) {
        dom.body.querySelectorAll("text-editor").forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    }

    static wrapImages(dom) {
        dom.body.querySelectorAll('img').forEach((img, i) => {
            img.setAttribute('editableimgid', i)
        })
        return dom;
    }

    static unwrapImages(dom) {
        dom.body.querySelectorAll('[editableimgid]').forEach(img => {
            img.removeAttribute('editableimgid')
        })       
    }
}