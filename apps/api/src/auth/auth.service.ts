import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { hash, verify } from "argon2";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { AuthJwtPayload } from "./types/auth";
import { JwtService } from "@nestjs/jwt";
import refreshConfig from "./configs/refresh.config";
import { ConfigType } from "@nestjs/config";
import { type Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(data: CreateUserDTO) {
    const user = await this.userService.findByEmail(data.email);

    if (user) throw new ConflictException("User already exists!");
    return this.userService.create(data);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException("User not found!");

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) throw new UnauthorizedException("Invalid password!");

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }

  async login({
    userId,
    role,
    name,
  }: {
    userId: number;
    role: Role;
    name?: string;
  }) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      name,
      role,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException("User not found!");

    return {
      id: user.id,
      role: user.role,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException("User not found!");

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatched)
      throw new UnauthorizedException("Invalid refresh token!");

    return {
      id: user.id,
    };
  }

  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return {
      id: userId,
      name,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDTO) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return this.userService.create(googleUser);
  }
}
