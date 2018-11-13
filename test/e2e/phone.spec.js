const { expect, app } = require('../helpers')

describe('/numbers', () => {
  describe('- Post', () => {
    it('should create 10 phone numbers', () => app.post('/numbers')
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.data.numbers.length).to.equal(10)
      }))

    it('should create 100 phone numbers', () => app.post('/numbers?length=100')
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.data.numbers.length).to.equal(100)
      }))

    it('should return max phone number', () => app.post('/numbers?max=true')
      .then((response) => {
        const { max, numbers } = response.body.data
        expect(response.status).to.equal(201)
        expect(`0${Math.max(...numbers)}`).to.equal(max)
      }))

    it('should return min phone number', () => app.post('/numbers?min=true')
      .then((response) => {
        const { min, numbers } = response.body.data
        expect(response.status).to.equal(201)
        expect(`0${Math.min(...numbers)}`).to.equal(min)
      }))

    it('should sort phone number(DESC)', () => app.post('/numbers?sort=DESC')
      .then((response) => {
        const { numbers } = response.body.data
        expect(response.status).to.equal(201)
        expect(numbers.sort((a, b) => (a - b))).to.equal(numbers)
      }))

    it('should sort phone number(ASC)', () => app.post('/numbers?sort=ASC')
      .then((response) => {
        const { numbers } = response.body.data
        expect(response.status).to.equal(201)
        expect(numbers.sort((a, b) => (a + b))).to.equal(numbers)
      }))

    it('should count phone numbers', () => app.post('/numbers?count=true')
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.data.count).to.equal(10)
        expect(response.body.data.totalCount).to.equal(140)
      }))
  })

  describe('- Get', () => {
    it('should get phone numbers', () => app.get('/numbers')
      .then((response) => {
        expect(response.status).to.equal(200)
        expect(Array.isArray(response.body.data.numbers)).to.equal(true)
      }))

    it('should get max phone number', () => app.get('/numbers?max=true')
      .then((response) => {
        const { max, numbers } = response.body.data
        expect(response.status).to.equal(200)
        expect(`0${Math.max(...numbers)}`).to.equal(max)
      }))

    it('should get min phone number', () => app.get('/numbers?min=true')
      .then((response) => {
        const { min, numbers } = response.body.data
        expect(response.status).to.equal(200)
        expect(`0${Math.min(...numbers)}`).to.equal(min)
      }))

    it('should sort phone number(DESC)', () => app.get('/numbers?sort=DESC')
      .then((response) => {
        const { numbers } = response.body.data
        expect(response.status).to.equal(200)
        expect(numbers.sort((a, b) => (a - b))).to.equal(numbers)
      }))

    it('should sort phone number(ASC)', () => app.get('/numbers?sort=ASC')
      .then((response) => {
        const { numbers } = response.body.data
        expect(response.status).to.equal(200)
        expect(numbers.sort((a, b) => (a + b))).to.equal(numbers)
      }))

    it('should count phone numbers', () => app.get('/numbers?count=true')
      .then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.data.count).to.equal(140)
      }))
  })
})
