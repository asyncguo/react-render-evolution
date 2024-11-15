const register = require("react-server-dom-webpack/node-register")
register()
const babelRegister = require('@babel/register');

babelRegister({
  ignore: [/[\\\/](build|public|node_modules)[\\\/]/],
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {runtime: 'automatic'}]
  ],
  plugins: ['@babel/transform-modules-commonjs'],
});

const path = require('path');
const {readFileSync} = require('fs');
const express = require('express')
const { renderToPipeableStream } = require('react-server-dom-webpack/server')
const React = require('react');
const ReactApp = require('./src/App.js').default

const app = express();
const PORT = 3019

app.get(
  '/',
  handleErrors(async (req, res) => {
    await waitForWebpack()

    const html = readFileSync(
      path.resolve(__dirname, './build/index.html'),
      'utf8'
    );

    res.send(html)
  })
)

async function renderReactTree(req, res) {
  await waitForWebpack();
  const version = JSON.parse(req.query.version);
  const manifest = readFileSync(
    path.resolve(__dirname, './build/react-client-manifest.json'),
    'utf8'
  );

  const moduleMap = JSON.parse(manifest);
  const {pipe} = renderToPipeableStream(
    React.createElement(ReactApp, {version}),
    moduleMap
  );
  pipe(res);
}

app.get('/react', async (req, res) => {  
  renderReactTree(req, res);
})

app.get('/todos', async (req, res) => {  
  setTimeout(() => {
    res.send([
      { type: 'React' },
      { type: 'Vue' },
      { type: 'Vite' },
      { type: 'Esbuild' },
    ])
  }, 1000);
})

app.use(express.static('build'));
app.use(express.static('public'));

app.listen(
  PORT, 
  () => {
    console.log(`Listening at ${PORT}...`);
  }
)

async function waitForWebpack() {
  console.log('Waiting for webpack', path.resolve(__dirname, './build/index.html'));
  
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, './build/index.html'));
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function handleErrors(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}