/* eslint-disable prettier/prettier */
import OpenAI from "openai";

interface Options {
    threadId: string;
    assitantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {

   const { threadId, assitantId = process.env.DEFAULT_ASSISTANT_ID } = options;

   const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assitantId,
   });

   return run;

   
}