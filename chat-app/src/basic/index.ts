import {OpenAI} from 'openai';

// Create an Instance of OpenAI class
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const context :OpenAI.Chat.Completions.ChatCompletionMessageParam[]= [
{
                role:"system",
                content:"Act like a cool bro"
            },
];

const createChat= async() =>{
    const response=await openai.chat.completions.create({
        model:"gpt-4.1-nano-2025-04-14",
        messages: context
    })
    const msgResponse=response.choices[0]?.message;
     if (msgResponse) {
    context.push(msgResponse);
  } else {
    console.error("No message returned in response.");
  }
    console.log(response.choices[0]?.message.content);
}

process.stdin.addListener("data", async (input) => {
  const userInput = input.toString().trim();
  context.push({
    role: "user",
    content: userInput,
  });

  await createChat();
});

// #region Headfirst way
// process.stdin.addListener("data",async (input)=>{
//     const userInput =input.toString().trim();

//     const response=await openai.chat.completions.create({
//         model:"gpt-4.1-nano-2025-04-14",
//         messages:[
//             {
//                 role:"system",
//                 content:""
//             },
//             {
//                 role:"user",
//                 content:userInput
//             }]
//     })

//     //#region this is also one of the way to interact oepnai
//     // const response= await openai.responses.create({
//     //     model:"gpt-4.1-nano-2025-04-14",
//     //     input:[
//     //         {
//     //             role:"system",
//     //             content:""
//     //         },
//     //         {
//     //             role:"user",
//     //             content:userInput
//     //         }
//     //     ]
//     // })
//     //  console.log(response.output_text);
//     // #endregion
    
//     console.log(response.choices[0]?.message.content);
// })

// #endregion
