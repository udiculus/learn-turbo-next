import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigType } from "@nestjs/config";
import { AuthJwtPayload } from "../types/auth";
import { AuthService } from "../auth.service";
import refreshConfig from "../configs/refresh.config";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    console.log("refresh strategy", refreshTokenConfig);
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      secretOrKey: refreshTokenConfig.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const userId = payload.sub;
    console.log("refresh token", userId);
    return this.authService.validateRefreshToken(userId);
  }
}
