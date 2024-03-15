import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'L7 Extension',
  favicons: [
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rAi0RZC91bQAAAAAAAAAAAAADmJ7AQ/original',
  ],
  themeConfig: {
    name: 'L7 Extension',
    logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QGswQZ2nlGkAAAAAAAAAAAAADmJ7AQ/original',
    socialLinks: {
      github: 'https://github.com/antvis/l7-g-plugin',
    },
  },
  outputPath: 'docs-dist',
  scripts: [
    `
    window._AMapSecurityConfig = {
      securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
    }`,
    'https://webapi.amap.com/maps?v=2.0&key=6f025e700cbacbb0bb866712d20bb35c',
  ],
  alias: {
    '@antv/l7-extension-g-layer': '/packages/g-layer/src',
  },
  mfsu: false,
});
