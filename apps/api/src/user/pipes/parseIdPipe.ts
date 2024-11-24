import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const result = parseInt(value, 10); // Throws error if conversion fails
    if (isNaN(result)) throw new BadRequestException("Id must be a number");
    if (result <= 0) throw new BadRequestException("Id must be positive");
    return result;
  }
}
