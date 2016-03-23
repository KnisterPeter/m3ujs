import { assert } from 'chai';
import { IType, M3U, EXTM3U } from '../type';
import { Entry } from '../entry';

describe('A type', () => {
  let type: IType;

  describe('created as m3u', () => {

    beforeEach(() => {
      type = M3U;
    });

    it('should write all given entries', () => {
      const entries = [
        new Entry('a'),
        new Entry('b')
      ];

      assert.equal(type.write('./list.m3u', entries), 'a\nb\n');
    });
  });

  describe('created as extm3u', () => {

    beforeEach(() => {
      type = EXTM3U;
    });

    it('should write all given entries', () => {
      const entries = [
        new Entry('a'),
        new Entry('b', 10, 'abc')
      ];

      assert.equal(type.write('list', entries), '#EXTM3U\n#EXTINF:-1,\na\n#EXTINF:10,abc\nb\n');
    });
  });
});
