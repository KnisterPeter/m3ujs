import { assert } from 'chai';
import { join } from 'path';
import { Playlist } from '../src/playlist';
import { Entry } from '../src/entry';
import { Mp3Entry } from '../src/mp3-entry';
import { M3U, TypeEXTM3U } from '../src/type';

describe('The playlist', () => {
  let playlist: Playlist;

  describe('as m3u type', () => {
    beforeEach(() => {
      playlist = new Playlist(M3U);
    });

    it('should create an empty playlist during construction', () => {
      assert.equal(playlist.length, 0);
    });

    it('should contain an entry when adding something', () => {
      playlist.add(new Entry('file.mp3'));
      assert.equal(playlist.length, 1);
    });

    it('should write the playlist', () => {
      playlist.add(new Entry('one'));
      playlist.add(new Entry('two'));
      playlist.write('./name.m3u', (name: string, data: any) => {
        assert.equal(name, join(process.cwd(), './name.m3u'));
        assert.equal(data, 'one\ntwo\n');
      });
    });
  });

  describe('as custom extm3u type', () => {
    beforeEach(() => {
      playlist = new Playlist(new TypeEXTM3U(entry => {
        if (entry instanceof Mp3Entry) {
          return `${entry.artist} - ${entry.album} - ${entry.track} - ${entry.title}`;
        }
        return entry.displayName;
      }));
    });

    it('should write the playlist', () => {
      playlist.add(new Entry(join(__dirname, 'one')));
      playlist.add(new Mp3Entry(join(__dirname, 'test.mp3')));
      const absPath = join(__dirname, 'name.m3u');
      playlist.write(absPath, (name: string, data: any) => {
        assert.equal(name, absPath);
        assert.equal(data, '#EXTM3U\n#EXTINF:-1,\none\n#EXTINF:-1,artist - album-title - track - title\ntest.mp3\n');
      });
    });
  });
});
