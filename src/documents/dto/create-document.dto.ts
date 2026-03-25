import {
  IsIn,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export const DOCUMENT_TYPES = ['manual', 'file', 'url'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export class CreateDocumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  @MaxLength(20000)
  content: string;

  @IsIn(DOCUMENT_TYPES)
  type: DocumentType;

  @IsUUID('4')
  assistantId: string;
}
