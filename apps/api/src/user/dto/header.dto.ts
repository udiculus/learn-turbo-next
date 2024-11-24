import { IsString } from "class-validator";
import { Expose } from "class-transformer";

export class HeaderDTO {
  @IsString()
  @Expose({ name: "access-token" })
  accessToken: string;
}
