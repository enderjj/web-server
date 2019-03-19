const http = require('http')
const path = require('path')
const conf = require('./config/defaultConfig')
const route = require('./helper/route')

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url) // 拼接 url
  
  route(req, res, filePath)
})

server.listen(conf.port, conf.hostname, () => {
  console.log(`Listening on http://${conf.hostname}:${conf.port}`)
})
