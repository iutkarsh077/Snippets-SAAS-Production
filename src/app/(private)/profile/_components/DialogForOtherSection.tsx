"use client";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bolt } from "lucide-react";
import { useState } from "react";
import { SaveUserOtherData } from "../../../../../actions/SaveUserOtherData";

export default function DialogForOtherSections({
  dialogOpen,
  setDialogOpen,
}: {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [badges, setBadges] = useState<string[]>([]);
  const [inputValues, setInputValues] = useState("");
  const [workplace, setWorkPlace] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && inputValues.trim()) {
      e.preventDefault();
      addBadge(inputValues);
    }
  };

  const addBadge = (badge: string) => {
    if (!badges?.includes(badge)) {
      setBadges([...badges, badge]);
    }

    setInputValues("");
  };

  const removeBadge = (badgeToRemove: string) => {
    setBadges(badges.filter((badge) => badge !== badgeToRemove));
  };

  const handleSave = async () => {
    try {
      const data = {
        location,
        workplace,
        about,
        badges,
      };
      const res = await SaveUserOtherData(data);
      if (res.status === false) {
        throw new Error(res.msg);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Bolt className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workplace" className="text-right">
              Workplace
            </Label>
            <Input
              id="workplace"
              onChange={(e) => setWorkPlace(e.target.value)}
              placeholder="School Industry etc"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="badges" className="text-right">
              Highlights
            </Label>
            <Input
              id="highlights"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
            />
          </div>
          <div className="badges space-x-3">
            {badges.map((badge, index) => (
              <span key={index} className="badge">
                {badge}
                <button className="ml-1" onClick={() => removeBadge(badge)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="about" className="text-right">
              About
            </Label>
            <textarea
              id="about"
              onChange={(e) => setAbout(e.target.value)}
              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </motion.div>
        <motion.div
          onClick={handleSave}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex justify-end"
        >
          <Button type="submit" onClick={() => setDialogOpen(false)}>
            Save changes
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
