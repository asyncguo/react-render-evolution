import express from 'express'
import * as React from 'react';
import { renderToString, renderToPipeableStream } from 'react-dom/server'
import App from './src/App'
import AppStream from './src/AppStream'
import {API_DELAY, ABORT_DELAY, JS_BUNDLE_DELAY} from './delays';

const app = express()

app.use((req, res, next) => {
    console.log('req.url => ', req.url);
    
    if (req.url.endsWith('.js')) {
      // Artificially delay serving JS
      // to demonstrate streaming HTML.
      setTimeout(next, JS_BUNDLE_DELAY);
    } else {
      next();
    }
});

app.get('/', (req, res) => {
     res.send(
        `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div>
    <a href="/renderToString">renderToString</a>
    <a href="/renderToPipeableStream">renderToPipeableStream</a>
  </div>
</body>
</html>
        `
    );
})

app.get('/renderToString', async (req, res) => {
    const data = await getServerData();
    const contentString = renderToString(<App data={data} />)

     res.send(
        `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
        <link rel="stylesheet" href="/main.css" />
    </head>
    <body>
        <div id="root">${contentString}</div>

        <script>
          window.__INIT_DATA__ = ${JSON.stringify({data})}
        </script>
        <script src="/main.js"></script>
    </body>
</html>
        `
    );
})

app.get('/renderToPipeableStream', async (req, res) => {
  const data = await getServerData();
  const { 
    // pipe 将 HTML 输出到提供的可写 Node.js 流中。
    //  1. 如果要启用流，请在 onShellReady 中调用 pipe 
    //  2. 如果要使用爬虫和静态生成，请在 onAllReady 中调用 pipe 
    pipe,
    // abort 可以让你放弃服务器渲染，在客户端渲染其余部分。
    abort
  } = renderToPipeableStream(<AppStream data={data} />, {
    // 如果指定，该字符串将被置于内嵌的 `<script>` 标记中
	  bootstrapScriptContent: 'console.log("🖨️ ======bootstrapScriptContent======")',
    // js 外链，格式为：  <script src="/main.js">
    bootstrapScripts: ['/main.js'],
    // 与 bootstrapScripts 类似，格式为： <script type="module">
    bootstrapModules: ["/bootstrapModules.js"],
    // React 为 useId 生成的 ID 使用的字符串前缀。当在同一页面上使用多个根时，可用于避免冲突。必须与传递给 hydrateRoot 的前缀相同
    // identifierPrefix: 'mainRoot',
    // 块中的字节数 默认值： DEFAULT_PROGRESSIVE_CHUNK_SIZE = 500 * 1024 / 8 * .8 * 0.5 / 2 = 12800
    // 每 500 毫秒约 12.5kb 内容
    // @link https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225
    // progressiveChunkSize: 12800,

    // 「初始 shell」渲染完成后立即触发的回调
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    },
    // 如果在渲染「初始 shell」时出现错误，会触发一个回调。它接收错误作为参数。
    // 由于还没有从数据流中输出字节，所以 onShellReady 和 onAllReady 都不会被调用，因此可以输出一个后备 HTML shell。
    onShellError(error) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/html');
      res.send('<h1>服务端渲染出错了～</h1>'); 
    },
    // 当服务器出错时，无论是否可恢复，都会触发一个回调。默认情况下，它只调用 console.error 。 
    // 如果要覆盖它以记录崩溃报告，请确保仍调用 console.error 。您还可以使用它来调整发出 shell 之前的状态代码。
    onError(error, errorInfo) {},
    // 当所有渲染（包括 shell 和所有附加内容）完成时触发的回调。对于爬虫和静态生成，可以用它代替 onShellReady 。
    // 如果在这里开始流式传输，就不会有任何渐进式加载。流将包含最终的 HTML。
    onAllReady() {
      console.log("🖨️ ======onAllReady======")
    },
  });
})

app.use(express.static('public'));
app.use(express.static('static'));

app.listen(3018, () => console.log('listening on port 3018!'))

function getServerData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                type: 'render-to-string',
                module: 'MainContent'
            })
        }, 1000);
    })
}
