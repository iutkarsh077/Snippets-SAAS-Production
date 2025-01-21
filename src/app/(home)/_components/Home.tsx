"use client";
import { useEffect, useState } from "react";
import Header from "../_components/Header";
import CodeCard from "../_components/Card";
import { HeroScrollDemo } from "../_components/HeroScrollDemo";
import { CardHoverEffectDemo } from "../_components/HoverEffect";
import Footer from "../_components/Footer";
import { GetAllSnippets } from "../../../../actions/GetAllSnippets";
import { SnippetType } from "@/app/snippets/page";
import { motion } from "framer-motion";
import ImageCard, {
  ImageCardProps,
} from "@/app/feeds/_components/HeaderImageCard";
import { DeleteFeed } from "../../../../actions/DeleteFeed";
import { GetFeedByProfile } from "../../../../actions/GetfeedByProfile";
import { GetLatestFeed } from "../../../../actions/GetLatestFeed";

const HomeSection = () => {
  const [cardData, setCardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [snippets, setSnippets] = useState<SnippetType[] | null>(null);

  const fetchFeedData = async () => {
    try {
      const res = await GetLatestFeed();
      if (res.status === false) {
        throw new Error(res.msg);
      }
      // console.log(res);
      setCardData(res?.feedsData);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

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

  const handleDeleteFeed = async (feedId: string) => {
    try {
      setCardData((prevData: any) =>
        prevData ? prevData.filter((feed: any) => feed.id !== feedId) : prevData
      );
      const res = await DeleteFeed(feedId);
      if (res.status === false) {
        throw new Error(res.msg);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-1  sm:grid-cols-2  lg:grid-cols-3 gap-x-6 gap-y-14  mt-10 xl:ml-20 xl:mr-20 ml-3 mr-3">
        {cardData
          ?.slice(2, 5)
          .map((cardDataItems: ImageCardProps, index: number) => (
            <motion.div
              key={index}
              className="max-w-md w-full min-h-full flex flex-col justify-between rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <ImageCard
                {...cardDataItems}
                handleDeleteFeed={handleDeleteFeed}
                AllowedToDelete={false}
              />
            </motion.div>
          ))}
      </div>
      <HeroScrollDemo />
      <div className="grid grid-cols-1  sm:grid-cols-2  lg:grid-cols-3 gap-x-6 gap-y-14  mb-24 xl:ml-20 xl:mr-20 ml-3 mr-3 -mt-64 md:-mt-0">
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
      <CardHoverEffectDemo />
      <Footer />
    </>
  );
};

export default HomeSection;
