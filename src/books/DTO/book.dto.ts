import { IsNotEmpty, IsPositive, IsString, Max, Min } from 'class-validator';
import { AuthorEntity } from '../entities/author.entity';

export class BookDTO {
  @IsString()
  @IsNotEmpty()
  title;

  @IsPositive()
  @Min(1950)
  @Max(2024)
  year;

  @IsNotEmpty()
  author: AuthorEntity;
}
