import { DataWithEmbeddings, generateEmbeddings, loadInputJson } from "./data"

const dotProduct= (a:number[],b:number[])=>{
    return a.reduce((acc,val,index)=>acc+val * (b[index] ?? 0),0)
}

// angle between vector
export const cosineSimilarity =(a:number[],b:number[])=>{
    const dot = dotProduct(a,b)
    const normA = Math.sqrt(dotProduct(a,a))
    const normB = Math.sqrt(dotProduct(b,b))
    return dot/(normA*normB)
}

const main =async ()=>{
    const dataWithEmbeddings = loadInputJson<DataWithEmbeddings[]>("dataWithEmbeddings.json");

    const input ='animal in India';

    const inputEmbeddings = await generateEmbeddings(input);

    const similarities:{
        input:string,
        similarity:number
    }[]= dataWithEmbeddings.map((data)=>({
        input:data!.input,
        similarity:cosineSimilarity(
            data!.embeddings,
            inputEmbeddings.data[0]!.embedding
        )
        // similarity:dotProduct(
        //     data!.embeddings,
        //     inputEmbeddings.data[0]!.embedding
        // )
    }));




    const sortedSimilarity = similarities.sort((a,b)=>b.similarity-a.similarity)

    console.log(`Similarity of ${input}`,sortedSimilarity)
}

main();