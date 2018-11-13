const { expect } = require('../helpers')
const app = require('../../controllers/random_numbers')

describe('', async () => {
  const phoneNumbers = await Promise.all(
    [1, 2].map(() => app.run({ length: 10 }))
  )
  const savedNumbers = await app.retrieveAllPhoneNumbers()
  const allNumbers = phoneNumbers.reduce((a, b) => ([...a, ...b]))

  describe('Phone Numbers', () => {
    describe('- Create', () => {
      it('should generate an array of phone numbers', () => {
        expect(Array.isArray(phoneNumbers[0])).to.equal(true)
        expect(Array.isArray(phoneNumbers[1])).to.equal(true)
      })

      it('should generate 20 phone numbers', () => {
        expect(allNumbers.length).to.equal(20)
      })

      it('should generate unique phone numbers', () => {
        expect(Array.from(new Set(allNumbers)).length).to.equal(20)
      })

      it('should generate 10 digit phone numbers', () => {
        expect(allNumbers.every(number => number.length === 10)).to.equal(true)
      })
    })

    describe('- Save', () => {
      it('should return an array of phone numbers', () => {
        expect(Array.isArray(savedNumbers)).to.equal(true)
      })

      it('should return 20 phone numbers', () => {
        expect(savedNumbers.length).to.equal(20)
      })

      it('saved numbers should be identical to generated ones', () => {
        expect(savedNumbers).to.deep.equal(allNumbers)
      })
    })

    describe('- Valid Args', () => {
      const invalidDate = app.argsValidator.bind(app, { date: '10/11/2018' })
      const invalidLength = app.argsValidator.bind(app, { length: '10' })
      const invalidInterval = app.argsValidator.bind(app, { interval: '10' })
      it('should return false for invalid date arg', () => {
        expect(invalidDate).to.throw('invalid date')
      })

      it('should return false for invalid length arg', () => {
        expect(invalidLength).to.throw('invalid length')
      })

      it('should return false for invalid interval arg', () => {
        expect(invalidInterval).to.throw('invalid interval')
      })
    })
  })
})
