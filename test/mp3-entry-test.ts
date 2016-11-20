import { assert } from 'chai';
import { ID3v2 } from 'id3v2';
import { join } from 'path';

import { Mp3Entry } from '../src/mp3-entry';

describe('An mp3 entry', () => {
  let entry: Mp3Entry;

  describe('given only a filename', () => {
    before(() => {
      entry = new Mp3Entry(join(__dirname, 'test.mp3'));
    });

    it('should contain id3 tag data', () => {
      assert.equal(entry.genre, 'genre');
      assert.equal(entry.track, 'track');
      assert.equal(entry.album, 'album-title');
      assert.equal(entry.title, 'title');
      assert.equal(entry.year, 'year');
      assert.equal(entry.artist, 'artist');
    });
  });

  describe('given a filename and a id3v2 tag', () => {
    before(() => {
      const file = join(__dirname, 'test.mp3');
      entry = new Mp3Entry(file, new ID3v2(file));
    });

    it('should contain id3 tag data', () => {
      assert.equal(entry.genre, 'genre');
      assert.equal(entry.track, 'track');
      assert.equal(entry.album, 'album-title');
      assert.equal(entry.title, 'title');
      assert.equal(entry.year, 'year');
      assert.equal(entry.artist, 'artist');
    });
  });
});
