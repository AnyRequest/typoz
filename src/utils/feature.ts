import { CursorStyle, HTMLTypozElement, Options, RecursivePartial } from '..';

export function recursiveConfigApply<T>(
  config: T,
  customConfigs: RecursivePartial<T>,
) {
  for (const key of Object.keys(customConfigs)) {
    if (
      typeof config[key] !== 'string' &&
      typeof config[key] !== 'number' &&
      typeof config[key] !== 'boolean' &&
      !(config[key] instanceof Array)
    ) {
      recursiveConfigApply(config[key], customConfigs[key]);
    } else {
      config[key] = customConfigs[key];
    }
  }
}

export function createEl(
  name: string,
  content: string,
  attribute?: { name: string; value: string },
) {
  const el = document.createElement(name);
  el.innerHTML = content;
  if (attribute) {
    el.setAttribute(attribute.name, attribute.value);
  }
  return el as HTMLTypozElement;
}

export function getCursorStyle(
  {
    blink,
    blinkTime = 1,
    content = '',
    color = '#56565656',
    dir = 'vertical',
    size = 1,
    distance = 0.1,
  }: CursorStyle,
  name?: string,
  isBuilder: boolean = false,
) {
  const direction = {
    vertical: `height: ${size}em; width: 0px; box-shadow: 0 0 0 ${
      size * 2.5
    }px ${color}; margin-left: ${distance}em;`,
    horizontal: `width: ${size * 0.6}em; height: calc(${
      size * 0.35
    }em * 0.35); /* margin-left: ${distance}em; */`,
  };
  // const cursorBlinkKeyframes = blink
  //   ? `@keyframes cursor-blink { 100% { opacity: 0; } }`
  //   : '';
  const cursorBlinkAnimation = blink
    ? `animation: cursor-blink ${blinkTime}s steps(2) infinite;`
    : 'animation: none';
  // prettier-ignore
  if (isBuilder) {
    // prettier-ignore
    return `[typoz-node-builder-name${name?`="${name}"`:''}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-node-builder-name${name?`="${name}"`:''}] { } [typoz-node-builder-name${name?`="${name}"`:''}]>[typoz-cursor]::after { box-sizing: content-box; display: inline-block; content: "${content}"; ${/* direction[dir] */`width: 0px; height: 1em; overflow: hidden; box-shadow: 0 0 0 ${size * 2.5}px ${color};`} margin-left: ${distance}em; margin-right: -${distance}em; line-height: inherit; ${''/* `background-color: ${color};` */} ${cursorBlinkAnimation} }${/* cursorBlinkKeyframes */''}`;
  } else {
    // prettier-ignore
    return `[typoz-name${name?`="${name}"`:''}]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; } [typoz-name${name?`="${name}"`:''}] { } [typoz-name${name?`="${name}"`:''}]::after { display: inline-block; content: "${content}"; ${direction[dir]} line-height: inherit; overflow: hidden; background-color: ${color}; ${cursorBlinkAnimation} }${/* cursorBlinkKeyframes */''}`;
  }
}

export function findElements(
  querySelector: string | string[],
): NodeListOf<HTMLTypozElement> {
  return document.querySelectorAll([].concat(querySelector).join(','));
}

export function findOne(select: string) {
  return document.querySelector(select) as HTMLTypozElement;
}

export function trimInnerText(target: HTMLTypozElement) {
  return target.innerText.trim();
}

export function initializeTypozStyle(styles: string) {
  if (document.head.querySelector('[typoz-styles]')) {
    const typozDefaultStyle = document.head.querySelector('[typoz-styles]');
    typozDefaultStyle.innerHTML += styles;
  } else {
    const typozDefaultStyle = createEl('style', styles);
    typozDefaultStyle.setAttribute('typoz-styles', '');
    document.head.append(typozDefaultStyle);
  }
}

export function copyConfig(config: Options) {
  return JSON.parse(JSON.stringify(config)) as Options;
}

export function createName() {
  return 'xyxyxx-xyyx-xxy-xxyyxxyxyyxy1xxyyxyxxx0xxyyy'.replace(
    /x|y/g,
    ($1) => {
      const w = 'abcdefghijklmnopqrstuvwxyz';
      const W = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const random = (src: string) =>
        src[Math.floor(Math.random() * src.length)];
      switch ($1) {
        case 'x':
          return random(w);
        case 'y':
          return random(W);
      }
    },
  );
}

export const deprecatedMessage = (since: string, instead?: string) => {
  if (instead) {
    console.warn(
      `this method is deprecated since version ${since}, please use "${instead}" method`,
    );
  } else {
    console.warn(`this method is deprecated since version ${since}.`);
  }
};
