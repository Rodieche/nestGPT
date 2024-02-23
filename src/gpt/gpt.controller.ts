/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthhographyDto: OrthographyDto
  ){
    return this.gptService.orthographyCheck(orthhographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto
    ) {
      return this.gptService.prosConsDicusser(prosConsDiscusserDto);
    }

    @Post('pros-cons-discusser-stream')
    async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
    ) {
      const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK);

      for await( const chunk of stream ) {
        const piece = chunk.choices[0].delta.content || '';
        console.log(piece);
        res.write(piece);
      }

      res.end();
    }

    @Post('translate')
    translate(
      @Body() translateDto: TranslateDto
    ){
      return this.gptService.translate(translateDto);
    }

    @Post('text-to-audio')
    async textToAudio(
      @Body() textToAudioDto: TextToAudioDto,
      @Res() res: Response
    ){
      const filePath = await this.gptService.textToAudio(textToAudioDto);

      res.setHeader('Content-Type', 'audio/mp3');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);

    }

    @Post('audio-to-text')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './generated/uploads',
          filename: ( req, file, callback ) => {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${ uuidv4() }.${ fileExtension }`;
            return callback(null, fileName);
          }
        })
      })
    )
    async AudioToText(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5 MB'  }),
            new FileTypeValidator({ fileType: 'audio/*' })
          ]
        })
      ) file: Express.Multer.File,
      @Body() audioToTextDto: AudioToTextDto,
    )  {

      return this.gptService.audioToText(file, audioToTextDto);

    }

    @Post('image-generation')
    async imageGeneration(
      @Body() imageGenerationDto: ImageGenerationDto
    ){
      return await this.gptService.imageGeneration(imageGenerationDto);
    }

    @Get('image-generation/:filename')
    async getGeneratedImage(
      @Res() res: Response,
      @Param('filename') fileName: string
    ){
      const filePath = this.gptService.getGeneratedImage(fileName);
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    }
}
