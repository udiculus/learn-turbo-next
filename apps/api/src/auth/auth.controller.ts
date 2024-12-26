import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDTO } from "src/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("sign-up")
  registerUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.registerUser(createUserDTO);
  }
}
