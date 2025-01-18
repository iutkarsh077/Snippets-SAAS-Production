"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exampleStatuses } from "../_components/constant";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const AddBugs = () => {
  const [bugText, setBugText] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 200) {
      toast({
        title: "Character limit exceeded",
        duration: 1000,
      });
      return;
    } else {
      setBugText(e.target.value);
    }
  };

  const handleAddTask = async () => {
    if (!bugText || !startDate || !endDate || !status) {
      toast({
        title: "Required fields are empty",
        duration: 1000,
      });
      return;
    }

    try {
      const data = {
        text: bugText,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
      };

      if (data.startDate > data.endDate) {
        toast({
          title: "Invalid data",
          description: "Start Date is greater the end Date",
          duration: 1000,
        });
        return;
      }
      setLoading(true);

      const res = await axios.post("/api/SaveBug", data);
      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }
      setEndDate(null);
      setStartDate(null);
      setStatus("");
      setBugText("");
      router.push("/explore/bugtracker");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again, after some time",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (value: string) => {
    setStatus(value);
  };

  return (
    <div className="mt-28 flex items-center justify-center px-4">
      <div className="w-full max-w-[600px] space-y-5">
        <div className="flex flex-wrap gap-4 md:gap-5">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="hover:cursor-pointer">
              {exampleStatuses.map((val, index) => (
                <SelectItem
                  className="hover:cursor-pointer"
                  value={val.name}
                  key={index}
                >
                  {val.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

         <div className="flex-1 min-w-[150px]">
          <label htmlFor="start-date" className="text-sm text-gray-500">
              Start Date
            </label>
         <Input
            className="flex-1 min-w-[150px]"
            type="date"
            placeholder="Start Date"
            onChange={(e) => {
              const dateValue = e.target.value
                ? new Date(e.target.value)
                : null;
              setStartDate(dateValue);
            }}
          />
         </div>

          <div className="flex-1 min-w-[150px]">
            <label htmlFor="end-date" className="text-sm text-gray-500">
              End Date
            </label>
            <Input
              id="end-date"
              type="date"
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value)
                  : null;
                setEndDate(dateValue);
              }}
            />
          </div>
        </div>

        <Input
          className="w-full"
          type="text"
          value={bugText}
          onChange={handleChange}
          placeholder="Describe the bug"
        />

        <div className="flex justify-center">
          {loading ? (
            <Loader2 className="animate-spin w-9 h-9 dark:text-white text-black" />
          ) : (
            <Button className="w-full md:w-auto" onClick={handleAddTask}>
              Track this
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBugs;
