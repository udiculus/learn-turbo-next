import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { LocalAuthGuard } from "./guards/local-auth/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard";
import { RefreshAuthGuard } from "./guards/refresh-auth/refresh-auth.guard";
import { GoogleAuthGuard } from "./guards/google-auth/google-auth.guard";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("sign-up")
  registerUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.registerUser(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post("sign-in")
  loginUser(@Request() req) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get("restricted")
  restrictedRoute() {
    return {
      message:
        "You're authenticated! Access to the restricted route granted. This is a secret message. Please, do not share it with anyone. :)",
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @UseGuards(GoogleAuthGuard)
  @Get("google/login")
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  async googleCallback(@Request() req, @Res() res: Response) {
    console.log("Google Callback", req.user);

    const response = await this.authService.login(req.user.id, req.user.name);
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&name=${response.name}&userId=${response.id}`,
    );
  }
}
