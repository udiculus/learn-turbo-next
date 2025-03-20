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
import { RefreshAuthGuard } from "./guards/refresh-auth/refresh-auth.guard";
import { GoogleAuthGuard } from "./guards/google-auth/google-auth.guard";
import { Response } from "express";
import { Public } from "./decorators/public.decorator";
import { Roles } from "./decorators/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("sign-up")
  registerUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.registerUser(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("sign-in")
  loginUser(@Request() req) {
    return this.authService.login({
      userId: req.user.id,
      name: req.user.name,
      role: req.user.role,
    });
  }

  @Post("sign-out")
  logoutUser(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @Roles("ADMIN", "EDITOR")
  @Get("restricted")
  restrictedRoute() {
    return {
      message:
        "You're authenticated! Access to the restricted route granted. This is a secret message. Please, do not share it with anyone. :)",
    };
  }

  @UseGuards(RefreshAuthGuard)
  @Public()
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @UseGuards(GoogleAuthGuard)
  @Public()
  @Get("google/login")
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Public()
  @Get("google/callback")
  async googleCallback(@Request() req, @Res() res: Response) {
    console.log("Google Callback", req.user);

    const response = await this.authService.login({
      userId: req.user.id,
      name: req.user.name,
      role: req.user.role,
    });
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&name=${response.name}&userId=${response.id}&role=${response.role}`,
    );
  }
}
