# fontello-server-sync

[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/fontello-server-sync.svg)](https://greenkeeper.io/)

Sync project with running [fontello-server](https://npm.im/fontello-server).

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![build status](https://api.travis-ci.org/JamesKyburz/fontello-server-sync.svg)](https://travis-ci.org/JamesKyburz/fontello-server-sync)
[![npm](https://img.shields.io/npm/v/fontello-server-sync.svg)](https://npmjs.org/package/fontello-server-sync)
[![downloads](https://img.shields.io/npm/dm/fontello-server-sync.svg)](https://npmjs.org/package/fontello-server-sync)

To sync the following environment variables need to be specified.

* `FONTELLO_HTTP_URL` needs to be specified for `fontello-server`
* `FONTELLO_CONFIG_PATH` is path to project's `config.json`

### `config.json`

If `config.json` exists it will be uploaded to `fontello-server`.

This file is also synced from `fontello-server`.

### `index.html`

To sync this file you need to specify the following environment variables.

* `FONTELLO_HTML_PATH` path to `index.html`
* `FONTELLO_WS_URL` url including user and password to fontello ws (repl).

# usage

```javascript
require('fontello-server-sync')
```

# license

MIT
