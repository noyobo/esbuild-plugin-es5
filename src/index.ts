/**
 * A plugin for the esbuild
 * convert code to es5 use @swc/core
 */

import { Plugin } from 'esbuild';
import { transformFile, Options as SwcOptions } from '@swc/core';
import deepmerge from 'deepmerge';

export default function es5Plugin(options?: { filter?: RegExp; swc?: SwcOptions }) {
  return {
    name: 'es5',
    setup(build) {
      const buildOptions = build.initialOptions;

      const enableSourcemap = !!buildOptions.sourcemap;

      build.onLoad({ filter: options?.filter || /\.(js|ts|jsx|tsx)$/ }, async args => {
        const isTs = args.path.endsWith('.ts') || args.path.endsWith('.tsx');
        const isReact = args.path.endsWith('.jsx') || args.path.endsWith('.tsx');

        const transformOptions: SwcOptions = {
          jsc: { parser: { syntax: isTs ? 'typescript' : 'ecmascript', tsx: isReact }, target: 'es5' },
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

        const { code } = await transformFile(args.path, transformOptions);
        return { contents: code, loader: 'js' };
      });
    },
  } as Plugin;
}
