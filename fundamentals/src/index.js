import {OpenAI} from 'openai';

// Create an Instance of OpenAI class
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// const main =async ()=>{
//     //  Define the prompt
//     const prompt = "Hi How aare you?"
//     // Define the completion options
//     const completionOpt={
//         model:"text-davinci-003",
//         maxTokens:100
//     };

//     // Generatee the completion
//     const completion=await openai.complete(prompt,completionOpt);

//     // log the completion
//     console.log(completion.choices[0].text)
// }
const main =async ()=>{
    //  Define the prompt
    const prompt = "Hi How are you?";
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

main();