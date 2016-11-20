import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { Entry } from './entry';
import { Type } from './type';

export class Playlist {

  private type: Type;

  private entries: Entry[] = [];

  constructor(type: Type) {
    this.type = type;
  }

  public add(entry: Entry): void {
    this.entries.push(entry);
  }

  get length(): number {
    return this.entries.length;
  }

  /**
   * @param name A path to write the playlist at
   */
  public write(name: string, writer: (name: string, data: any) => void = writeFileSync): void {
    const path = resolve(name);
    writer(path, this.type.write(path, this.entries));
  }

}
