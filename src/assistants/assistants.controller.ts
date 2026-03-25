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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssistantsService } from './assistants.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';

type AuthedRequest = Request & { user: { id: string; email: string } };

@Controller('assistants')
@UseGuards(JwtAuthGuard)
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Post()
  create(@Req() req: AuthedRequest, @Body() dto: CreateAssistantDto) {
    return this.assistantsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: AuthedRequest) {
    return this.assistantsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.assistantsService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Req() req: AuthedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssistantDto,
  ) {
    return this.assistantsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.assistantsService.remove(req.user.id, id);
  }
}
