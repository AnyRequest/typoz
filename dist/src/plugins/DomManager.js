export default class DomManager {
    findElements(querySelector) {
        return document.querySelectorAll([].concat(querySelector).join(','));
    }
    findOne(select) {
        return document.querySelector(select);
    }
    createEl(name, content) {
        const el = document.createElement(name);
        el.innerHTML = content;
        return el;
    }
    trimInnerText(target) {
        return target.innerText.trim();
    }
    initializeTypozStyle(styles) {
        const typozDefaultStyle = this.createEl('style', styles);
        document.head.append(typozDefaultStyle);
    }
}
//# sourceMappingURL=DomManager.js.map