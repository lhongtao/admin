const path = require('path');
const {
  override,
  fixBabelImports,
  addLessLoader,
  disableEsLint,
  overrideDevServer,
  addWebpackAlias,
  addExternalBabelPlugins,
  addBabelPlugin, addBabelPlugins, useBabelRc
} = require("customize-cra");
const { getLessVars } = require('antd-theme-generator');
const resolve = (dir) => path.join(__dirname, dir);
const rewiredMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};

module.exports = override(
    // usual webpack plugin
    //按需加载
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    //配置antd主题
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: getLessVars(path.join(__dirname, './src/styles/vars.less')),
      // modifyVars: {'@primary-color': '#1DA57A'}
    }),
    disableEsLint(),
    addWebpackAlias({
      '@': resolve('src')
    }),
    // 关闭mapSource
    rewiredMap(),
    addBabelPlugin(["@babel/plugin-proposal-decorators", {"legacy": true}]),
    // ...addBabelPlugins(
    //  ["@babel/plugin-proposal-decorators", {"legacy": true}]
    // ),
    // useBabelRc(),
)
