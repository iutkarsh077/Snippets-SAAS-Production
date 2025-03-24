"use client";

import { useState } from "react";
import { Download, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
    //   console.log(data)
      setImage(data.imageUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () =>{
    try {
        const response = await fetch(image as string);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `image/${Math.floor(Math.random() * 10000)}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
       URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading the image:", error);
        toast({
            title: "Something went wrong",
            description: "Failed to download image, Please again after sometime."
        })
    }
  }

  return (
    <div className="h-[120vh] mt-12  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Unleash Your Imagination with AI!
          </h1>
          <p className="text-lg">
            Turn your ideas into breathtaking visuals in seconds.
          </p>
        </div>

        <Card className="p-6 ">
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate..."
              className="min-h-[100px] resize-none border-gray-700 placeholder:text-gray-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              onClick={generateImage}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            >
              {loading ? (
                "Generating..."
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4 " />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {image && (
            <div className="mt-8">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
            <div className="mt-4 flex gap-x-8 justify-between">
            <p className="text-sm text-gray-300 italic">
                {prompt}
              </p>
              <Download className="bg-gray-600 p-0.5 rounded-md hover:cursor-pointer dark:text-black text-white" onClick={downloadImage}/>
            </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}