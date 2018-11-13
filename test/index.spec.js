const glob = require('glob')
const path = require('path')
const fs = require('fs')
const { sandbox, logger } = require('./helpers')

const specFiles = glob.sync('*.spec.js', {
  cwd: path.resolve(__dirname), matchBase: true, ignore: ['helpers/**']
})

before(() => {
  sandbox.spy(logger, 'info')
  sandbox.spy(logger, 'error')
})

after(() => {
  glob.sync(
    '*.txt',
    {
      cwd: path.resolve(__dirname, '../data'),
      matchBase: true,
      absolute: true
    }
  ).forEach(file => fs.unlinkSync(file))
  fs.rmdirSync(path.resolve(__dirname, '../data'))
  sandbox.restore()
})

specFiles.map(file => require(`./${file}`))
