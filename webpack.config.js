const path = require('path');
const glob = require('glob');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  // mode: 'production',
  mode: 'development',
  entry: glob.sync('./src/assets/s3d/scripts/*.js').reduce((obj, el) => {
    obj[path.parse(el).name] = el;
    return obj;
  }, {}),
  output: {
    path: path.resolve('../dist', './assets/scripts/'),
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};

module.exports = config;
