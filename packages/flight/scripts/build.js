const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactFlightWebpackPlugin = require('react-server-dom-webpack/plugin');

webpack({
  mode: 'development',
  entry: path.resolve(__dirname, '../src/client/bootstrap.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../build')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                "@babel/preset-react",
                {
                  "runtime": "automatic"
                }
              ]
            ]
          }
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new ReactFlightWebpackPlugin({
      isServer: false
    }),
  ]
}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(1);
  }
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.log('Finished running webpack with errors.');
    info.errors.forEach(e => console.error(e));
    process.exit(1);
  } else {
    console.log('Finished running webpack.');
  }
})
