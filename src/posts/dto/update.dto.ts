import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  readonly _id: string;

  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;
}
