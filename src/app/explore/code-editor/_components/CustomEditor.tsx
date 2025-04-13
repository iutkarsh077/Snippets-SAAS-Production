"use client";
import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { executeCode } from "../../../../../actions/RunCode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "@/lib/constants";

export default function MyEditor() {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef<any>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<keyof typeof LANGUAGE_VERSIONS>("python");

  useEffect(() => {
    const lang = localStorage.getItem("language") as keyof typeof LANGUAGE_VERSIONS;
    const localCode = localStorage.getItem("code");
    if(localCode && lang){
      setCodeLanguage(lang);
      setCode(localCode);
    }
    else{
      setCode(CODE_SNIPPETS[codeLanguage]);
    }
  }, []);

  const Mount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem("code", value); // Fixed: store the new value, not the previous state
      localStorage.setItem("language", codeLanguage);
    }
  };

  const handleCodeLanguage = (value: keyof typeof LANGUAGE_VERSIONS) => {
    setCodeLanguage(value);
    setCode(CODE_SNIPPETS[value]);
    localStorage.setItem("language", value);
    localStorage.setItem("code", CODE_SNIPPETS[value]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await executeCode({
        language: codeLanguage,
        sourceCode: code
      });
      // console.log(data);
      setOutput(data.run.output);
      setShowOutput(true);
    } catch (error: any) {
      // console.error(error);
      setOutput(
        `Error: ${error.message || "An error occurred during execution"}`
      );
      setShowOutput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOutput = () => {
    setShowOutput(!showOutput);
  };

  return (
    <div className="flex justify-center items-start pt-6 outline-none">
      <div className="w-[90%] border rounded-lg overflow-hidden flex flex-col">
        <div className="bg-gray-800 text-white px-4 py-2 font-medium flex justify-between items-center">
          <div className="flex gap-x-3 lg:gap-x-8 justify-center">
            <div className="flex items-center text-sm lg:text-xl">Code Editor</div>
            <Select onValueChange={(value) => handleCodeLanguage(value as keyof typeof LANGUAGE_VERSIONS)} value={codeLanguage}>
              <SelectTrigger className="w-[80px] lg:w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.keys(LANGUAGE_VERSIONS).map((language) => (
                    <SelectItem value={language} key={language}>
                      {language.charAt(0).toUpperCase() + language.slice(1)}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <button
            onClick={toggleOutput}
            className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            {showOutput ? "Hide Output" : "Show Output"}
          </button>
        </div>

        <div className="flex flex-col flex-grow relative">
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <div
              className={`transition-all duration-300 ease-in-out ${
                showOutput ? "h-[50vh]" : "h-[70vh]"
              }`}
            >
              <Editor
                height="100%"
                language={codeLanguage}
                theme="vs-dark"
                onMount={Mount}
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 16,
                }}
              />
            </div>

            {showOutput && (
              <div className="border-t border-gray-700">
                <div className="bg-gray-800 text-white px-4 py-1 text-sm font-medium flex justify-between items-center">
                  <div>Output</div>
                  <button
                    type="button"
                    onClick={toggleOutput}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="bg-[#1e1e1e] text-white p-4 font-mono text-sm h-[30vh] overflow-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : output ? (
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">
                        Run your code to see the output here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end p-2 bg-gray-800">
              <button
                type="submit"
                className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-400"
                disabled={isLoading}
              >
                {isLoading ? "Running..." : "Run Code"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}