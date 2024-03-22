import { defineConfig } from 'father';
import path from 'path';

export default defineConfig({
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
  umd: {
    name: 'L7.GLayerReact',
    output: {
      path: 'dist',
      filename: 'l7-extension-g-layer-react.min.js',
    },
    externals: {
      '@antv/larkmap': 'LarkMap',
    },
  },
});
