import { assert } from 'chai';
import { join } from 'path';
import { Mp3Entry } from '../mp3-entry';

describe('An mp3 entry', () => {
  let entry: Mp3Entry;

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
