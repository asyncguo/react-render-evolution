import App from './App.js'

export default function AppStream(props) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/main.css"></link>
        <title>My app</title>
      </head>
      <body>
        <App {...props} />
      </body>
    </html>
  );
}
