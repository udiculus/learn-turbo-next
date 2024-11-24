import {
  // IsInt,
  // IsNegative,
  // IsPositive,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @Length(2, 10, { message: "Name must be between 2 and 10 characters long." })
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  // @IsInt()
  // @IsNegative({ groups: ["create"] })
  // @IsPositive({ groups: ["update"] })
  // age: number;
}
