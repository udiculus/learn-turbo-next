import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  registerUser(data: CreateUserDTO) {
    const user = this.userService.findByEmail(data.email);

    if (user) throw new ConflictException("User already exists!");
    return this.userService.create(data);
  }
}
