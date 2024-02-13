import { IsNotEmpty, IsPositive, IsString, Max, Min } from 'class-validator';

export class BookDTO {
  @IsString()
  @IsNotEmpty()
  title;

  @IsPositive()
  @Min(1950)
  @Max(2024)
  year;
}
