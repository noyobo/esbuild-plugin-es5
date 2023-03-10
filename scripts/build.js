const minimist = require('minimist');
const esbuild = require('esbuild');
const path = require('path');
const es5Plugin = require('../lib').default;

const args = minimist(process.argv.slice(2));

const cwd = process.cwd();

const { outfile, minify = false, platform, bundle = false, globalName, sourcemap } = args;

const resolve = p => path.resolve(cwd, p);

const t = Date.now();
esbuild
  .build({
    entryPoints: args._.map(f => resolve(f)),
    bundle: bundle,
    minify: minify,
    outfile: resolve(outfile),
    platform: platform || 'browser',
    plugins: [es5Plugin()],
    target: ['es5'],
    globalName: globalName,
    sourcemap: sourcemap,
  })
  .then(() => {
    console.log('Build complete', Date.now() - t, 'ms');
  });
