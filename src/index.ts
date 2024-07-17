/**
 * A plugin for the esbuild
 * convert code to es5 use @swc/core
 */

import { OnLoadResult, Plugin } from 'esbuild';
import { transformFile as _transformFile, Options as SWCOptions } from '@swc/core';
import deepmerge from 'deepmerge';
import { convertError } from './convertError';

export function transformFile(file: string, options?: SWCOptions) {
  const isTs = file.endsWith('.ts') || file.endsWith('.tsx');
  const isReact = file.endsWith('.jsx') || file.endsWith('.tsx')
  let transformOptions: SWCOptions = {
    jsc: {
      parser: { syntax: isTs ? 'typescript' : 'ecmascript', tsx: isReact && isTs, jsx: isReact && !isTs },
      target: 'es5',
      /**
       * Use external helpers to avoid duplicate helpers in the output.
       * esbuild muse has alias `@swc/helpers`
       */
      externalHelpers: true,
    },
    module: { type: 'es6' },
    sourceFileName: file,
    isModule: true,
  };
  if (options) {
    transformOptions = deepmerge(transformOptions, options);
  }
  return _transformFile(file, transformOptions);
}

export function es5Plugin(options?: { filter?: RegExp; swc?: SWCOptions }) {
  return {
    name: 'es5',
    setup(build) {
      const buildOptions = build.initialOptions;

      const enableSourcemap = !!buildOptions.sourcemap;

      build.onLoad({ filter: options?.filter || /\.([tj]sx?|mjs)$/ }, args => {
        return new Promise<OnLoadResult>(resolve => {
          const opts = deepmerge<SWCOptions>(options?.swc || {}, {
            /**
             * Generate inline source maps to enable esbuild to properly handle sourcemaps.
             */
            sourceMaps: enableSourcemap ? 'inline' : false,
          });

          transformFile(args.path, opts)
            .then(({ code }) => {
              resolve({ contents: code, loader: 'js' });
            })
            .catch(error => {
              resolve({ pluginName: 'es5', errors: [convertError(error)] });
            });
        });
      });
    },
  } as Plugin;
}
