import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as iconv from 'iconv-lite';

import { Entry } from './entry';

/*
 * Reading of ID3 tag based on http://id3.org/
 */

enum ID3HeaderOffsets {
  MAGIC = 0,
  MAJOR_VERSION = MAGIC + 3,
  MINOR_VERSION = MAGIC + 4,
  FLAGS = MAGIC + 5,
  SIZE = MAGIC + 6,
  END_OF_HEADER = 10
}

enum ID3HeaderFlags {
  Unsynchronisation = 128, // 10000000
  Extended = 64,           // 01000000
  Experimental = 32,       // 00100000
  Footer = 16,             // 00010000
  Others = 15              // 00001111
}

enum ID3ExtendedHeaderOffsets {
  SIZE = 0,
  NUMBER_OF_FLAGS = SIZE + 4,
  FLAGS = SIZE + 5
  // END_OF_HEADER depends on NUMBER_OF_FLAGS
}

enum ID3FrameOffsets {
  ID = 0,
  SIZE = ID + 4,
  FLAGS = ID + 8,
  END_OF_HEADER = 10
}

enum ID3FrameFlags {
  Grouping = 64,          // 00000000 01000000
  Compression = 8,        // 00000000 00001000
  Encryption = 4,         // 00000000 00000100
  Unsynchronisation = 2,  // 00000000 00000010
  DataLengthIndicator = 1 // 00000000 00000001
}

const hasFlag = (flags: number, flag: number) => (flags & flag) === flag;
const unsyncedLength = (input: number) =>
  (input & 127) + ((input & (127 << 8)) >> 1) + ((input & (127 << 16)) >> 1) + ((input & (127 << 24)) >>> 1);

const isID3 = (buffer: Buffer) => buffer.slice(ID3HeaderOffsets.MAGIC, ID3HeaderOffsets.MAGIC + 3).toString() === 'ID3';
const isID3v24 = (buffer: Buffer) => buffer.readIntBE(ID3HeaderOffsets.MAJOR_VERSION, 1) <= 4;
const getID3HeaderFlags = (buffer: Buffer) => {
  const flags = buffer.readIntBE(ID3HeaderOffsets.FLAGS, 1);
  return {
    unsynchronisation: hasFlag(flags, ID3HeaderFlags.Unsynchronisation),
    extendedHeader: hasFlag(flags, ID3HeaderFlags.Extended),
    experimental: hasFlag(flags, ID3HeaderFlags.Experimental),
    footer: hasFlag(flags, ID3HeaderFlags.Footer),
    others: (flags & ID3HeaderFlags.Others) !== 0
  };
};

const getID3FrameFlags = (buffer: Buffer) => {
  const flags = buffer.readInt16BE(ID3FrameOffsets.FLAGS);
  return {
    grouping: hasFlag(flags, ID3FrameFlags.Grouping),
    compression: hasFlag(flags, ID3FrameFlags.Compression),
    encryption: hasFlag(flags, ID3FrameFlags.Encryption),
    unsynchronisation: hasFlag(flags, ID3FrameFlags.Unsynchronisation),
    dataLengthIndicator: hasFlag(flags, ID3FrameFlags.DataLengthIndicator)
  };
};

const knownFrames = ['TCON', 'TRCK', 'TALB', 'TIT2', 'TDRC', 'TPE1'];

const getFrameData = (buffer: Buffer) => {
  const name = buffer.slice(ID3FrameOffsets.ID, ID3FrameOffsets.ID + 4).toString();
  const length = unsyncedLength(buffer.readInt32BE(ID3FrameOffsets.SIZE));
  let encoding: string;
  let data: string;
  if (knownFrames.indexOf(name) > -1) {
    switch (buffer.readInt8(ID3FrameOffsets.END_OF_HEADER)) {
      case 0:
        encoding = 'ISO-8859-1';
        break;
      case 1:
        encoding = 'UTF-16';
        break;
      case 2:
        encoding = 'UTF-16';
        break;
      case 3:
        encoding = 'UTF-8';
        break;
    }
    data =
      iconv.decode(buffer.slice(ID3FrameOffsets.END_OF_HEADER + 1, ID3FrameOffsets.END_OF_HEADER + length), encoding);
  }
  return {
    name,
    length,
    flags: getID3FrameFlags(buffer),
    data
  };
};

interface IFrameData {
  name: string;
  length: number;
  flags: {
    grouping: boolean;
    compression: boolean;
    encryption: boolean;
    unsynchronisation: boolean;
    dataLengthIndicator: boolean;
  };
  data: string;
}

export class Mp3Entry extends Entry {

  private frames: {[name: string]: IFrameData} = {};

  constructor(path: string, length: number = -1, displayName = '') {
    super(resolve(path), length, displayName);

    const buffer = readFileSync(this.path);
    if (!isID3(buffer) || !isID3v24(buffer)) {
      return;
    }
    const flags = getID3HeaderFlags(buffer);
    if (flags.others) {
      return;
    }
    const size = unsyncedLength(buffer.readInt32BE(ID3HeaderOffsets.SIZE));
    let startOfFrame = ID3HeaderOffsets.END_OF_HEADER;
    if (flags.extendedHeader) {
      const extendedHeaderBuffer = buffer.slice(ID3HeaderOffsets.END_OF_HEADER);
      const extendedHeaderSize = unsyncedLength(extendedHeaderBuffer.readInt32BE(ID3ExtendedHeaderOffsets.SIZE));
      startOfFrame += extendedHeaderSize;
    }

    while (startOfFrame < size) {
      const frameBuffer = buffer.slice(startOfFrame);
      const frame = getFrameData(frameBuffer);
      this.frames[frame.name] = frame;
      startOfFrame += ID3FrameOffsets.END_OF_HEADER + frame.length;
    }
  }

  private getFrameData(name: string) {
    return this.frames[name] ? this.frames[name].data : undefined;
  }

  get genre(): string {
    return this.getFrameData('TCON');
  }

  get track(): string {
    return this.getFrameData('TRCK');
  }

  get album(): string {
    return this.getFrameData('TALB');
  }

  get title(): string {
    return this.getFrameData('TIT2');
  }

  get year(): string {
    return this.getFrameData('TDRC');
  }

  get artist(): string {
    return this.getFrameData('TPE1');
  }

}
