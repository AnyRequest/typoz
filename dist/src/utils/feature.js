export function recursiveConfigApply(config, customConfigs) {
    for (const key of Object.keys(customConfigs)) {
        if (typeof config[key] !== 'string' &&
            typeof config[key] !== 'number' &&
            typeof config[key] !== 'boolean' &&
            !(config[key] instanceof Array)) {
            recursiveConfigApply(config[key], customConfigs[key]);
        }
        else {
            config[key] = customConfigs[key];
        }
    }
}
export function createEl(name, content, attribute) {
    const el = document.createElement(name);
    el.innerHTML = content;
    if (attribute) {
        el.setAttribute(attribute.name, attribute.value);
    }
    return el;
}
export function getCursorStyle({ blink, blinkTime = 1, content = '', color = '#56565656', dir = 'vertical', size = 1, distance = 0.1, }, name, isBuilder = false) {
    const direction = {
        vertical: `height: ${size}em; width: calc(${size}em * 0.25);`,
        horizontal: ` width: ${size * 0.8}em; height: calc(${size * 0.8}em * 0.35);`,
    };
    const cursorBlinkKeyframes = blink
        ? `@keyframes cursor-blink { 100% { opacity: 0; } }`
        : '';
    const cursorBlinkAnimation = blink
        ? `animation: cursor-blink ${blinkTime}s steps(2) infinite;`
        : 'animation: none';
    // prettier-ignore
    if (isBuilder) {
        // prettier-ignore
        return `[typoz-name${name ? `="${name}"` : ''}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-name${name ? `="${name}"` : ''}] { } [typoz-name${name ? `="${name}"` : ''}]>[typoz-cursor]::after { box-sizing: content-box; display: inline-block; content: "${content}"; ${ /* direction[dir] */`width: 0px; height: 1em; border-left: 1px solid ${'#565656'};`} /* margin-left: ${distance}em; */ line-height: inherit; ${'' /* `background-color: ${color};` */} ${cursorBlinkAnimation} }${cursorBlinkKeyframes}`;
    }
    else {
        // prettier-ignore
        return `[typoz-name${name ? `="${name}"` : ''}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-name${name ? `="${name}"` : ''}] { } [typoz-name${name ? `="${name}"` : ''}]::after { display: inline-block; content: "${content}"; ${direction[dir]} /* margin-left: ${distance}em; */ line-height: inherit; background-color: ${color}; ${cursorBlinkAnimation} }${cursorBlinkKeyframes}`;
    }
}
export function findElements(querySelector) {
    return document.querySelectorAll([].concat(querySelector).join(','));
}
export function findOne(select) {
    return document.querySelector(select);
}
export function trimInnerText(target) {
    return target.innerText.trim();
}
export function initializeTypozStyle(styles) {
    if (document.head.querySelector('[typoz-styles]')) {
        const typozDefaultStyle = document.head.querySelector('[typoz-styles]');
        typozDefaultStyle.innerHTML += styles;
    }
    else {
        const typozDefaultStyle = createEl('style', styles);
        typozDefaultStyle.setAttribute('typoz-styles', '');
        document.head.append(typozDefaultStyle);
    }
}
export function copyConfig(config) {
    return JSON.parse(JSON.stringify(config));
}
export function createName() {
    return 'xyxyxx-xyyx-xxy-xxyyxxyxyyxy1xxyyxyxxx0xxyyy'.replace(/x|y/g, ($1) => {
        const w = 'abcdefghijklmnopqrstuvwxyz';
        const W = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const random = (src) => src[Math.floor(Math.random() * src.length)];
        switch ($1) {
            case 'x':
                return random(w);
            case 'y':
                return random(W);
        }
    });
}
//# sourceMappingURL=feature.js.map