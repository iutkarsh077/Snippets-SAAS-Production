import React from "react";
import { ExploreCard, propTypes } from "./_components/ExploreCards";

const data = [
  {
    title: "Generate Image Link",
    description: "Upload an image, get the link, and use it anywhere.",
    path: "/explore/imageUpload",
    mainImage:
      "https://cdni.iconscout.com/illustration/premium/thumb/upload-image-illustration-download-in-svg-png-gif-file-formats--photo-digital-backup-storage-pack-network-communication-illustrations-3618850.png?f=webp",
  },
];

const Explore = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-5 lg:pl-8 ">
      {data.map((d: propTypes, index: number) => (
        <ExploreCard
          key={index}
          title={d.title}
          description={d.description}
          path={d.path}
          mainImage={d.mainImage}
        />
      ))}
    </div>
  );
};

export default Explore;
