import {OpenAI} from "openai";


const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const getCurrentDateAndTime = ()=>{
    const date =new Date();
    return date.toLocaleString();
}

const callOpenAIWithFuctionCalling=async ()=>{
const context :OpenAI.Chat.ChatCompletionMessageParam[]= [
            {
                role:"system",
                content:"Act like a cool bro"
            },
            {
                role:"user",
                content:"What is the current date and time?"
            },
            // {
            //     role:"user",
            //     content:"How are you?"
            // },
];

const response=await openai.chat.completions.create({
        model:"gpt-4.1-nano-2025-04-14",
        messages: context,
        // Configure the function calling
        tools:[
            {
                type:"function",
                function:{
                    name:"getCurrentDateAndTime",
                    description:"get the curerent time and date"
                }
            }
        ],
        tool_choice:'auto' //openai will decide
    })
     console.log("First Response :",response.choices[0]?.message.content);
    //  based on finish_reason it call function
    const shouldInvokeFunction=response.choices[0]?.finish_reason==="tool_calls";

    const toolCall=response.choices[0]?.message.tool_calls?.[0];
    
    if(!toolCall)return;
    if(shouldInvokeFunction){
        const functionName=toolCall?.function.name;

        if(functionName==="getCurrentDateAndTime"){
            console.log("shouldInvokeFunction :",getCurrentDateAndTime())
            const functionResponse = getCurrentDateAndTime();
            context.push(response.choices[0]!.message)
            context.push({
                role:"tool",
                content:functionResponse,
                tool_call_id:toolCall?.id??""
            })
        }
    }

    const finalResponse = await openai.chat.completions.create({
        model:"gpt-4.1-nano-2025-04-14",
        messages:context
    })

     console.log("Final Response :",finalResponse.choices[0]?.message.content); 
}

callOpenAIWithFuctionCalling();