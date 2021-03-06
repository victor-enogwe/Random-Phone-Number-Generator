const errorStub = {
  message: 'hello error',
  code: 'error code',
  stack: 'stack trace',
  response: {
    request: {
      headers: {
        'user-agent': 'Intel x86'
      },
      agent: {
        protocol: 'https'
      },
      res: {
        headers: {
          date: Date.now()
        },
        client: {
          servername: 'random_phone_number'
        }
      }
    }
  }
}

const serverError = (syscall, code) => ({ syscall, code })

module.exports = { errorStub, serverError }
