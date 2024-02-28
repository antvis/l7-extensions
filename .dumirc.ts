import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'l7-g-plugin',
  },
  resolve: {},
  scripts: [
    `
    window._AMapSecurityConfig = {
      securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
    }`,
    'https://webapi.amap.com/maps?v=2.0&key=6f025e700cbacbb0bb866712d20bb35c',
  ],
  mfsu: false,
});
