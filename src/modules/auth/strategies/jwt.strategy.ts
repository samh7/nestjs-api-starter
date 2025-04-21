import environment from '#/common/environment';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: environment.JWT_ACCESS_TOKEN_SECRET,
        });
    }
    async validate(payload: any) {

        const user = payload.user;
        const dbUser = this.authService.status(user);
        if (!dbUser) {
            throw new UnauthorizedException("User not found.");
        }
        return user;
    }
}
