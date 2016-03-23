import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { IType } from './type';
import { Entry } from './entry';

export class Playlist {

  private type: IType;

  private entries: Entry[] = [];

  constructor(type: IType) {
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
