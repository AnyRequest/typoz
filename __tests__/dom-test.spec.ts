/**
 * @jest-environment jsdom
 */

import Typex from '@/index';

describe('[DOM Test]', () => {
  it('dom initialize test]', () => {
    const el = document.createElement('div');
    expect(el).toBeDefined();
  });

  it('document body append test', () => {
    const checkText = '가시는 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서.';
    const documentSpyOn = jest.spyOn(document.body, 'append');
    const el = document.createElement('div');
    el.classList.add('typex');
    el.innerText = checkText;
    document.body.append(el);

    expect(documentSpyOn).toHaveBeenCalled();
    expect(el.innerText).toStrictEqual(checkText);
  });

  it('typex render test', () => {
    const typex = new Typex();
    const checkText = '가시는 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서.';

    const el = document.createElement('div');
    el.classList.add('typex');
    el.innerText = checkText;
    document.body.append(el);

    typex.initialize();
    typex.globalConfig();
    // typex.render();

    expect(typex.typingList.length).toStrictEqual(1);
  });

  it('dom parsed typings check', async () => {
    const typex = new Typex();
    const checkText = '가는말이 고와야 오는 말이 곱다';
    const el = document.createElement('div');
    el.classList.add('kimson');
    el.innerText = checkText;
    document.body.append(el);

    typex.initialize();
    typex.globalConfig({
      nodes: [{ select: '.kimson', words: ['안녕하세요', '데브킴슨입니다.'] }],
    });
    // typex.render();

    expect(typex.typingList[0].id).toStrictEqual(1);
    expect(typex.typingList[0].name).toStrictEqual(typex.typingList[0].name);
    expect(typex.typingList[0].element.typings[0][0][1]).toStrictEqual('가');
    expect(typex.typingList[0].element.typings[0][0][2]).toStrictEqual(
      undefined,
    );
    expect(typex.typingList[0].element.typings[0][2][0]).toStrictEqual('ㅁ');
    expect(typex.typingList[0].isStarted).toBeTruthy();
    expect(typex.typingList.length).toStrictEqual(1);
    expect(typex.typingList[0].element.typings.length).toStrictEqual(3);

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(typex.typingList[0].isStarted).toBeTruthy();
        resolve(true);
      }, 3000);
    });
  });

  afterEach(() => {
    [...document.body.children].forEach((child) => child.remove());
  });
});
