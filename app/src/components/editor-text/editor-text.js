export default class EditorText {
    constructor(element, virtualElement) {
        this.element = element;
        this.virtualElement = virtualElement;
        this.element.addEventListener("click", () => this.onClick());
        this.element.addEventListener("blur", () => this.onBlur());
        this.element.addEventListener("keypress", (e) => this.onKeypress(e));
        this.element.addEventListener("input", () => this.onTextEdit());    
        if(this.element.parentNode.nodeName === "A" || this.element.parentNode.nodeName === "BUTTON") {
            this.element.addEventListener("contextmenu", (e) => this.onCtxMenu(e));    
        }  

    }

    onClick() {
        this.element.contentEditable = "true";                 // ставим ему свойство редактирования
        this.element.focus();                                  // чтобы 2 раза не кликать
    }

    onBlur() {
        this.element.removeAttribute("contentEditable");
    }

    onKeypress(e) {
        if(e.keyCode === 13) {
            this.element.blur();
        }
    }

    onCtxMenu(e) {
        e.preventDefault();
        this.onClick();
    }

    onTextEdit() {
        this.virtualElement.innerHTML = this.element.innerHTML;
    }
}