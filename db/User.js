const emailRegex = require('email-regex')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { markFieldsAsPII } = require('mongoose-pii')

require('dotenv').config()

const { checkMFAToken, genMFAQRCodeURL, genMFASecret } = require('../util/totp')
const connection = require('./connection')

const JWT_EXPIRY = '30m'
const ROLES = ['admin']

const userSchema = new mongoose.Schema(
  {
    email: {
      index: true,
      match: emailRegex({ exact: true }),
      required: true,
      type: String,
      unique: true,
    },
    firstName: { type: String, required: true },
    jwtRevokedAt: Date,
    lastName: { type: String, required: true },
    mfaSecret: { type: String },
    password: { type: String, required: true },
    roles: { type: [{ type: String, enum: ROLES }], index: true },
  },
  {
    collation: { locale: 'en_US', strength: 1 },
    strict: 'throw',
    strictQuery: true,
    timestamps: true,
    useNestedStrict: true,
  }
)

userSchema.plugin(markFieldsAsPII, {
  fields: ['email', 'firstName', 'lastName'],
  key: process.env.MONGOOSE_PII_KEY,
  passwordFields: 'password',
})

userSchema.virtual('requiresMFA').get(function() {
  return this.mfaSecret != null
})
Object.assign(userSchema.statics, {
  async isTokenRevoked({ email }) {
    const user = await this.findOne({ email })
    return (
      !user || (user.jwtRevokedAt && user.jwtRevokedAt.getTime() <= Date.now())
    )
  },

  async logIn(email, password) {
    let user = await User.authenticate({
      email: email,
      password: password,
    })
    if (!user) {
      return { user }
    }

    const token = getTokenForUser(user)
    return { user, token }
  },

  async signUp({ email, firstName, lastName, password, roles }) {
    const user = await this.create({
      email,
      firstName,
      lastName,
      password,
      roles,
    })
    const token = getTokenForUser(user)
    return { user, token }
  },
})

Object.assign(userSchema.methods, {
  isMFATokenValid(token) {
    return this.requiresMFA && checkMFAToken({ secret: this.mfaSecret, token })
  },

  async toggleMFA(enabled) {
    let mfaSecret = this.mfaSecret

    if (enabled !== this.requiresMFA) {
      mfaSecret = enabled ? genMFASecret() : null
      await this.update({ mfaSecret })
    }

    const result = { enabled }

    if (enabled) {
      result.url = await genMFAQRCodeURL({
        identifier: this.firstName,
        secret: mfaSecret,
      })
    }

    return result
  },
})

const User = connection.model('User', userSchema)

function getTokenForUser({ email, roles }) {
  const payload = roles.reduce((acc, role) => ({ ...acc, [role]: true }), {
    email,
  })
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  })
}

module.exports = User
