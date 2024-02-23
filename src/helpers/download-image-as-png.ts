/* eslint-disable prettier/prettier */

import { InternalServerErrorException } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import * as path from "path";
import * as fs from 'fs';
import * as sharp from 'sharp';

export const downloadImageAsPng = async(url: string) => {
    const response = await fetch(url);

    if(!response.ok){
        throw new InternalServerErrorException('Download image was not possible');
    }

    const folderPath = path.resolve('./', './generated/images');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${ uuidv4() }.png`;
    const buffer = Buffer.from( await response.arrayBuffer() );

    // fs.writeFileSync(`${ folderPath }/${ imageNamePng }`, buffer);
    const completePath = path.join(folderPath, imageNamePng)

    await sharp( buffer )
        .png()
        .ensureAlpha()
        .toFile(completePath);

    return completePath ;
}

export const downloadBase64ImageAsPng = async (base64Image: string) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });
  
    const imageNamePng = `${ uuidv4() }-64.png`;
    const completePath = path.join(folderPath, imageNamePng)
    
  
    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
      .png()
      .ensureAlpha()
      .toFile(completePath);
  
    return completePath;
  
  }