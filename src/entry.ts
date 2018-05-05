export class Entry {

  private readonly _path: string;

  private readonly _length: number;

  private readonly _displayName: string;

  constructor(path: string, length = -1, displayName = '') {
    this._path = path;
    this._length = length;
    this._displayName = displayName;
  }

  get path(): string {
    return this._path;
  }

  get length(): number {
    return this._length;
  }

  get displayName(): string {
    return this._displayName;
  }

}
