import esbuild, { BuildResult } from 'esbuild';
import * as path from 'path';
import * as fse from 'fs-extra';
import { Options as SWCOptions } from '@swc/core';
import { describe, it, expect } from 'vitest';

import { es5Plugin } from '../src/index.ts';

const writeFileSync = (file: string, data: string) => {
  fse.ensureFileSync(file);
  fse.writeFileSync(file, data);
};

const emitHtml = async (files: string[]) => {
  files.forEach(file => {
    let output = file.replace(path.extname(file), '.html');
    output = path.relative(__dirname, output);
    output = path.join(__dirname, '../dist', output);

    const html = `<!doctype html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport'
        content='width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'>
  <meta http-equiv='X-UA-Compatible' content='ie=edge'>
  <title>file</title>
  <link rel="stylesheet" href="./index.css">
</head>
<body>
  <script src="./index.js"></script>
</body>
</html>
`;
    fse.ensureFileSync(output);
    fse.writeFileSync(output, html);
  });
};

const createBuild = async (files: string[], swc?: SWCOptions) => {
  files = files.map(file => {
    return path.join(__dirname, file);
  });

  await emitHtml(files);
  const result = await esbuild
    .build({
      entryPoints: files,
      plugins: [es5Plugin({ swc })],
      write: false,
      bundle: false,
      sourcemap: 'linked',
      outbase: __dirname,
      outdir: 'dist',
      target: ['es5'],
      minify: false,
      // alias: {
      //   '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
      // },
    })
    .catch((error: BuildResult) => {
      expect(error.errors.length).toBe(1);
      expect(error.errors[0].text).toContain("Expected ',', got ';'");
    });

  if (result) {
    for (const file of result.outputFiles) {
      if (file.path.endsWith('.js')) {
        expect(file.text).toMatchSnapshot();
      }
      writeFileSync(file.path, file.text);
    }
  }
};

describe('index', () => {
  describe('esbuild-plugin-es5', () => {
    it('basic', async () => {
      await createBuild(['./fixtures/basic/index.ts']);
    });

    it('react', async () => {
      await createBuild(['./fixtures/react/index.tsx'], {
        module: {
          type: 'commonjs',
        },
      });
    });

    it('react-jsx', async () => {
      await createBuild(['./fixtures/react-jsx/index.jsx'], {
        module: {
          type: 'commonjs',
        },
      });
    });

    it('async', async () => {
      await createBuild(['./fixtures/async/index.ts']);
    });

    it('error', async () => {
      await createBuild(['./fixtures/error/index.ts']);
    });
  });
});
