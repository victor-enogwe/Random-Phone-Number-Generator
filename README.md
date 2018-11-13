# Random-Phone-Number-Generator

[![Build Status](https://travis-ci.org/victor-enogwe/Random-Phone-Number-Generator.svg?branch=staging)](https://travis-ci.org/victor-enogwe/Random-Phone-Number-Generator)
[![Coverage Status](https://coveralls.io/repos/github/victor-enogwe/Random-Phone-Number-Generator/badge.svg?branch=staging)](https://coveralls.io/github/victor-enogwe/Random-Phone-Number-Generator?branch=staging)

An app to generate unique random phone numbers.

## Technologies

NodeJS, ExpressJS

## Requirements

The following software are required to run this app:

- NodeJS
- Node Package Manager (npm)

## Local Development

Start local development using the following steps:

- Clone the repository locally
- Run `npm install` to install node packages
- Run `npm start` to start up the application
- access the application via http at localhost:3000

## Testing

This application can be tested locally by running `npm test`

## Api Routes And Postman Collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/ebfdd61d0dbf85e5f94b)

- GET `/` API home
- `/numbers`
  
  create/get the saved numbers

  **query params**

  - `count` = true
  - `sort` = ASC or DESC
  - `min` = true
  - `max` = true

  **Create**

  - `POST`

    **query params**

    uses the numbers query params also

    - `length` = `number eg 10000`

  **Retrieve**

  uses the numbers query params also

  - `GET`

## How To Contribute

To contribute, fork this repository, make required changes and open a pull request.
