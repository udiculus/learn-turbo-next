import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { RefreshStrategy } from "./strategies/refresh-token.strategy";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./configs/jwt.config";
import refreshConfig from "./configs/refresh.config";
import googleOauthConfig from "./configs/google-oauth.config";
import { GoogleStrategy } from "./strategies/google.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "./guards/roles/roles.guard";

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // enabling JWT authentication guard for all routes in the application
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // enabling role-based authentication guard for routes requiring specific roles
    },
  ],
})
export class AuthModule {}
