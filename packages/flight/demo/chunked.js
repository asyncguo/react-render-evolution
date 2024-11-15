const express = require('express');
const util = require('util')

const PORT = 3000
const app = express()

const textEncoder = new util.TextEncoder();

const content = [
  'hello',
  'world',
  "测试",
  "中文",
  '!!!'
]

app.get('/', (req, res) => {
  res.setHeader('Content-type', 'text/html; charset=utf-8');
  for (let i = 0; i < content.length; i++) {
    setTimeout(() => {
      const code = textEncoder.encode(
        `<div>${content[i]}</div>`
      )
      console.log(i, code);
      
      res.write(code)

      if (i === content.length - 1) {
        res.end()
      }
    }, (i + 1) * 1000);
  }
})

app
  .listen(PORT, () => {
    console.log(`Listening at ${PORT}...`);
  })
