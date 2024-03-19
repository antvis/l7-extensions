import { defineConfig } from 'father';
import path from 'path';

export default defineConfig({
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
  umd: {
    name: 'L7.Leaflet',
    output: {
      path: 'dist',
      filename: 'l7-leaflet.min.js',
    },
    externals: {
      leaflet: 'L',
    },
  },
});
