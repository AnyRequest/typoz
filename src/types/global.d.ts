export declare global {
  interface Options {
    onLoad: boolean;
    mode: {
      erase: boolean;
      realTyping: boolean;
      divide: boolean;
    };
    speed: {
      write: number;
      erase: number;
    };
    nodes: Element[];
    querySelector: string | string[];
  }
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
  };
}
