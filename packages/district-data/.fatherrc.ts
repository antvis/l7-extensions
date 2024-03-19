import { defineConfig } from 'father';
import path from 'path';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
  esm: { output: 'dist/esm' },
  cjs: { output: 'dist/cjs' },
  umd: {
    output: {
      path: 'dist/umd',
      filename: 'district-data.min.js',
    },
    name: 'District',
  },
});
