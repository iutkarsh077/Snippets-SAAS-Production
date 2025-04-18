"use client";
import React, { useEffect, useState } from "react";
import ImageCard, { ImageCardProps } from "./_components/HeaderImageCard";
import { GetLatestFeed } from "../../../actions/GetLatestFeed";
import { Loader2 } from "lucide-react";
import { DeleteFeed } from "../../../actions/DeleteFeed";
import { useToast } from "@/hooks/use-toast";

const Feed = () => {
  const [cardData, setCardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setLoading(true);
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
    fetchFeedData();
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
      toast({
        title: "Feed deleted successfully.",
        duration: 2000,
      });
    } catch (error) {
      // console.log(error);
      toast({
        title: "failed to delete feeds.",
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-60">
        <Loader2 className="animate-spin h-16 lg:h-28 w-auto" />
      </div>
    );
  }

  return (
    <div className="fixed top-20 left-0 w-full h-screen pb-36 sm:pb-96 lg:pb-20  text-white flex justify-center">
    <div className="w-full max-w-[600px] h-full overflow-y-scroll example border-none lg:border-x-2 lg:border-t-2 lg:rounded-lg px-4">
      {cardData?.map((cardDataItems: ImageCardProps, index: number) => (
        <div key={index}>
          <ImageCard
            {...cardDataItems}
            handleDeleteFeed={handleDeleteFeed}
          />
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Feed;
