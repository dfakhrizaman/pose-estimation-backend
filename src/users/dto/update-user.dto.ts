import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { SexType } from '../enums/sex.enum';

export class UpdateUserDto {
  @IsNumber()
  @Min(100)
  @Max(220)
  readonly height: number;

  @IsNumber()
  @Min(30)
  @Max(150)
  readonly weight: number;

  @IsNumber()
  @Min(5)
  @Max(75)
  readonly age: number;

  @IsString()
  @IsEnum(SexType)
  readonly sex: string;
}
