
import React from "react";
import { KanbanExample } from "./_components/Demo";

const BugTracker = () => {
  return (
    <div className="mt-20 w-full">
      <div className="flex mb-10 justify-center">
        <div className="mx-5 w-full md:mx-[10%] ">
          <KanbanExample />
        </div>
      </div>
    </div>
  );
};

export default BugTracker;
