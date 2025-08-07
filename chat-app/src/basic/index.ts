import {OpenAI} from 'openai';
import { encoding_for_model } from 'tiktoken';

// Create an Instance of OpenAI class
const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const encoder= encoding_for_model("gpt-4.1-nano-2025-04-14")
const MAX_TOKEN=500;
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
  if(response.usage && response.usage?.total_tokens>MAX_TOKEN){
    removeOlderToken();
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

const getContextLength=()=>{
  let length=0;
  context.forEach(
    (message:OpenAI.Chat.Completions.ChatCompletionMessageParam)=>{
      if(typeof message.content==="string"){
        length +=encoder.encode(message.content).length;
      }else if(Array.isArray(message.content)) {
        message.content.forEach((content)=>{
          if(content.type==="text"){
            length +=encoder.encode(content.text).length;
          }
        });
      }
    }
  );
  return length;
}

const removeOlderToken =()=>{
let contextLenght = getContextLength();
while(contextLenght>MAX_TOKEN){
  for(let i=0;i<context.length;i++){
    const message= context[i];
    if(message?.role!=="system"){
      context.splice(i,1)
      contextLenght=getContextLength();
      console.log("Update context length :",contextLenght)
      break;
    }
  }
}
}
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
