import Typoz, { Util } from '@/index';
import { describe, expect, it } from 'vitest';

describe('Typoz Util Test', () => {
  /* 타이포즈 유틸 조사 테스트 */
  describe('[Util Test] josa, josaWith and josaAnd', () => {
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

    it('[Typoz Util] test --- josaWith gwa wa', () => {
      const typoz = new Typoz();

      expect(
        typoz.util.josaWith(
          ['만두', '청포도', '종이', '교련'],
          Util.Josa.GwaWa,
        ),
      ).toStrictEqual('만두와 청포도와 종이와 교련');
      expect(
        typoz.util.josaWith(
          ['배럴', '청포도', '가면', '나무'],
          Util.Josa.GwaWa,
        ),
      ).toStrictEqual('배럴과 청포도와 가면과 나무');
    });

    it('[Typoz Util] test --- josaAnd gwa wa', () => {
      const typoz = new Typoz();

      expect(
        typoz.util.josaAnd(['만두', '청포도', '종이', '교련'], Util.Josa.GwaWa),
      ).toStrictEqual('만두와 청포도와 종이, 그리고 교련');
      expect(
        typoz.util.josaAnd(['배럴', '청포도', '가면', '나무'], Util.Josa.GwaWa),
      ).toStrictEqual('배럴과 청포도와 가면, 그리고 나무');
    });

    it('[Typoz Util] test --- josaAnd gwa wa 2words', () => {
      const typoz = new Typoz();

      expect(
        typoz.util.josaAnd(['만두', '청포도'], Util.Josa.GwaWa),
      ).toStrictEqual('만두, 그리고 청포도');
      expect(
        typoz.util.josaAnd(['배럴', '청포도'], Util.Josa.GwaWa),
      ).toStrictEqual('배럴, 그리고 청포도');
    });
  });

  /* 타이포즈 유틸 한국어 검색 테스트 */

  describe('[Util Test] searchKorean', () => {
    it('[Typoz Util] test --- searchByOnset for korean : result 1', () => {
      const typoz = new Typoz();
      const founded = typoz.util.searchByOnset(
        ['라면', '꼰대', '마리아', '마리아디비', '저스티스'],
        'ㄹㅁ',
      );
      expect(founded.length).toStrictEqual(1);
    });

    it('[Typoz Util] test --- searchByOnset for korean : result 2', () => {
      const typoz = new Typoz();
      const founded = typoz.util.searchByOnset(
        ['라면', '꼰대', '마리아', '마리아디비', '저스티스'],
        'ㅁㄹㅇ',
      );
      expect(founded.length).toStrictEqual(2);
    });

    it('[Typoz Util] test --- searchByOnset for korean : result 0', () => {
      const typoz = new Typoz();
      const founded = typoz.util.searchByOnset(
        ['라면', '꼰대', '마리아', '마리아디비', '저스티스'],
        'ㅁㅈㅂ',
      );
      expect(founded.length).toStrictEqual(0);
    });

    it('[Typoz Util] test --- searchByOnset for korean : fail', () => {
      const typoz = new Typoz();
      const foundFeature = ({ withThrow }: { withThrow: boolean }) =>
        typoz.util.searchByOnset(
          ['라면', '꼰대', '마리아', '마리아디비', 'justice'],
          'ㅁㅈㅂ',
          {
            withThrow,
          },
        );
      expect(foundFeature.bind(this, { withThrow: true })).toThrow();
      expect(foundFeature.bind(this, { withThrow: true })).toThrowError(
        'word is not korean',
      );
      try {
        foundFeature({ withThrow: true });
      } catch (error: any) {
        expect(error.cause).toStrictEqual('word: justice');
      }
      expect(foundFeature({ withThrow: false })).toStrictEqual([]);
    });

    it('[Typoz Util] test --- searchByOnset for korean : result 3', () => {
      const typoz = new Typoz();
      const founded = typoz.util.searchByOnset(
        ['라면', '꼰대', '마리아', '마리아디비', 'justice'],
        'ㅁ',
      );
      expect(founded.length).toStrictEqual(3);
    });

    it('[Typoz Util] test --- verbToContinue', () => {
      const typoz = new Typoz();
      expect(typoz.util.verbToContinue('기르다')).toStrictEqual('길러');
      expect(typoz.util.verbToContinue('미치다')).toStrictEqual('미쳐');
      expect(typoz.util.verbToContinue('모르다')).toStrictEqual('몰라');
      expect(typoz.util.verbToContinue('다르다')).toStrictEqual('달라');
      expect(typoz.util.verbToContinue('돕다')).toStrictEqual('도와');
      expect(typoz.util.verbToContinue('졸다')).toStrictEqual('졸아');
      expect(typoz.util.verbToContinue('긋다')).toStrictEqual('그어');
      expect(typoz.util.verbToContinue('가누다')).toStrictEqual('가누어');
      expect(typoz.util.verbToContinue('받다')).toStrictEqual('받아');
      expect(typoz.util.verbToContinue('점치다')).toStrictEqual('점쳐');
      expect(typoz.util.verbToContinue('놀다')).toStrictEqual('놀아');
      expect(typoz.util.verbToContinue('괴다')).toStrictEqual('괴어');
      expect(typoz.util.verbToContinue('주무르다')).toStrictEqual('주물러');
      expect(typoz.util.verbToContinue('곱다')).toStrictEqual('고와');
      expect(typoz.util.verbToContinue('주문하다')).toStrictEqual('주문해');
      expect(typoz.util.verbToContinue('고심하다')).toStrictEqual('고심해');
    });

    it('[Typoz Util] test --- checkWrongSyntax for korean', () => {
      const typoz = new Typoz();
      // const founded = typoz.util.checkWrongSyntax('아버지가방에들어가셨다.');
      // expect(founded.length).toStrictEqual(3);
    });
  });
});
