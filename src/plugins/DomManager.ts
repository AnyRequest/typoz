import { HTMLTypozElement } from '..';
import type { Plugin } from './Plugin';

export default class DomManager implements Plugin {
  findElements(querySelector: string | string[]): NodeListOf<HTMLTypozElement> {
    return document.querySelectorAll([].concat(querySelector).join(','));
  }

  findOne(select: string) {
    return document.querySelector(select) as HTMLTypozElement;
  }

  createEl(name: string, content: string): HTMLTypozElement {
    const el = document.createElement(name);
    el.innerHTML = content;
    return el as HTMLTypozElement;
  }

  trimInnerText(target: HTMLTypozElement) {
    return target.innerText.trim();
  }

  initializeTypozStyle(styles: string) {
    const typozDefaultStyle = this.createEl('style', styles);
    document.head.append(typozDefaultStyle);
  }
}
