const winston = require('winston')
const path = require('path')

const options = {
  file: {
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: process.env === 'development' ? 'debug' : 'info',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
    silent: process.env.NODE_ENV === 'test',
    colorize: true,
    prettyPrint: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
}

winston.addColors({})

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'combined.log')
    }),
    new winston.transports.Console(options.console)
  ],
  exceptionHandlers: [
    new winston.transports.File({
      ...options.file,
      filename: path.join(__dirname, 'exceptions.log')
    })
  ],
  exitOnError: false
})

/**
 * Http Error
 * @typedef {Object} HttpError
 * @property {string} code - The error message
 * @property {string} message - The error code
 * @property {string} response - Http response
 */

/**
 * Service Error Handler
 *
 * @param {HttpError} error the error object
 *
 * @returns {Object} winston log info
 */
function logServiceError (error) {
  const { message, code } = error
  let logMsg = ''
  if (error.response) {
    const { status, request, request: { res } } = error.response
    const { method, path, agent: { protocol }, headers } = request
    const { httpVersion, headers: { date }, client: { servername } } = res
    const ua = headers ? headers['user-agent'] : 'Phone Api 1.0'
    logMsg = `::1 - - [${date}] "${method} ${path} HTTP/${httpVersion}" `
    logMsg += `${status} - "${message || ''} ${code || ''}" ${ua}"`
    logMsg += ` - "Random Phone Numbers (+${protocol}//${servername})`
  } else {
    const stack = process.env.NODE_ENV === 'development' ? error.stack : ''
    logMsg = `${error.message} ${error.code || stack}`
  }

  return logger.error(logMsg)
}


module.exports = { logger, logServiceError }
