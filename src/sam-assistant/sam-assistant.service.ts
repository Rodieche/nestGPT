/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './use-cases';
import { QuestioDto } from './dtos';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    async createThread() {
        return await createThreadUseCase(this.openai);
    }

    async userquestion(questionDto: QuestioDto){

        const { question, threadId } = questionDto;

        // Se crea el mensaje
        await createMessageUseCase( this.openai, { question, threadId } );
        
        // Se crea el Run
        const run = await createRunUseCase(this.openai, { threadId });

        await checkCompleteStatusUseCase( this.openai, { runId: run.id, threadId: threadId } );

        const messages = await getMessageListUseCase( this.openai, { threadId } );

        return messages.reverse();
    }

}
