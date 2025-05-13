import { Injectable, NestMiddleware } from '@nestjs/common';

const Tokens = require('csrf');

const tokens = new Tokens();

@Injectable()
export class CsrfCheckMiddleware implements NestMiddleware {
  use(req, res, next) {
    const method = req.method.toUpperCase();

    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next();
    }

    const secret = req.cookies['csrf-secret'];
    const token = req.headers['x-csrf-token'];

    if (!secret || !token || !tokens.verify(secret, token)) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    next();
  }
}
