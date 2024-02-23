/* eslint-disable prettier/prettier */

import * as fs from 'fs';
import * as path from 'path';

import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;
}

export const imageGenerationUseCase = async( openai: OpenAI, options: Options ) => {

    const { prompt, originalImage, maskImage } = options;

    // Todo: Verificar original image
    if(!originalImage || !maskImage){
        const response =  await openai.images.generate({
            prompt: prompt,
            model: 'dall-e-3',
            n: 1,
            size: '1024x1024',
            quality: 'standard',
            response_format: 'url'
        });

        // Todo: guardar la imagen en fileSystem

        const url = await downloadImageAsPng(response.data[0].url);


        return {
            url: url, //todo: http://localhost:3000/gpt/image-generation/75cf9e0c-29f8-40d8-9b12-644b4f63924f.png
            openAIUrl: response.data[0].url,
            revised_prompt: response.data[0].revised_prompt
        }
    }

    const pngImagePath = await downloadImageAsPng(originalImage);
    const maskPath = await downloadBase64ImageAsPng(maskImage);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskPath),
        n: 1,
        size: '1024x1024',
        response_format: 'url'
    });

    const localImagePath = await downloadImageAsPng(response.data[0].url);
    const fileName = path.basename(localImagePath);

    const publicUrl = `localhost:3000/${ fileName }`;

    return {
        url: publicUrl, //todo: http://localhost:3000/gpt/image-generation/75cf9e0c-29f8-40d8-9b12-644b4f63924f.png
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    }

}