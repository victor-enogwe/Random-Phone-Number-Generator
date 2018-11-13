const fs = require('fs')
const glob = require('glob')
const moment = require('moment')
const path = require('path')

/**
 * Unique Random Phone Numbers Class
 *
 * @class UniqueRandomPhoneNumbers
 */
class UniqueRandomPhoneNumbers {
  /**
   *Creates an instance of UniqueRandomPhoneNumbers.
   * @memberof UniqueRandomPhoneNumbers
   */
  constructor () {
    const numValid = num => num && typeof num !== 'number'
    this.validators = {
      date: date => date && !moment(date, 'YYYY-MM-DD', true).isValid(),
      interval: numValid,
      length: numValid
    }
    this.dataPath = path.resolve(__dirname, '../data')
  }

  /**
   * Validate Arguments
   *
   * @param {object} args argument object
   * @returns {boolean} arguments validity
   * @memberof UniqueRandomPhoneNumbers
   */
  argsValidator (args) {
    return Object.keys(args).every((key) => {
      if (this.validators[key](args[key])) throw new TypeError(`invalid ${key}`)
    })
  }

  /**
   * Add Days to Date
   *
   * @param {number} param.interval interval in days
   * @param {string} param.interval date string format YYYYMMDD
   *
   * @returns {string} date string
   * @memberof UniqueRandomPhoneNumbers
   */
  addDaysToDate ({ interval, date }) {
    this.argsValidator({ interval, date })
    return moment(date).add(interval, 'd').format('YYYYMMDD').toString()
  }

  /**
   * Generate Phone Number
   *
   * @param {number} param.interval interval in days
   * @param {string} param.interval date string format YYYYMMDD
   *
   * @returns {number} the phone number
   * @memberof UniqueRandomPhoneNumbers
   */
  generatePhoneNumber ({ interval, date }) {
    this.argsValidator({ interval, date })
    return `07${this.addDaysToDate({ interval, date })}`
  }

  /**
   * Generate Phone Numbers
   *
   * @param {number} param.length number of phone numbers to be generated
   * @param {string} param.date date string format YYYYMMDD
   *
   * @returns {array} array of phone numbers
   * @memberof UniqueRandomPhoneNumbers
   */
  generatePhoneNumbers ({ length, date }) {
    this.argsValidator({ length, date })
    return Array.from({ length }, (_, interval) => interval)
      .map(interval => this.generatePhoneNumber({ interval, date }))
  }

  /**
   * Save Phone Numbers
   *
   * @param {array} param.numbers array of phone numbers
   *
   * @returns {Array} the phone numbers
   * @memberof UniqueRandomPhoneNumbers
   */
  savePhoneNumbers ({ numbers }) {
    const startDate = numbers[0].slice(2)
    const length = numbers.length
    const endDate = numbers[numbers.length - 1].slice(2)
    const now = moment().format('YYYYMMDD')
    if (!fs.existsSync(this.dataPath)) fs.mkdirSync(this.dataPath)
    const filename = `${this.dataPath}/${length}-${now}-${startDate}-${endDate}.txt`
    return new Promise((resolve, reject) => fs.writeFile(
      filename,
      numbers.join(','),
      'utf-8',
      error => error ? reject(error) : resolve(numbers)
    ))
  }

  /**
   * Retrieve File Paths
   *
   * @returns {array} file paths
   *
   * @memberof UniqueRandomPhoneNumbers
   */
  retrieveFilePaths () {
    return glob.sync('*.txt', { cwd: this.dataPath, matchBase: true, absolute: true })
  }

  /**
   * Retrieve Start Date
   *
   * @returns {string} date string with format YYYYMMDD
   * @memberof UniqueRandomPhoneNumbers
   */
  retrieveStartDate () {
    try {
      const date = this.retrieveFilePaths().slice(-1)[0]
        .match(/-\d+.txt/)[0].replace(/-|\.txt/g, '')
      return this.addDaysToDate({ interval: 1, date })
    } catch (error) {
      return Date.now()
    }
  }

  retrieveAllPhoneNumbers () {
    return this.retrieveFilePaths()
      .map(path => fs.readFileSync(path, 'utf8').split(','))
      .reduce((a, b) => ([...a, ...b]), [])
  }

  totalNumberOfPhoneNumbers () {
    return this.retrieveFilePaths()
      .map(path => +path.match(/\d+/)[0]).reduce((a, b) => (a + b))
  }

  /**
   * Run the generator
   *
   * @param {number} params.length the amount of phone numbers to generate
   *
   * @returns {Promise<number[]>} the generated numbers promise
   * @memberof UniqueRandomPhoneNumbers
   */
  run ({ length }) {
    return this.savePhoneNumbers({
      numbers: this.generatePhoneNumbers({
        length, date: this.retrieveStartDate()
      })
    })
  }
}

const uniqueRandomPhoneNumbers = new UniqueRandomPhoneNumbers()

module.exports = uniqueRandomPhoneNumbers
