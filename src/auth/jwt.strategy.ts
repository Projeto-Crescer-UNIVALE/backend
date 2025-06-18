import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';

import { TokenPayloadDto } from './dto/token-payload.dto';
import { REQUEST_TOKEN_PAYLOAD_KEY } from './auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    payload: TokenPayloadDto,
  ): Promise<TokenPayloadDto> {
    req[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    return payload;
  }
}
