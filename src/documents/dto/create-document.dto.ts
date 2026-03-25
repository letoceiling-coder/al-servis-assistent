import { IsString, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  content: string;

  @IsUUID('4')
  assistantId: string;
}
