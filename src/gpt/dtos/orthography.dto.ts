/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {

    @IsString()
    readonly prompt: string

    @IsInt()
    @IsOptional()
    readonly maxTokens?: number;

}