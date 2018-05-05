import { relative, dirname } from 'path';
import { Entry } from './entry';

// the IType is for backward compatibility
export type IType = Type;
export interface Type {
  write(path: string, entries: Entry[]): string;
}

export class TypeM3U implements Type {

  public write(path: string|null, entries: Entry[]): string {
    const dir = path ? dirname(path) : undefined;
    return entries
      .map(entry => dir ? relative(dir, entry.path) : entry.path)
      .join('\n')
      + '\n';
  }

}

export type FormatFunction = (entry: Entry) => string;

export class TypeEXTM3U implements Type {

  private readonly formatFn: FormatFunction;

  constructor(formatFn: FormatFunction) {
    this.formatFn = formatFn;
  }

  public write(path: string, entries: Entry[]): string {
    const dir = path ? dirname(path) : undefined;
    // tslint:disable-next-line prefer-template
    return '#EXTM3U\n'
      + entries.map(entry =>
          `#EXTINF:${entry.length},${this.formatFn(entry)}\n${dir ? relative(dir, entry.path) : entry.path}`)
        .join('\n')
      + '\n';
  }

}

export const M3U = new TypeM3U();
export const EXTM3U = new TypeEXTM3U(entry => entry.displayName);
