/* eslint-disable prettier/prettier */

import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( openai: OpenAI, options: Options ) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `
                Te seran proveidos textos en español con posibles errores ortograficos y gramaticales. 
                Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
                Debes de responder en formato JSON, tu tarea es corregirlos y retornar informacion soluciones, tambien debes de dar un porcentaje de acierto por el usuario.
                Ejemplo de salida:
                {
                    userScore: number,
                    errors: string[], // ['error -> solucion']
                    message: string, // Usa emojis y texto para felicitar al usuario con la personalidad de Homero Simpson
                }
            ` },
            { role: 'user', content: prompt }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 150
    });

    console.log(completion.choices[0].message);

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    return jsonResponse;

}