import { readFileSync, writeFileSync } from "fs";
import {OpenAI} from "openai";
import { join } from "path";
import { json } from "stream/consumers";

const openai = new OpenAI();

// const generateEmbeddings = async (input: string|string []) => {
//     const response = await openai.embeddings.create({
//         model: "text-embedding-3-small",
//         input: input
//     });
//     console.log(response.data);
//     return response;
// }

// generateEmbeddings(["Hello", "world"]);


type DataWithEmbeddings ={
    input:string,
    emmbeddings:number[]
};

const generateEmbeddings = async (input: string|string []) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input
    });
    console.log(response.data);
    return response;
}

const loadInputJson= <T>(fileName:string):T =>{
    const path= join(__dirname,fileName);
    const rawInputData = readFileSync(path);
    return JSON.parse(rawInputData.toString())
}

const saveEmbaddingToJson = (embedding:any,fileName:string)=>{
    const embeddingStrings= JSON.stringify(embedding);
    const buffer = Buffer.from(embeddingStrings);
    const path = join(__dirname,fileName);
    writeFileSync(path,buffer);
    console.log(`Embedding file save to ${path}`);
}

const main =async ()=>{
    const input =loadInputJson<string[]>('input.json');
    const embeddings= await generateEmbeddings(input);
    const dataWithEmbeddings:DataWithEmbeddings[]=input.map((input,index)=>({
        input,
        emmbeddings:embeddings.data[index]!.embedding
    }))
    saveEmbaddingToJson(dataWithEmbeddings,"dataWithEmbeddings")

}
main();
generateEmbeddings(["Hello", "world"]);
