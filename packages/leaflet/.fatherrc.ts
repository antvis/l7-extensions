import { defineConfig } from 'father';
import path from 'path';

export default defineConfig({
  extends: path.resolve(__dirname, '../../.fatherrc.ts'),
  umd: {
    name: 'L7.Leaflet',
    externals: {
      leaflet: 'L',
    },
  },
});
