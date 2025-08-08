import {OpenAI} from "openai";
import { parse } from "path";


const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});

const getCurrentDateAndTime = ()=>{
    const date =new Date();
    return date.toLocaleString();
}
//#region Single parameters of the function
const getTaskStatus = (taskId:string)=>{
    console.log("getTaskStatus called with taskId:", taskId);
    // Simulate a task status retrieval
    if(parseInt(taskId) % 2 === 0) {
        return `Task  is completed`;
    } return `Task is still in progress.`;
}
// #endregion

const callOpenAIWithFuctionCalling=async ()=>{
const context :OpenAI.Chat.ChatCompletionMessageParam[]= [
            {
                role:"system",
                content:"Act like a cool bro. You can also give current date and time and task inforamtion."
            },
            // {
            //     role:"user",
            //     content:"What is the current date and time?"
            // },

            // #region Single parameters of the function
            // {
            //     role:"user",
            //     content:"What is the status of task 343?"
            // },
            {
                role:"user",
                content:"What is the status of task 204?"
            },
            // #endregion

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
            },
            // #region Single parameters of the function
            {
                type:"function",
                function:{
                    name:"getTaskStatus",
                    description:"get the status of a task",
                    parameters:{
                        type:"object",
                        properties:{
                            taskId: {
                                type:"string",
                                description:"The ID of the task to check the status of",
                            },
                        },
                        required:["taskId"],
                    }
                }
            },
            // #endregion
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
        // #region Single parameters of the function
        if(functionName==="getTaskStatus"){
            const argRaw = toolCall?.function.arguments;
            const parsedArgs = JSON.parse(argRaw ?? "{}");
            console.log("shouldInvokeFunction :", getTaskStatus(parsedArgs.taskId));
            const functionResponse = getTaskStatus(parsedArgs.taskId);
            context.push(response.choices[0]!.message)
            context.push({
                role:"tool",
                content:functionResponse,
                tool_call_id:toolCall?.id??""
            })
        }
        // #endregion
    }

    const finalResponse = await openai.chat.completions.create({
        model:"gpt-4.1-nano-2025-04-14",
        messages:context
    })

     console.log("Final Response :",finalResponse.choices[0]?.message.content); 
}

callOpenAIWithFuctionCalling();