import React from "react";
import { ExploreCard, propTypes } from "./_components/ExploreCards";

const data = [
  {
    title: "Generate Image Link",
    description: "Upload an image, get the link, and use it anywhere.",
    path: "/explore/imageUpload",
    
    mainImage:
      "http://res.cloudinary.com/dakddv1pm/image/upload/v1737197135/posts/qjwllc7qqilrfc33600s.jpg",
  },
  {
    title: "Bug Tracker",
    description: "Track the Progess of bug hunting and resolve it.",
    path: "/explore/bugtracker",
    
    mainImage:
      "http://res.cloudinary.com/dakddv1pm/image/upload/v1737197037/posts/spuzbvkdy5mqsk7lr63e.jpg",
  },

  {
    title: "Code Editor",
    description: "Live Code with teh feature of videocall.",
    path: "/explore/code-editor",
    
    mainImage:
      "http://res.cloudinary.com/dakddv1pm/image/upload/v1742798637/posts/kaa9rere8hvucndpzxxu.jpg",
  },


  {
    title: "Shyllido",
    description: "Convert your prompt into an image with the help of AI.",
    path: "/explore/image-generator",
    
    mainImage:
      "http://res.cloudinary.com/dakddv1pm/image/upload/v1742802688/posts/zrkfbuhbbwxjgfwj6fj7.webp",
  },
];

const Explore = () => {
  return (
    <div className="grid grid-cols-1 md:space-x-5 lg:grid-cols-2 lg:pl-8 ">
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
