import { ID3v2 } from 'id3v2';
import { resolve } from 'path';

import { Entry } from './entry';

export class Mp3Entry extends Entry {

  private readonly id3v2: ID3v2;

  constructor(path: string, id3v2?: ID3v2);
  constructor(path: string, length: number, displayName: string);
  constructor(path: string, ...rest: any[]) {
    super(resolve(path),
      rest.length >= 0 && typeof rest[0] === 'number' ? rest[0] : -1,
      rest.length >= 1 && typeof rest[1] === 'string' ? rest[1] : '');
    if (rest[0] instanceof ID3v2) {
      this.id3v2 = rest[0];
    } else {
      this.id3v2 = new ID3v2(this.path);
    }
  }

  get genre(): string {
    return this.id3v2.genre;
  }

  get track(): string {
    return this.id3v2.track;
  }

  get album(): string {
    return this.id3v2.album;
  }

  get title(): string {
    return this.id3v2.title;
  }

  get year(): string {
    return this.id3v2.year;
  }

  get artist(): string {
    return this.id3v2.artist;
  }

}
