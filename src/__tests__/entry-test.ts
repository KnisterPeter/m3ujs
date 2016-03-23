import { assert } from 'chai';
import { Entry } from '../entry';

describe('An entry', () => {
  it('should contain a path', () => {
    const path = './file.mp3';
    assert.equal(new Entry(path).path, path);
  });

  it('length defaults to -1', () => {
    assert.equal(new Entry('./file.mp3').length, -1);
  });

  it('may contain a length', () => {
    assert.equal(new Entry('./file.mp3', 10).length, 10);
  });

  it('displayName defaults to empty string', () => {
    assert.equal(new Entry('./file.mp3').displayName, '');
  });

  it('may contain a displayName', () => {
    assert.equal(new Entry('./file.mp3', -1, 'dn').displayName, 'dn');
  });
});
