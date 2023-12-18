/**
 * @jest-environment jsdom
 */

import Typoz from '@/index';

const typoz = new Typoz();

describe('[DOM Test]', () => {
  it('dom initialize test]', () => {
    const el = document.createElement('div');
    expect(el).toBeDefined();
  });

  it('document body append test', () => {
    const checkText = '가시는 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서.';
    const documentSpyOn = jest.spyOn(document.body, 'append');
    const el = document.createElement('div');
    el.classList.add('typoz');
    el.innerText = checkText;
    document.body.append(el);

    expect(documentSpyOn).toHaveBeenCalled();
    expect(el.innerText).toStrictEqual(checkText);
  });

  it('typoz render test', () => {
    const checkText = '가시는 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서.';

    const el = document.createElement('div');
    el.classList.add('typoz');
    el.innerText = checkText;
    document.body.append(el);

    typoz.initialize();
    typoz.globalConfig();

    expect(typoz.typeNodes.length).toStrictEqual(1);
  });

  it('dom parsed typings check', async () => {
    const checkText = '가는말이 고와야 오는 말이 곱다';
    const el = document.createElement('div');
    el.classList.add('kimson');
    el.innerText = checkText;
    document.body.append(el);

    typoz.initialize();
    typoz.globalConfig({
      nodes: [{ select: '.kimson', words: ['안녕하세요', '데브킴슨입니다.'] }],
    });

    expect(typoz.typeNodes[0].id).toStrictEqual(1);
    expect(typoz.typeNodes[0].name).toStrictEqual(typoz.typeNodes[0].name);
    expect(typoz.typeNodes[0].typingList[0][0][1]).toStrictEqual('가');
    expect(typoz.typeNodes[0].typingList[0][0][2]).toStrictEqual(undefined);
    expect(typoz.typeNodes[0].typingList[0][2][0]).toStrictEqual('ㅁ');
    expect(typoz.typeNodes[0].isStarted).toBeTruthy();
    expect(typoz.typeNodes.length).toStrictEqual(1);
    expect(typoz.typeNodes[0].typingList.length).toStrictEqual(3);
    expect(typoz.typeNodes[0].element.typings.length).toStrictEqual(3);

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(typoz.typeNodes[0].isStarted).toBeTruthy();
        resolve(true);
      }, 3000);
    });
  });

  it('each nodes config', () => {
    const checkText = '가는말이 고와야 오는 말이 곱다';
    const el = document.createElement('div');
    el.classList.add('kimson');
    el.innerText = checkText;
    document.body.append(el);

    typoz.initialize();
    typoz.globalConfig({
      nodes: [
        {
          select: '.kimson',
          words: ['안녕하세요', '데브킴슨입니다.'],
          config: {
            mode: {
              erase: false,
            },
          },
        },
      ],
    });

    expect(typoz.config.mode.erase).toBeTruthy();
    expect(typoz.typeNodes[0].config.mode.erase).toBeFalsy();
  });

  afterEach(() => {
    [...document.body.children].forEach((child) => child.remove());
    typoz.destroy();
    typoz.initialize();
  });
});
