const morgan = require('morgan')
const { logServiceError, logger } = require('../logs')
const uniqueRandomPhoneNumbers = require('../controllers/random_numbers')

/**
 * Http Request Logging Middlware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
function httpRequestLoggingMiddleware (req, res, next) {
  return morgan('combined', {
    immediate: true, stream: { write: msg => logger.info(msg.trim()) }
  })(req, res, next)
}

/**
 * 404 Error Middlware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
function errorFourZeroFourMiddleware (req, res, next) {
  const error = new Error('Route Does Not Exist')
  error.status = 404

  return next(error)
}

/**
 * Express Error Middleware
 *
 * @param {Object} error the error object
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the error in json
 */
function httpErrorMiddleware (error, req, res, next) {
  const { status = 500, message } = error
  error.response = {
    status,
    request: {
      ...req,
      path: req.path,
      agent: { protocol: req.protocol },
      res: {
        httpVersion: req.httpVersion,
        headers: { date: req._startTime },
        client: { servername: req.hostname }
      }
    }
  }

  logServiceError(error)

  return res.status(error.status).json({ status, error: message })
}

/**
 * Home Middleware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json response
 */
function homeMiddleware (req, res) {
  return res.status(200).json({ status: 'success', message: 'Phone numbers Api' })
}

/**
 * Transform Phone Numbers Data
 *
 * @param {Object} req the http request object
 * @param {String} req.query.sort sort in 'ASC' or 'DESC' order
 * @param {any} req.query.max must evaluate to boolean, max number
 * @param {any} req.query.min must evaluate to boolen, the min number
 * @param {any} req.query.count tmust evaluate to bboolean, count numbers
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json response
 */
function transformPhoneData (req, res) {
  const { data } = req.body
  const { sort, max, min, count } = req.query
  if (sort.toUpperCase() === 'DESC') data.numbers.sort((a, b) => a + b)
  if (sort.toUpperCase() === 'ASC') data.numbers.sort((a, b) => a - b)
  if (max) data.max = `0${Math.max(...data.numbers)}`
  if (min) data.min = `0${Math.min(...data.numbers)}`
  if (count) {
    if (req.method === 'POST') {
      data.count = uniqueRandomPhoneNumbers.totalNumberOfPhoneNumbers()
    } else {
      data.count = data.numbers.length
    }
  }

  return res.json({ status: 'success', data })
}

/**
 * Phone Numbers Middleware
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {String} req.query.length number of phone numbers to generate
 *
 * @returns {Promise} the promisified http response
 */
function phoneNumbersMiddleware (req, res, next) {
  const { length = 10 } = req.query
  return uniqueRandomPhoneNumbers.run({ length: length > 10 ? +length : 10 })
    .then(numbers => (req.body.data = { numbers }))
    .then(() => res.status(201))
    .then(() => next())
    .catch(error => next(error))
}

/**
 * Retrieve All Phone Numbers
 *
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json response
 */
function allPhoneNumbersMiddleware (req, res, next) {
  req.body.data = { numbers: uniqueRandomPhoneNumbers.retrieveAllPhoneNumbers() }
  res.status(200)

  return next()
}

module.exports = {
  homeMiddleware,
  phoneNumbersMiddleware,
  allPhoneNumbersMiddleware,
  transformPhoneData,
  errorFourZeroFourMiddleware,
  httpErrorMiddleware,
  httpRequestLoggingMiddleware
}
