# m3ujs

[![GitHub license](https://img.shields.io/github/license/KnisterPeter/m3ujs.svg)]()
[![Travis](https://img.shields.io/travis/KnisterPeter/m3ujs.svg)](https://travis-ci.org/KnisterPeter/m3ujs)
[![Coveralls branch](https://img.shields.io/coveralls/KnisterPeter/m3ujs/master.svg)](https://coveralls.io/github/KnisterPeter/m3ujs)
[![npm](https://img.shields.io/npm/v/m3ujs.svg)](https://www.npmjs.com/package/m3ujs)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/KnisterPeter/m3ujs.svg)](https://greenkeeper.io/)

Create m3u files.

# Features

* Write relative or absolute m3u files
* Support m3u and extm3u format
* Add extm3u displayName based on id3 tag info

# Usage

## Installation
Install as npm package:

```sh
npm install m3ujs --save
```

Install latest development version:

```sh
npm install m3ujs@next --save
```

## API

```js
import { Playlist } from 'm3ujs/playlist';
import { Mp3Entry } from 'm3ujs/mp3-entry';
import { TypeEXTM3U } from 'm3ujs/type';

const playlist = new Playlist(new TypeEXTM3U(entry => {
  if (entry instanceof Mp3Entry) {
    return `${entry.artist} - ${entry.album} - ${entry.track} - ${entry.title}`;
  }
  return entry.displayName;
}));
playlist.add(new Mp3Entry('/path/to/test.mp3'));
playlist.write('/pat/to/playlist.m3u');
```
