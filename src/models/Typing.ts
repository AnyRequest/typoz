import type { HTMLTypexElement, Options } from '..';

export default class Typing {
  id: number;
  name: string;
  typingList: string[][][] = [];
  config: Options;
  before: number = 0;
  element: HTMLTypexElement;
  isStarted: boolean = false;
  injectStyle: string;
  order: number = 0;
  stop: boolean = false;
  play: (value: boolean) => void;

  constructor(
    id: number,
    el: HTMLTypexElement,
    config: Options,
    typings: string[][][],
  ) {
    this.id = id;
    this.element = el;
    this.name = this.createName();
    this.config = config;
    this.typingList = typings.filter(
      (_) => _ && _.length > 0 && _[0].length > 0 && _[0][0].length > 0,
    );

    this.setup();
  }

  private createName() {
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

  orderUp() {
    this.order = (this.order + 1) % this.typingList.length;
  }

  setup() {
    Object.freeze(this.typingList);
    this.element.innerHTML = '';
    this.element.dataset.typerId = '' + this.id;
    this.element.dataset.typerName = this.name;
    this.element.setAttribute('typer-processed', '');

    this.injectStyle = `[data-typer-name="${this.name}"]::before { content: '　'; display: inline-block; height: 1em; width: 1px; user-select: none; pointer-events: none; color: transparent; background-color: transparent; }`;
  }

  copyCurrent() {
    const current = JSON.parse(
      JSON.stringify(this.typingList[this.order]),
    ) as string[][];
    return current;
  }

  /* istanbul ignore next */
  resume() {
    // console.log('resume');
    this.play(true);
    this.stop = false;
  }

  /* istanbul ignore next */
  pause() {
    // console.log('pause');
    this.stop = true;
  }

  /* istanbul ignore next */
  run() {
    this.isStarted = true;
    this.render();
  }

  /* istanbul ignore next */
  clear() {
    this.isStarted = false;
  }

  /* istanbul ignore next */
  wait(time: number = 0) {
    return new Promise((resolve) => {
      if (this.stop) {
        this.play = resolve;
      } else {
        setTimeout(() => {
          resolve(true);
        }, time * 1000);
      }
    });
  }

  createEl(name: string, content: string) {
    const el = document.createElement(name);
    el.innerHTML = content;
    return el as HTMLTypexElement;
  }

  renderEraseDivide(eraseArray: string[][]) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
      const origin = [...this.element.innerText].map(
        (t) => this.createEl('span', t).outerHTML,
      );
      let pointer = origin.length;
      let word = eraseArray.pop();
      const eraseLoop = setInterval(async () => {
        if (this.stop) {
          await this.wait();
        }
        if (word.length === 0) {
          if (eraseArray.length === 0) {
            clearInterval(eraseLoop);
            this.element.innerText = '';
            resolve(true);
            return;
          } else {
            word = eraseArray.pop();
            pointer -= 1;
          }
          this.element.innerHTML = '';
          this.element.innerHTML = origin.slice(0, pointer).join('');
        } else {
          this.element.innerHTML = [
            ...origin.slice(0, pointer - 1),
            this.createEl('span', word.pop()).outerHTML,
          ].join('');
        }
      }, (1 / this.config.speed.erase) * 100);
    });
  }

  renderWriteDivide(writeArray: string[][]) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
      let pointer = 0;
      const change = [];
      let word = writeArray.shift();
      const writeLoop = setInterval(async () => {
        if (this.stop) {
          await this.wait();
        }
        if (word.length === 0) {
          if (writeArray.length === 0) {
            clearInterval(writeLoop);
            this.element.innerHTML = change.join('');
            resolve(true);
          } else {
            word = writeArray.shift();
            pointer += 1;
          }
        } else {
          change[pointer] = this.createEl('span', word.shift()).outerHTML;
          this.element.innerHTML = change.join('');
        }
      }, (1 / this.config.speed.write) * 100);
    });
  }

  renderErase(eraseArray: string[][]) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
      let pointer = this.element.innerText.length;
      const origin = this.element.innerText;
      let word = eraseArray.pop();
      const eraseLoop = setInterval(async () => {
        if (this.stop) {
          await this.wait();
        }
        if (word.length === 0) {
          if (eraseArray.length === 0) {
            clearInterval(eraseLoop);
            this.element.innerText = '';
            resolve(true);
            return;
          } else {
            word = eraseArray.pop();
            pointer -= 1;
          }
          this.element.innerText = origin.slice(0, pointer);
        } else {
          this.element.innerText = origin.slice(0, pointer - 1) + word.pop();
        }
      }, (1 / this.config.speed.erase) * 100);
    });
  }

  renderWrite(writeArray: string[][]) {
    /* istanbul ignore next */
    return new Promise((resolve) => {
      let pointer = 0;
      const change = [];
      let word = writeArray.shift();
      const writeLoop = setInterval(async () => {
        if (this.stop) {
          await this.wait();
        }
        if (word.length === 0) {
          if (writeArray.length === 0) {
            clearInterval(writeLoop);
            console.log('success wrote');
            this.element.innerText = change.join('');
            resolve(true);
          } else {
            word = writeArray.shift();
            pointer += 1;
          }
        } else {
          change[pointer] = word.shift();
          this.element.innerText = change.join('');
        }
      }, (1 / this.config.speed.write) * 100);
    });
  }

  /* istanbul ignore next */
  async render() {
    if (this.isStarted === false) return;
    this.orderUp();
    if (this.config.mode.divide) {
      await this.renderWriteDivide([...this.copyCurrent()]);
      await this.wait(this.config.delay);
      if (this.config.mode.erase) {
        await this.renderEraseDivide([...this.copyCurrent()]);
        await this.wait(this.config.delay);
      }
    } else {
      await this.renderWrite([...this.copyCurrent()]);
      await this.wait(this.config.delay);
      if (this.config.mode.erase) {
        await this.renderErase([...this.copyCurrent()]);
        await this.wait(this.config.delay);
      }
    }
    if (this.isStarted) {
      this.render();
    }
  }
}
