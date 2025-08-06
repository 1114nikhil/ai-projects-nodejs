import {OpenAI} from 'openai';
import { encoding_for_model } from 'tiktoken';

// Create an Instance of OpenAI class
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

// #region test open ai working
// const main =async ()=>{
//     //  Define the prompt
//     const prompt = "Hi How are you?"
// const response = await openai.responses.create({
//     model: "gpt-4.1-nano-2025-04-14",
//     input: [
//         {
//             role:"user",
//             content:prompt
//         }
//     ]
// });

// console.log(response.output_text);
// }
// #endregion

// #region check no. of tokens
// const encodePrompt =(prompt: string) =>{
//     const encoder =encoding_for_model("gpt-4.1-nano-2025-04-14")
//     const tokens = encoder.encode(prompt)
//     console.log(tokens)
// }
// encodePrompt("Hi How are you?");
// #endregion

// #region understanding Roles
// Roles
// 1. system : we tell ai how to response
// 2. user : we send the query
// 3. assistance : ai sends the response
// const main =async ()=>{
//     //  Define the prompt
//     const prompt = "Hi How are you?"
// const response = await openai.responses.create({
//     model: "gpt-4.1-nano-2025-04-14" ,
//     input: [
//         {
//             role:"system",
//             content:"You respond with greeting 'Namaste' in the beginning and you always respond in the JSON formate, like this :{'greeting':'greeting here','message':'reply here'} "
//         },
//         {
//             role:"user",
//             content:prompt
//         },
//     ],
// });

// console.log(response.output_text);
// }
// #endregion

// Parametes  reasoning,tools,temperature,max_output_tokens,top_p,store
const main =async ()=>{const response = await openai.responses.create({
  model: "gpt-4.1",
  input: [
    {
      "role": "system",
      "content": [
        {
          "type": "input_text",
          "text": "You respond with greeting 'Namaste' in the beginning and you always respond in the JSON formate, like this :{'greeting':'greeting here','message':'reply here'}"
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "How are you?"
        }
      ]
    }
  ],
  text: {
    "format": {
      "type": "text"
    }
  },
  reasoning: {},
  tools: [],
  temperature: 1,
  max_output_tokens: 16,
  top_p: 1,
  store: true
});}

main();