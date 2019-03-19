const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const conf = require('../config/defaultConfig')

// 引入模板文件
const tplPath = path.join(__dirname, '../template/list.tpl')
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())

module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath)

    if (stats.isFile()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      fs.createReadStream(filePath).pipe(res) // 读取文件内容
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath) // 读取目录列表
      const dir = path.relative(conf.root, filePath) // 求当前路径相对于 process.cwd() 的相对路径

      const data = {
        title: path.basename(filePath),
        dir: dir? `/${dir}` : '',
        files
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(template(data))
    }
  } catch (ex) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${filePath} is not a directory or file`)
  }
}
