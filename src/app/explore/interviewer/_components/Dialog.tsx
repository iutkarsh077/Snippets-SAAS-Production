import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERVIEWER_INFO } from "@/lib/constants";
import { I_INTERVIEWER_INFO } from "@/types/Interviewer";
import { Info, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect,  useState } from "react";

interface IProps {
  setOpenDialog: (name: boolean) => void;
}

const DialogCreateInterview = ({ setOpenDialog }: IProps) => {
  const [interviewName, setInterviewName] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(
    null
  );
  const [interviewerInfo, setInterviewerInfo] =
    useState<I_INTERVIEWER_INFO | null>(null);
  const [playAudio, setPlayAudio] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
      }
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handlePlayAudio = (interviewerInfo: I_INTERVIEWER_INFO) => {
    if (!interviewerInfo) return;
    // console.log(interviewerInfo)

    const utter = new SpeechSynthesisUtterance(interviewerInfo.description);
    if (interviewerInfo.title === "Explorer Lisa") {
      utter.voice =
        voices.find(
          (v) =>
            v.name.includes("Samantha") || v.name.includes("Google UK English Female")
        ) ?? null;
      utter.pitch = 1.3;
      utter.rate = 1;
      utter.volume = 0.9;
    }

    if (interviewerInfo.title === "Empathatic Bob") {
      utter.voice =
        voices.find(
          (v) =>
            v.name.includes("David") ||
            v.name.includes("Google UK English Male")
        ) ?? null;
      utter.pitch = 0.8;
      utter.rate = 1;
      utter.volume = 0.8;
    }

    if (interviewerInfo.title === "Speedy Adam") {
      utter.voice =
        voices.find(
          (v) =>
            v.name.includes("Alex") || v.name.includes("Google UK English Male")
        ) ?? null;
      utter.pitch = 1.0;
      utter.rate = 1.2;
      utter.volume = 0.85;
    }

    // console.log(utter.voice)

    // utter.lang = "en-US";

    setPlayAudio(true);

    utter.onend = () => setPlayAudio(false);

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

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
              {INTERVIEWER_INFO.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedInterviewer(item.id)}
                  className={`space-y-5 hover:cursor-pointer transition-transform`}
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      width={0}
                      height={0}
                      className={`w-auto h-auto rounded-md object-cover transition-transform hover:scale-105 ${
                        selectedInterviewer === item.id &&
                        "border-2 border-blue-600"
                      }`}
                      alt={item.title}
                    />
                    <p
                      onClick={() => setInterviewerInfo(item)}
                      className="bg-blue-500 p-1 rounded-full absolute top-2 right-2"
                    >
                      <Info className="text-white w-4 h-4" />
                    </p>
                  </div>
                  <p className="text-center">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {interviewerInfo && (
        <div className="fixed flex justify-center items-center inset-0 min-h-screen bg-black/20 h-60">
          <div className="bg-white dark:bg-gray-900 dark:text-white text-black rounded-2xl shadow-xl w-full max-w-4xl p-6 relative ">
            <X
              onClick={() => {
                speechSynthesis.cancel();
                setPlayAudio(false);
                setInterviewerInfo(null);
              }}
              className="text-gray-600 w-8 h-8 absolute top-1 right-4"
            />
            <p className="text-3xl flex items-center justify-center mb-8">
              {interviewerInfo.title}
            </p>
            <div className="flex items-start w-full gap-x-12">
              <div className="w-[40%] ">
                <Image
                  src={interviewerInfo.image}
                  alt={interviewerInfo.title}
                  width={0}
                  height={0}
                  className="w-auto rounded-md "
                />
              </div>
              <div className="flex-1 space-y-3">
                <p className="tracking-wide leading-relaxed">
                  {interviewerInfo.description}
                </p>
                <p className="p-2 inline-flex border-white border-1 rounded-full text-white bg-blue-500 hover:cursor-pointer">
                  {playAudio ? (
                    <Pause onClick={() => {
                      speechSynthesis.pause();
                      setPlayAudio(false);
                    }} />
                  ) : (
                    <Play onClick={() => handlePlayAudio(interviewerInfo)} />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogCreateInterview;
