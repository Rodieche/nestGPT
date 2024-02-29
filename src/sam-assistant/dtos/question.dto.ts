/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class QuestioDto{

    @IsString()
    readonly threadId: string;

    @IsString()
    readonly question: string;

}