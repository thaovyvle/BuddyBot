import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API
import { BedrockRuntime, BedrockRuntimeOptions, BedrockRuntimeClient, InvokeModelWithResponseStreamCommand, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { NextRequest } from 'next/server'
import { fromEnv } from "@aws-sdk/credential-providers"
import { bedrock, createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { generateText, streamText } from 'ai'

const decoder = new TextDecoder();
// const bedrock = new BedrockRuntime({
//   region: "us-west-2",
//   credentials: fromEnv()
// })

async function* makeIterator(messages){
  const command = new InvokeModelWithResponseStreamCommand({
    modelId: "meta.llama3-1-405b-instruct-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt:  JSON.stringify(messages),
      max_gen_len: 100,
      temperature: 0.5,
      top_p: 0.9,
    })
  })

  console.log(command) // TODO: remove this later

  try {
    console.log("calling bedrock...")
    const resp = await bedrock.send(command)


    if (resp.body){
      console.log(resp.body)
      // const json = JSON.parse(decoder.decode(resp.body.transformToString()))

      for await (const chunk of resp.body){
        if (chunk.chunk) {
          try {
            const json = JSON.parse(decoder.decode(chunk.chunk.bytes))

            if (json.stop_reason == null) {
              console.log(json.generation + " ")
              yield json.generation
            }
          } catch (error) {
            console.log(error)
            yield " "
          }
        }
      }
    }
    
    
  } catch (error) {
    console.log(error)
  }
}

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function GET() {
  const iterator = makeIterator([]);
  const stream = iteratorToStream(iterator);
  
  return new ReportingObserver(stream);
}


export async function POST(request) {
  const req = await request.json()

  const bedrock = createAmazonBedrock({
    bedrockOptions: {
      region: "us-west-2",
      credentials: fromEnv()
    }
  });

  const text = await generateText({
    model: bedrock('meta.llama3-1-405b-instruct-v1:0'),
    prompt: JSON.stringify(req.messages),
  });

  return new Response(text.text) 

  // const iterator = makeIterator(req.messages)
  // const stream  = iteratorToStream(iterator)
  // return new Response(stream)
}




/**
 * Chat GPT STUFF


// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = ` BuddyBot is a friendly and efficient customer support assistant designed to help users with their inquiries by providing accurate, concise, and helpful responses. It handles a wide range of topics, including account issues, product information, troubleshooting, and general inquiries. BuddyBot always responds politely and maintains a positive tone. If BuddyBot does not have the answer, it guides users on how they can find the information or escalates the issue to a human representative.`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
  */