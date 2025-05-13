import { Injectable, NestMiddleware } from '@nestjs/common';

const Tokens = require('csrf');

const tokens = new Tokens();

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req, res, next) {
    const csrfSecret = req.cookies['csrf-secret'];

    if (!csrfSecret) {
      const newSecret = tokens.secretSync();
      const newToken = tokens.create(newSecret);
      res.cookie('csrf-secret', newSecret, { httpOnly: true, sameSite: 'lax' });
      res.cookie('csrf-token', newToken, { httpOnly: true, sameSite: 'lax' });
      req.csrfToken = newToken;
    } else {
      const newToken = tokens.create(csrfSecret);
      res.cookie('csrf-token', newToken, { httpOnly: true, sameSite: 'lax' });
      req.csrfToken = newToken;
    }

    next();
  }
}
