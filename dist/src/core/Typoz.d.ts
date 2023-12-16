import Typing from '../models/Typing';
import type { HTMLTypozElement, Options, RecursivePartial } from '..';
export declare class Typoz {
    private readonly defaultConfig;
    private parser;
    private domManager;
    config: Options;
    typingList: Typing[];
    constructor();
    private recursiveConfigApply;
    initialize(): void;
    globalConfig(customConfigs?: RecursivePartial<Options>): void;
    convert(sentence: string): string[][];
    bulkConvert(sentences: string[]): string[][][];
    getConfigNodes(): HTMLTypozElement[];
    resume(): void;
    resume(name: string): void;
    pause(): void;
    pause(name: string): void;
    render(): void;
    render(element: HTMLTypozElement): void;
    render(elements: HTMLTypozElement[]): void;
}
