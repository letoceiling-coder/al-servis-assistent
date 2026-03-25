import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKeysService } from './api-keys.service';

type AuthedRequest = Request & { user: { id: string; email: string } };

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Req() req: AuthedRequest, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.create(
      req.user.id,
      dto.assistantId,
      dto.name,
    );
  }

  @Get()
  findAll(@Req() req: AuthedRequest) {
    return this.apiKeysService.findAll(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.apiKeysService.delete(req.user.id, id);
  }
}
