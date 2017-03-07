const hyperquest = require('hyperquest')
const fs = require('fs')
const path = require('path')
const tape = require('tape')

process.env.FONTELLO_WS_URL = 'ws://user:pass@localhost:2016'
process.env.FONTELLO_HTTP_URL = 'http://localhost:2016'
process.env.FONTELLO_CONFIG_PATH = path.join(__dirname, 'config.json')
process.env.FONTELLO_HTML_PATH = path.join(__dirname, 'index.html')

const indexHtml = path.join(__dirname, 'index.html')

const html = fs.readFileSync(path.join(__dirname, 'index-before.html'))
fs.writeFileSync(indexHtml, html)

tape('index.html sync', (t) => {
  const expectedHtml = fs.readFileSync(path.join(__dirname, 'expected.html'), 'utf-8')
  fs.watchFile(indexHtml, () => {
    const actualHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
    t.equals(actualHtml, expectedHtml, 'saved html')
    fs.unwatchFile(indexHtml)
    t.end()
  })
  require('../')
})

tape('config.json upload', (t) => {
  const expectedcss = fs.readFileSync(path.join(__dirname, 'expected.css'), 'utf-8')
  const css = path.join(__dirname, 'fontello.css')
  const stream = fs.createWriteStream(css)
  hyperquest.get('http://localhost:2016/868e90c18a1b6f34b0cb3883d8569134daf43e08/fontello/css/fontello.css')
  .pipe(stream)
  .on('close', () => {
    const actualcss = fs.readFileSync(path.join(__dirname, 'fontello.css'), 'utf-8').replace(/\?\d+/g, '?23770471')
    t.equals(actualcss, expectedcss, 'saved css')
    t.end()
  })
})

tape('end', (t) => {
  setTimeout(() => process.exit(0))
  t.end()
})

