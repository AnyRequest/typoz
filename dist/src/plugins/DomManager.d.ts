import { HTMLTypozElement } from '..';
import type { Plugin } from './Plugin';
export default class DomManager implements Plugin {
    findElements(querySelector: string | string[]): NodeListOf<HTMLTypozElement>;
    findOne(select: string): HTMLTypozElement;
    createEl(name: string, content: string): HTMLTypozElement;
    trimInnerText(target: HTMLTypozElement): string;
    initializeTypozStyle(styles: string): void;
}
