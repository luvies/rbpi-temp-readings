const path = require('path');

module.exports = {
  entry: {
    'readings-server': './src/index.ts',
  },
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'rbpi-readings-server.js',
    path: path.resolve(__dirname, 'dist')
  },
  stats: {
    warnings: false
  },
  node: {
    __dirname: false
  }
};
