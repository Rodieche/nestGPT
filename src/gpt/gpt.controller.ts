/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthhographyDto: OrthographyDto
  ){
    return this.gptService.orthographyCheck(orthhographyDto);
  }
}
