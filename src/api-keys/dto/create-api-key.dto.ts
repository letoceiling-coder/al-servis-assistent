import { IsString, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsUUID('4')
  assistantId: string;
}
