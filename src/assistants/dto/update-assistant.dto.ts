import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAssistantDto {
  @IsString()
  @MinLength(1, { message: 'name must not be empty' })
  @MaxLength(200)
  name: string;
}
