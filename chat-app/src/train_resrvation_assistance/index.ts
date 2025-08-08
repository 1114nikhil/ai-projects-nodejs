import {OpenAI} from "openai";

const openai = new OpenAI();
// #region  parameters of the function
const getTrainBetweenStations=(source:string,destination:string):string []=>{
    if(source==="Delhi" && destination==="Mumbai"){
        return ["Rajdhani Express", "Train 12345", "Train 67890"];
    }else if(source==="Mumbai" && destination==="Delhi"){
        return ["Shatabdi Express", "Train 54321", "Train 09876"];
    }else{
        return ["No trains available"];
    }
}

const bookTicket =(trainName:string):string|'UNAVAILABLE '=>{
    if(trainName==="Rajdhani Express" ){
        return "Ticket booked successfully PNR 123456789";
    }else if(trainName==="Shatabdi Express" ){
        return "Ticket booked successfully PNR 987654321";
    }else{
        return 'UNAVAILABLE';
    }
}
// #endregion

// #region Context
const history: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: "system",
        content: "You are a helpful assistant for train reservations. You can provide information about trains and book tickets."
    }
];
// #endregion

// #region Main Function 
const callOpenAIWithFuctionCalling = async () => {

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano-2025-04-14",
        messages: history,
        temperature:0,
        tools: [
            {
                type: "function",
                function: {
                    name: "getTrainBetweenStations",
                    description: "Get trains between two stations",
                    parameters: {
                        type: "object",
                        properties: {
                            source: {
                                type: "string",
                                description: "Source station"
                            },
                            destination: {
                                type: "string",
                                description: "Destination station"
                            }
                        },
                        required: ["source", "destination"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "bookTicket",
                    description: "Book a ticket on a train",
                    parameters: {
                        type: "object",
                        properties: {
                            trainName: {
                                type: "string",
                                description: "Name of the train to book"
                            }
                        },
                        required:["trainName"]
                    }
                }
            }
        ],
        tool_choice:"auto"
    });

    const shouldInvokeFunction = response.choices[0]!.finish_reason === "tool_calls";

    if(shouldInvokeFunction) {
        const assistantMessage = response.choices[0]!.message;
        history.push(assistantMessage);
        const toolCall = response.choices[0]!.message.tool_calls?.[0];
        if(!toolCall) return;

        const functionName = toolCall?.function.name;

        const args = JSON.parse(toolCall?.function.arguments ?? "{}");

        let functionResponse: string | string[] | 'UNAVAILABLE';

        if (functionName === "getTrainBetweenStations") {
            functionResponse = getTrainBetweenStations(args.source, args.destination);
        } else if (functionName === "bookTicket") {
            functionResponse = bookTicket(args.trainName);
        } else {
            throw new Error("Unknown function called");
        }

        // Add the function response to the history
        history.push({
            role: "tool",
            content: `${JSON.stringify(functionResponse)}`,
            tool_call_id: toolCall?.id ?? ""
        });
    }

    // final response from OpenAI
    const finalResponse = await openai.chat.completions.create({
        model: "gpt-4.1-nano-2025-04-14",
        messages: history,
    });
    console.log("Final Response:", finalResponse.choices[0]?.message.content);
}
// #endregion

process.stdin.addListener("data", async (data) => {
    const userInput = data.toString().trim();
    if (userInput) {
        history.push({ role: "user", content: userInput });
        await callOpenAIWithFuctionCalling();
    }
});