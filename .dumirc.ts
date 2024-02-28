import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'L7 G Plugin',
  favicons: [
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*rAi0RZC91bQAAAAAAAAAAAAADmJ7AQ/original',
  ],
  themeConfig: {
    name: 'L7 G Plugin',
    logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*QGswQZ2nlGkAAAAAAAAAAAAADmJ7AQ/original',
    socialLinks: {
      github: 'https://github.com/antvis/LarkMap',
    },
    nav: {
      mode: 'append',
      value: [
        {
          title: '周边生态',
          children: [
            {
              title: 'L7',
              link: 'https://l7.antv.antgroup.com',
            },
            {
              title: 'L7Plot',
              link: 'https://l7plot.antv.antgroup.com',
            },
            {
              title: 'L7Draw',
              link: 'https://l7draw.antv.vision',
            },
            {
              title: 'LocationInsight',
              link: 'https://locationinsight.antv.antgroup.com',
            },
            {
              title: 'L7Editor',
              link: 'https://l7editor.antv.antgroup.com',
            },
          ],
        },
      ],
    },
  },
  outputPath: 'docs-dist',
  base: '/l7-g-plugin',
  publicPath: '/l7-g-plugin/',
  scripts: [
    `
    window._AMapSecurityConfig = {
      securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
    }`,
    'https://webapi.amap.com/maps?v=2.0&key=6f025e700cbacbb0bb866712d20bb35c',
  ],
  mfsu: false,
});
