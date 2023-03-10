# esbuild-build-es5

Use the @swc/core transform to convert to ES5 for the esbuild plugin.

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

## Why?

esbuild does not support exporting in ES5 mode, so when our code needs to run on legacy devices, it has to be converted to ES5. This plugin uses @swc/core to convert non-ES5 syntax to ES5 before the build process, preserving the ES module format, allowing esbuild to maintain its tree shaking ability while also supporting source map generation.

> related issues: https://github.com/evanw/esbuild/issues/297


## Performance impact

The swc conversion is introduced, the conversion steps are added, and the construction time is increased to a certain extent.

| Project  | esbuild | esbuild + es5Plugin |
|----------|---------| --- |
| three.js | 50ms    | 180ms |

> For a test example you can clone the current project and run `make demo-three-esbuild` and `make demo-three-esbuild-es5` for comparison.


## Install

```bash
npm install esbuild-build-es5 -D
```

## Usage

```ts
import es5Plugin from 'esbuild-build-es5';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [es5Plugin()],
  target: ['es5'], // 🚀
});
```


## Options

```ts
const es5Plugin= (options: { filter?: RegExp; swc?: SwcOptions }) => Es5Plugin
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
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
