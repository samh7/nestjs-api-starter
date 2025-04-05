import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import environment from '#/common/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.Authentication

            ]),
            ignoreExpiration: false,
            secretOrKey: environment.JWT_ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {
        // console.log(payload)
        return payload;
    }
}