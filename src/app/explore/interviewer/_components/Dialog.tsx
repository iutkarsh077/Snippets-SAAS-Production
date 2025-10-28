import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERVIEWER_INFO } from "@/lib/constants";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface IProps {
  setOpenDialog: (name: boolean) => void;
}

const DialogCreateInterview = ({ setOpenDialog }: IProps) => {
  const [interviewName, setInterviewName] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);
  return (
    <div className="fixed flex items-center justify-center inset-0 min-h-screen bg-black/20 h-60">
      <div className="bg-white dark:bg-gray-900 dark:text-white text-black rounded-2xl shadow-xl w-full max-w-3xl p-6 relative">
        <div className="flex justify-between ">
          <p>Start an interview</p>
          <X
            onClick={() => setOpenDialog(false)}
            className="text-gray-600 w-8 h-8"
          />
        </div>

        <div className="space-y-5 mt-6">
          <div className="flex gap-x-4 items-center">
            <Label className="flex-nowrap">Interview Name</Label>
            <Input
              type="text"
              className="flex-1"
              onChange={(e) => setInterviewName(e.target.value)}
              value={interviewName}
            />
          </div>

          <div className="space-y-4">
            <p>Select an Interview</p>
            <div className="grid grid-cols-3 gap-x-12">
              {
                INTERVIEWER_INFO.map((item, index)=>(
                  <div key={index} onClick={()=>setSelectedInterviewer(item.id)} className={`space-y-5 hover:cursor-pointer transition-transform`}>
                    <Image src={item.image} width={0} height={0} className={`w-auto h-auto rounded-md object-cover transition-transform hover:scale-105 ${selectedInterviewer === item.id && "border-2 border-blue-600"}`} alt={item.title} />
                    <p className="text-center">{item.title}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogCreateInterview;
