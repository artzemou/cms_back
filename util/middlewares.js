const corsMiddleware = require('restify-cors-middleware')
const errors = require('restify-errors')
const jwtMiddleware = require('restify-jwt-community')

require('dotenv').config()

const { checkMFAUser } = require('../util/totp')
const User = require('../db/User')

const DEFAULT_CORS_OPTIONS = {
  allowHeaders: ['authorization', 'x-totp-token'],
  exposeHeaders: ['authorization', 'x-totp-token'],
  origins: [
    /^https?:\/\/localhost(?::\d+)?$/,
    // 'https://delicious-insights.com',
    // 'https://toptunez.dev',
    // 'https://toptunez-graphql.dev',
    'https://practical-bell-94a29d.netlify.com/',

  ],
  preflightMaxAge: 5,
}

function cors({
  allowHeaders,
  exposeHeaders,
  origins,
  preflightMaxAge,
} = DEFAULT_CORS_OPTIONS) {
  return corsMiddleware({
    allowHeaders,
    exposeHeaders,
    origins,
    preflightMaxAge,
  })
}

function jwt() {
  return jwtMiddleware({
    credentialsRequired: false,
    async isRevoked(_, { email }, done) {
      const revoked = await User.isTokenRevoked({ email })
      done(null, revoked)
    },
    secret: process.env.JWT_SECRET,
  })
}

function requireAuth({ role = null, roles = [] } = {}) {
  // Massage arguments
  role = String(role || '').trim()
  if (role && roles.length === 0) {
    roles = [role]
  }

  return function checkAuth(req, res, next) {
    if (!req.user) {
      return next(new errors.NotAuthorizedError())
    }

    const missingRoles = roles.filter(role => !req.user[role])

    if (missingRoles.length > 0) {
      return next(
        new errors.NotAuthorizedError(
          `Missing required roles on the user: ${missingRoles.join(', ')}`
        )
      )
    }

    next()
  }
}

function totpCheck({ totpHeader = 'X-TOTP-Token' } = {}) {
  return async function checkTOTP(req, res, next) {
    if (!req.user) {
      return next()
    }

    const token =
      req.headers[totpHeader] || req.headers[totpHeader.toLowerCase()]
    try {
      const check = await checkMFAUser({ email: req.user.email, token })
      next(check)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
}

module.exports = { cors, DEFAULT_CORS_OPTIONS, jwt, requireAuth, totpCheck }
