/* eslint-disable prettier/prettier */
import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { AudioToTextDto } from './dtos/audio-to-text.dto';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    async orthographyCheck(orthographyDto: OrthographyDto){
        return await orthographyCheckUseCase( this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
    }

    async translate({ prompt, lang }: TranslateDto){
        return await translateUseCase( this.openai, { prompt, lang } );
    }

    async textToAudio({ prompt, voice }: TextToAudioDto){
        return await textToAudioUseCase( this.openai, { prompt, voice } );
    }

    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ){
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openai, { audioFile, prompt: prompt });
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto){
        return await imageGenerationUseCase( this.openai, { ...imageGenerationDto } )
    }
    getGeneratedImage( fileName: string ){
        const filePath = path.resolve('./','./generated/images/', fileName);
        const fileExist = fs.existsSync(filePath);

        if(!fileExist) throw new NotFoundException('File not Found');

        return filePath;
    }

    async generateImageVariation({ baseImage }: ImageVariationDto){
        return imageVariationUseCase( this.openai, { baseImage } )
    }

}
