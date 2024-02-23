/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { audioToTextUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
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

}
