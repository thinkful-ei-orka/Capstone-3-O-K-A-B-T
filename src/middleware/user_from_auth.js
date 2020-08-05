const { JsonWebTokenError } = require('jsonwebtoken');
const AuthService = require('../auth/auth-service');

async function userFromAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken = authToken.slice(7, authToken.length);

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    const user = await AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    );

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      req.user = { user_id: null };
    next();
  }
}

module.exports = {
  userFromAuth,
};
