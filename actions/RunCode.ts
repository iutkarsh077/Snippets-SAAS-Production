"use server";

import { LANGUAGE_VERSIONS } from "@/lib/constants";
import axios from "axios";
import { revalidatePath } from "next/cache";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async ({
  language,
  sourceCode
}: {
  language: keyof typeof LANGUAGE_VERSIONS;
  sourceCode: string;
}) => {
  try {
    revalidatePath("/explore/code-editor");
    
    const response = await API.post("/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw new Error("Failed to execute code. Please try again.");
  }
};