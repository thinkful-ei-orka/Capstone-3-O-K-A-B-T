const { JsonWebTokenError } = require('jsonwebtoken');
const AuthService = require('../auth/auth-service');

async function userFromAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    req.user = { user_id: null, username: 'anonymous' };
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    if (!req.user) {
      const payload = AuthService.verifyJwt(bearerToken);
      const user = await AuthService.getUserWithUserName(
        req.app.get('db'),
        payload.sub,
      );
      if (!user) {
        req.user = { user_id: null, username: 'anonymous' };
      } else {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      req.user = { user_id: null, username: 'anonymous' };
    }
    next(error);
  }
}

module.exports = {
  userFromAuth,
};
