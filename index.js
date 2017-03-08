const Client = require('leveldb-mount/client')
const hyperquest = require('hyperquest')
const fs = require('fs')
const log = require('server-base-log')('fontello-server-sync')

const syncUrl = process.env.FONTELLO_WS_URL
const configPath = process.env.FONTELLO_CONFIG_PATH
const htmlPath = process.env.FONTELLO_HTML_PATH
const fontelloUrl = process.env.FONTELLO_HTTP_URL

if (!fontelloUrl) throw new Error('process.env.FONTELLO_HTTP_URL not specified')
if (!configPath) throw new Error('process.env.FONTELLO_CONFIG_PATH not specified')

if (syncUrl) {
  if (!htmlPath) throw new Error('process.env.FONTELLO_HTML_PATH not specified')
}

start()

function start () {
  hyperquest(`${fontelloUrl}/ping`, (err, res) => {
    if (err || res.statusCode !== 200) return setTimeout(start, 1000)
    uploadConfig()
  })
}

function uploadConfig () {
  sync()
  fs.stat(configPath, (err) => {
    if (!err) {
      log.info('uploading config.json')
      fs.readFile(configPath, 'utf8', (err, config) => {
        if (err) throw err
        const post = hyperquest.post(`${fontelloUrl}/upload/config.json`)
        post.on('error', log.error)
        post.write(config)
        post.end()
      })
    }
  })
}

function sync () {
  if (!syncUrl) return
  log.info('syncing')
  const client = Client({ url: syncUrl, retryTimeout: 1000 })
  client.emitter.subscribe((key, type) => {
    if (key === 'lasthash') {
      client.db.get('lasthash', (_, hash) => {
        syncLastHash(client, hash)
      })
    }
  })
}

function syncLastHash (client, hash) {
  if (!hash) return
  log.info(`syncing hash ${hash}`)
  client.db.get(`!${hash}!/fontello/config.json`, (_, value) => {
    value = new Buffer(value.data).toString()
    persistConfig(value)
    persistHtml(hash, value)
  })
}

function persistConfig (value) {
  fs.writeFile(configPath, value, (err) => {
    if (err) throw err
    log.info('saved config')
  })
}

function persistHtml (hash, value) {
  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) throw err
    const text = html.replace(/[a-z0-9]{40}(\/fontello)/g, `${hash}$1`)
    log.debug(`replace text ${text}`)
    fs.writeFile(htmlPath, text, (err) => {
      if (err) throw err
      log.info(`saved html using hash ${hash}`)
    })
  })
}
