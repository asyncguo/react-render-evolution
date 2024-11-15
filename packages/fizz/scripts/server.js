const path = require('path');
const rimraf = require('rimraf');
const webpack = require('webpack');

rimraf.sync(path.resolve(__dirname, '../build'));
webpack(
  {
    mode:'development',
    target: 'node',
    entry: './server.js',       
    output: {                     
      filename: 'server.js',    
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
                ["@babel/preset-react", {"runtime": "automatic"}]
              ]
            }
          }
        }
      ]
    }
  },
  (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      process.exit(1);
    }
    const info = stats.toJson();
    if (stats.hasErrors()) {
      console.log('Finished running server webpack with errors.');
      info.errors.forEach(e => console.error(e));
      process.exit(1);
    } else {
      console.log('Finished running server webpack.');
    }
  }
);
