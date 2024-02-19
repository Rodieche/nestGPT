/* eslint-disable prettier/prettier */

import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async( openai: OpenAI, { prompt, lang }: Options ) => {

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `Traduce el siguiente texto al idioma ${lang}:${ prompt }` },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 150
    });

    return { message: completion.choices[0].message.content };

}