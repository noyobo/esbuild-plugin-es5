/**
 * A plugin for the esbuild
 * convert code to es5 use @swc/core
 */

import { OnLoadResult, Plugin } from 'esbuild';
import { transformFile, Options as SWCOptions } from '@swc/core';
import deepmerge from 'deepmerge';
import { convertError } from './convertError';

export default function es5Plugin(options?: { filter?: RegExp; swc?: SWCOptions }) {
  return {
    name: 'es5',
    setup(build) {
      const buildOptions = build.initialOptions;

      const enableSourcemap = !!buildOptions.sourcemap;

      build.onLoad({ filter: options?.filter || /\.([tj]sx?)$/ }, args => {
        const isTs = args.path.endsWith('.ts') || args.path.endsWith('.tsx');
        const isReact = args.path.endsWith('.jsx') || args.path.endsWith('.tsx');

        const transformOptions: SWCOptions = {
          jsc: {
            parser: { syntax: isTs ? 'typescript' : 'ecmascript', tsx: isReact },
            target: 'es5',
            /**
             * Use external helpers to avoid duplicate helpers in the output.
             * esbuild muse has alias `@swc/helpers`
             */
            externalHelpers: true,
          },
          module: { type: 'es6' },
          /**
           * Generate inline source maps to enable esbuild to properly handle sourcemaps.
           */
          sourceMaps: enableSourcemap ? 'inline' : false,
          isModule: true,
        };

        if (options?.swc) {
          deepmerge(transformOptions, options?.swc);
        }

        return new Promise<OnLoadResult>(resolve => {
          transformFile(args.path, transformOptions)
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
