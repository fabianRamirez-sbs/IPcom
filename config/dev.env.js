'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENDPOINT: '"https://frontend.recruit.ipcom.ai"',
  TOKEN: '"DIQsgcJdHVlw"',
})
