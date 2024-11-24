import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
  // ValidationPipe,
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { IdParamDTO } from "./dto/idParam.dto";
import { ParseIdPipe } from "./pipes/parseIdPipe";
import { ZodValidationPipe } from "./pipes/zodValidationPipe";
import { createUserSchema, CreateUserZodDTO } from "./dto/create-user.zod.dto";
import { HeaderDTO } from "./dto/header.dto";
import { RequestHeader } from "./pipes/request-header";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAll(
    @Query("sort", new DefaultValuePipe(false), ParseBoolPipe) sort: boolean, // parse the sort query parameter as a boolean
  ) {
    console.log(typeof sort);
    const data = this.userService.findAll();

    return { message: data };
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: string) {
    // parse the id parameter as an integer
    console.log(typeof id);

    return { message: `User with ID ${id}` };
  }

  @Post()
  @HttpCode(201) // set the HTTP status code to 201
  create(
    // @Body(
    //   new ValidationPipe({
    //     // validate the request body against the DTO
    //     whitelist: true, // values are only the properties specified in the DTO
    //     forbidNonWhitelisted: true, // values are not allowed to have extra properties
    //     groups: ["create"], // validate specific validation groups
    //     always: true, // validate all properties
    //   }),
    // )
    @Body(new ZodValidationPipe(createUserSchema))
    body: CreateUserZodDTO,
  ) {
    return body; // return the validated request body. automatically returned as JSON
  }

  @Patch(":id")
  @HttpCode(202)
  patch(
    @Param() param: IdParamDTO,
    // @Body(
    //   new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    //     groups: ["update"],
    //     always: true,
    //   }),
    // )
    @Body() body: CreateUserDTO,
  ) {
    return body;
  }

  @Put(":id")
  @HttpCode(200)
  update(
    @Param("id", ParseIdPipe) id,
    @Body() body: CreateUserDTO,
    @RequestHeader(
      new ValidationPipe({ whitelist: true, validateCustomDecorators: true }),
    )
    headers: HeaderDTO,
  ) {
    return headers;
  }
}
