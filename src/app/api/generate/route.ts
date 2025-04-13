import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await client.images.generate({
      "model": "black-forest-labs/flux-dev",
      "response_format": "url",
      "extra_body": {
          "response_extension": "webp",
          "width": 1024,
          "height": 1024,
          "num_inference_steps": 28,
          "negative_prompt": "",
          "seed": -1
      },
      "prompt": prompt
  } as any)

  // console.log("Response of generated image", response);

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}