/* eslint-disable prettier/prettier */
import * as fs from 'fs';
import OpenAI from "openai";

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async( openai: OpenAI, { prompt, audioFile }: Options ) => {

    const completion = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: fs.createReadStream( audioFile.path ),
        prompt: prompt,
        language: 'es',
        response_format: 'verbose_json'
    });

    return completion;

}