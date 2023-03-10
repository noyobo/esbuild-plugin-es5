import esbuild from 'esbuild';
import * as path from 'path';
import * as fse from 'fs-extra';

import es5Plugin from '../src/index';

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

const createBuild = async (files: string[]) => {
  files = files.map(file => {
    return path.join(__dirname, file);
  });

  await emitHtml(files);
  const result = await esbuild.build({
    entryPoints: files,
    plugins: [es5Plugin()],
    write: false,
    bundle: true,
    sourcemap: 'linked',
    outbase: __dirname,
    outdir: 'dist',
    target: ['es5'],
    minify: true,
  });

  for (const file of result.outputFiles) {
    if (file.path.endsWith('.js')) {
      expect(file.text).toMatchSnapshot();
      writeFileSync(file.path, file.text);
    }
  }
};

describe('index', () => {
  describe('esbuild-plugin-es5', () => {
    it('basic', async () => {
      await createBuild(['./fixtures/basic/index.ts']);
    });

    it('should support react', function () {
      return createBuild(['./fixtures/react/index.tsx']);
    });
  });
});
