const { authenticator } = require('otplib')
const crypto = require('crypto')
const errors = require('restify-errors')
const { promisify } = require('util')
const QRCode = require('qrcode')

const genQRCodeDataURI = promisify(QRCode.toDataURL)

authenticator.options = {
  crypto,
  step: 30, // 30-second OTP expiry
  window: 1, // Allow previous-step OTP
}

function checkMFAToken({ secret, token }) {
  return authenticator.verify({ secret, token })
}

async function checkMFAUser({ email, token }) {
  // We don't put this at the top of the
  // file as this would cause a circular
  // dependency
  const User = require('../db/User')

  // Or, we could encode MFA enablement in the JWT…
  const user = await User.findOne({ email })
  if (!user.requiresMFA) {
    return null
  }

  if (!token) {
    return new errors.InvalidCredentialsError(
      `Missing TOTP Token (user has MFA enabled)`
    )
  }

  if (!user.isMFATokenValid(token)) {
    return new errors.InvalidCredentialsError('Invalid TOTP Token')
  }

  return null
}

async function genMFAQRCodeURL({ identifier, secret }) {
  const uri = authenticator.keyuri(identifier, 'TopTunez', secret)
  try {
    return await genQRCodeDataURI(uri, { scale: 8 })
  } catch (err) {
    return `<QRCode Generation Error: ${err.message}>`
  }
}

function genMFASecret() {
  return authenticator.generateSecret()
}

module.exports = {
  checkMFAToken,
  checkMFAUser,
  genMFAQRCodeURL,
  genMFASecret,
}
