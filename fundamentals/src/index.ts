import {OpenAI} from 'openai';
import { encoding_for_model } from 'tiktoken';

// Create an Instance of OpenAI class
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});


const main =async ()=>{
    //  Define the prompt
    const prompt = "Hi How are you?"
const response = await openai.responses.create({
    model: "gpt-4.1-nano-2025-04-14",
    input: [
        {
            role:"user",
            content:prompt
        }
    ]
});

console.log(response.output_text);
}
const encodePrompt =(prompt: string) =>{
    const encoder =encoding_for_model("gpt-4.1-nano-2025-04-14")
    const tokens = encoder.encode(prompt)
    console.log(tokens)
}

encodePrompt("Hi How are you?");
main();