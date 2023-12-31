const path = require('path');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const tsConfigPath = path.join(__dirname, '..', '/tsconfig.json');
const srcDir = path.join(__dirname, '..', 'src', 'node');
const distDir = path.join(__dirname, '..', 'dist-node', 'server');

module.exports = {
  entry: path.join(srcDir, './index.ts'),
  target: 'node',
  output: {
    filename: 'index.js',
    path: distDir,
  },
  node: false,
  mode: 'production',
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
      }),
    ],
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve('ts-loader'),
        options: {
          configFile: tsConfigPath,
        },
      },
      { test: /\.css$/, loader: 'null-loader' },
      { test: /\.less$/, loader: 'null-loader' },
    ],
  },
  externals: [
    function (context, request, callback) {
      if (
        [
          'node-pty',
          'oniguruma',
          '@parcel/watcher',
          'nsfw',
          'spdlog',
          'vm2',
          'canvas',
          '@opensumi/vscode-ripgrep',
          'vertx',
          'keytar',
        ].indexOf(request) !== -1
      ) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
  ],
  resolveLoader: {
    modules: [path.join(__dirname, './node_modules')],
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    mainFields: ['loader', 'main'],
    moduleExtensions: ['-loader'],
  },
};
