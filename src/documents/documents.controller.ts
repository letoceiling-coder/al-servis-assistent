import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentsService } from './documents.service';

type AuthedRequest = Request & { user: { id: string; email: string } };

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Req() req: AuthedRequest, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(req.user.id, dto);
  }

  @Get()
  findAll(
    @Req() req: AuthedRequest,
    @Query('assistantId', ParseUUIDPipe) assistantId: string,
  ) {
    return this.documentsService.findAll(req.user.id, assistantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.delete(req.user.id, id);
  }
}
