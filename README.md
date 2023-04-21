# esbuild-build-es5

Use the @swc/core transform to convert to ES5 for the esbuild plugin.

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]

## Features

- ✅ Support Tree Shaking
- ✅ Support Code sharing (eg: async generator function)
- ✅ Support Sourcemap
- ✅ Support custom swc options
- ✅ Support custom filter

## Why?

esbuild does not support exporting in ES5 mode, so when our code needs to run on older devices, 
it must be converted to ES5. This plugin uses @swc/core to convert non-ES5 syntax to ES5 before bundling.


## Performance impact

The swc conversion is introduced, the conversion steps are added, and the construction time is increased to a certain extent.

| Project  | esbuild | esbuild + es5Plugin |
|----------|---------| --- |
| three.js | 50ms    | 180ms |

> For a test example you can clone the current project and run `make demo-three-esbuild` and `make demo-three-esbuild-es5` for comparison.


## Install

```bash
npm install esbuild-plugin-es5 @swc/helpers -D
```

## Usage

```ts
import { es5Plugin } from 'esbuild-plugin-es5';
import path from 'path';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [es5Plugin()], // # 1. Use esbuild-plugin-es5
  target: ['es5'], // # 2. Set the target to es5
  alias: {
    // # 3. Set the alias to @swc/helpers
    '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
  }
});
```

> For a faster development experience, you can only use it in production mode.

## Options

```ts
const es5Plugin= (options: { filter?: RegExp; swc?: SWCOptions }) => Es5Plugin
```

SWC Options : https://swc.rs/docs/configuration/compilation


[build-img]:https://github.com/noyobo/esbuild-plugin-es5/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/noyobo/esbuild-plugin-es5/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/esbuild-plugin-es5
[downloads-url]:https://www.npmtrends.com/esbuild-plugin-es5
[npm-img]:https://img.shields.io/npm/v/esbuild-plugin-es5
[npm-url]:https://www.npmjs.com/package/esbuild-plugin-es5
[issues-img]:https://img.shields.io/github/issues/noyobo/esbuild-plugin-es5
[issues-url]:https://github.com/noyobo/esbuild-plugin-es5/issues
[codecov-img]:https://codecov.io/gh/noyobo/esbuild-plugin-es5/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/noyobo/esbuild-plugin-es5
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
