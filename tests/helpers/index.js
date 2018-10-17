const sandbox = require('sinon').createSandbox()
const { server, onError } = require('../../../app')
const logger = require('../../../logs')
const stubs = require('./stubs')

module.exports = {
  sandbox,
  server,
  onError,
  logger,
  ...stubs
}
