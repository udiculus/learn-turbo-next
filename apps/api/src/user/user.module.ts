import { Module, ValidationPipe } from "@nestjs/common";
import { UserController } from "./user.controller";
import { APP_PIPE } from "@nestjs/core";
import { UserService } from "./user.service";
// import { APP_PIPE } from "@nestjs/core";

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: APP_PIPE,
      // apply validation pipe on module level
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true, // transform incoming data to DTO type
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    UserService,
  ],
})
export class UserModule {}
