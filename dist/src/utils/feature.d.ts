import { CursorStyle, HTMLTypozElement, Options, RecursivePartial } from '../index.js';
export declare function recursiveConfigApply<T>(config: T, customConfigs: RecursivePartial<T>): void;
export declare function createEl(name: string, content: string, attribute?: {
    name: string;
    value: string;
}): HTMLTypozElement;
export declare function getCursorStyle({ blink, blinkTime, content, color, dir, size, distance, }: CursorStyle, name?: string, isBuilder?: boolean): string;
export declare function findElements(querySelector: string | string[]): NodeListOf<HTMLTypozElement>;
export declare function findOne(select: string): HTMLTypozElement;
export declare function trimInnerText(target: HTMLTypozElement): string;
export declare function initializeTypozStyle(styles: string): void;
export declare function copyConfig(config: Options): Options;
export declare function createName(): string;
export declare const deprecatedMessage: (since: string, instead?: string) => void;
