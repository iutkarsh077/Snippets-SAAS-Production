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
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-3 mt-10 mb-10 ml-20 mr-20">
      {snippets &&
        snippets
          .sort((a: { createdAt: any }, b: { createdAt: any }) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          .map((snippet: any, index: number) => <p key={index}><CodeCard snippet={snippet} /></p>)}
    </div>
  );
};

export default MainSnippets;
