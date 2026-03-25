import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(8000)
  message: string;
}
