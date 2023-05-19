const minimist = require('minimist');
const esbuild = require('esbuild');
const path = require('path');
const { es5Plugin } = require('../lib');

const args = minimist(process.argv.slice(2));

const cwd = process.cwd();

const { outfile, minify = false, platform, bundle = false, globalName, sourcemap } = args;

const resolve = p => path.resolve(cwd, p);

esbuild
  .build({
    entryPoints: args._.map(f => resolve(f)),
    bundle: bundle,
    minify: minify,
    outfile: resolve(outfile),
    platform: platform || 'browser',
    plugins: [
      es5Plugin(),
      {
        name: 'duration',
        setup(build) {
          let t;
          build.onStart(() => {
            t = Date.now();
          });
          build.onEnd(() => {
            console.log('⚡ Done in', Date.now() - t, 'ms');
          });
        },
      },
    ],
    target: ['es5'],
    globalName: globalName,
    sourcemap: sourcemap,
  })
  .then(() => {
    console.log('Build finished');
  });
