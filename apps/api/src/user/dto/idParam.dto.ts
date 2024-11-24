import { IsInt, IsPositive } from "class-validator";

export class IdParamDTO {
  @IsInt()
  @IsPositive()
  id: number;
}
