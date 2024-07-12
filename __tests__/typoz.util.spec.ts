import Typoz, { Util } from '@/index';
import { describe, expect, it } from 'vitest';

describe('Typoz Util Test', () => {
  it('[Typoz Util] test --- josa el rl', () => {
    const typoz = new Typoz();

    expect(typoz.util.josa('안녕', Util.Josa.ElRl)).toStrictEqual('안녕을');
    expect(typoz.util.josa('이나', Util.Josa.ElRl)).toStrictEqual('이나를');
  });

  it('[Typoz Util] test --- josa ei ga', () => {
    const typoz = new Typoz();

    expect(typoz.util.josa('만두', Util.Josa.EiGa)).toStrictEqual('만두가');
    expect(typoz.util.josa('배럴', Util.Josa.EiGa)).toStrictEqual('배럴이');
  });

  it('[Typoz Util] test --- josa en nn', () => {
    const typoz = new Typoz();

    expect(typoz.util.josa('만두', Util.Josa.EnNn)).toStrictEqual('만두는');
    expect(typoz.util.josa('배럴', Util.Josa.EnNn)).toStrictEqual('배럴은');
  });

  it('[Typoz Util] test --- josas gwa wa', () => {
    const typoz = new Typoz();

    expect(
      typoz.util.josas(['만두', '청포도', '종이', '교련'], Util.Josa.GwaWa),
    ).toStrictEqual('만두와 청포도와 종이와 교련');
    expect(
      typoz.util.josas(['배럴', '청포도', '가면', '나무'], Util.Josa.GwaWa),
    ).toStrictEqual('배럴과 청포도와 가면과 나무');
  });
});
