import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "argon2";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDTO: CreateUserDTO) {
    const { password, ...user } = createUserDTO;
    const hashedPassword = await hash(password);

    return await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findAll() {
    return [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
  }

  findOne() {
    return { id: 1, name: "Alice" };
  }

  update() {
    return { id: 1, name: "Alice updated" };
  }
}
