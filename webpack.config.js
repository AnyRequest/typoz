const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: '[name].min.js',
    library: ['typoz', '[name]'],
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // .js 에 한하여 babel-loader를 이용하여 transpiling
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/, // .ts 에 한하여 ts-loader를 이용하여 transpiling
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    modules: [path.join(__dirname, 'src'), 'node_modules'], // 모듈 위치
    extensions: ['.ts', '.js'],
  },
  mode: 'production',
};
