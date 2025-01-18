"use client";
import { useEffect, useState } from "react";
import CodeCard from "./_components/CodeCard";
import { Loader2 } from "lucide-react";
import { GetAllSnippets } from "../../../actions/GetAllSnippets";

export interface SnippetType {
  id: string;
  programmingLanguage: string;
  code: string;
  question: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

const MainSnippets = () => {
  const [snippets, setSnippets] = useState<SnippetType[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllSnippets = async () => {
      setLoading(true);
      const res = await GetAllSnippets();
      if (res && res.data) {
        setSnippets(res.data as any);
        // console.log(res);
      }
      setLoading(false);
    };
    getAllSnippets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-40">
        <Loader2 className="animate-spin h-16 lg:h-28 w-auto" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-3 gap-10  mt-20 xl:ml-20 xl:mr-20 ml-3 mr-3 pb-10">
      {snippets &&
        snippets
          .sort((a: { createdAt: any }, b: { createdAt: any }) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((snippet: any, index: number) => (
            <p key={index}>
              <CodeCard snippet={snippet} />
            </p>
          ))}
    </div>
  );
};

export default MainSnippets;
