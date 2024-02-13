/* eslint-disable prettier/prettier */
import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserStreamUseCase = async (openai: OpenAI, { prompt }: Options) => {

    return await openai.chat.completions.create({
        stream: true,
        messages: [
            { role: "system", content: `
            Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
            la respuesta debe de ser en formato Markdown,
            los pros y contras deben de estar en una lista,
            // Ejemplo de salida:
            //     {
            //         Comparacion: string,
            //         pros: string[],
            //         cons: string[],
            //         message: string, // Usa emojis y texto para felicitar al usuario con la personalidad de Homero Simpson
            //     }
            ` },
            { role: 'user', content: prompt }
        ],
        model: "gpt-4",
        temperature: 0.8,
        max_tokens: 500
    });

}