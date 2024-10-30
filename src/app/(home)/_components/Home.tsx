"use client";
import { useEffect, useState } from "react";
import Header from "../_components/Header";
import CodeCard from "../_components/Card";
import { HeroScrollDemo } from "../_components/HeroScrollDemo";
import { CardHoverEffectDemo } from "../_components/HoverEffect";
import Footer from "../_components/Footer";
import { GetAllSnippets } from "../../../../actions/GetAllSnippets";
import { SnippetType } from "@/app/snippets/page";

const HomeSection = () => {
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

  return (
    <>
      <Header/>
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-x-6 gap-y-14 mx-3 mt-10 ml-20 mr-20">
        {snippets
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 6)
          .map((snippet, index) => (
            <div key={index}>
              <CodeCard snippet={snippet} />
            </div>
          ))}
      </div>
      <HeroScrollDemo/>
      <CardHoverEffectDemo/>
      <Footer/>
    </>
  );
};

export default HomeSection;
