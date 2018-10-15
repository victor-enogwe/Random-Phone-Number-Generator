const glob = require('glob')
const path = require('path')
const sandbox = require('sinon').createSandbox()
const { server, onError } = require('../../app')
const logger = require('../../logs')

const specFiles = glob.sync('*.spec.js', {
  cwd: path.resolve(__dirname), matchBase: true, ignore: ['helpers/**']
})

before(() => {
  server.listen(3000)
  sandbox.spy(logger, 'info')
  sandbox.spy(logger, 'error')
})

after(() => {
  server.close()
  sandbox.restore()
})

specFiles.map(file => require(`./${file}`))
