"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomDialog from "./_components/CustomDialog";
import CustomDialogForProfileImage from "./_components/CustomDialogProfileImage";
import DialogForOtherSections from "./_components/DialogForOtherSection";
import CodeCard from "@/app/(home)/_components/Card";
import { SnippetType } from "@/app/snippets/page";
import { GetUserDetailsInProfile } from "../../../../actions/GetUserDetailsInProfile";
import { LogoutUser } from "../../../../actions/LogoutUser";
import { GetPostForProfile } from "../../../../actions/GetParticularUserPost";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenforCover, setIsOpenForCover] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workplace, setWorkplace] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [badges, setBadges] = useState<any[]>();
  const [userName, setUsername] = useState("");
  const [snippets, setSnippets] = useState<SnippetType[] | null>(null);
  const [clickedReadMore, setClickedReadMore] = useState(false);
  const baseUrl = "https://snippets-saas-production.vercel.app";
  useEffect(() => {
    const getAllSnippetsForProfile = async () => {
      setLoading(true);
      const res = await GetPostForProfile();
      if (res && res.data) {
        setSnippets(res.data as any);
        // console.log(res);
      }
      setLoading(false);
    };
    getAllSnippetsForProfile();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const res = await GetUserDetailsInProfile();
        if (res.status === false) {
          throw new Error(res.msg);
        }
        // console.log(res);
        setProfileImage(res?.decodeCookieValue?.profileImage as string);
        setCoverImage(res?.decodeCookieValue?.backgroundImage as string);
        setName(res?.decodeCookieValue?.name as string);
        setWorkplace(res.decodeCookieValue?.workplace as string);
        setAbout(res.decodeCookieValue?.about as string);
        setLocation(res.decodeCookieValue?.location as string);
        setBadges(res.decodeCookieValue?.badges as string[]);
        setUsername(res.decodeCookieValue?.username as string);
      } catch (error) {
        // console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [dialogOpen]);

  const handleLogout = async () => {
    await LogoutUser();
    window.location.reload();
  };

  const handleCopyProfile = () => {
    const profile = `${baseUrl}/profile/${userName}`;
    navigator.clipboard.writeText(profile);
    // console.log(profile)
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-background mb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Banner Image */}
        <div className="h-48 overflow-hidden relative rounded-t-lg">
          <div className="absolute right-4 top-2">
            <CustomDialog
              isOpenforCover={isOpenforCover}
              setIsOpenForCover={setIsOpenForCover}
              setCoverImage={setCoverImage}
            />
          </div>
          <Image
            src={
              coverImage ||
              "https://coolbackgrounds.io/images/backgrounds/black/pure-black-background-f82588d3.jpg"
            }
            alt="Profile banner"
            width={768}
            height={192}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Picture */}
        <div className="relative flex -mt-16 mb-4 ml-3">
          <p className="absolute left-28 bottom-0">
            <CustomDialogForProfileImage
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setProfileImage={setProfileImage}
            />
          </p>
          <Image
            src={
              profileImage ||
              "https://coolbackgrounds.io/images/backgrounds/black/pure-black-background-f82588d3.jpg"
            }
            alt="Profile picture"
            width={150}
            height={400}
            className="rounded-full h-36 border-2 bg-black border-white"
          />
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-6"
        >
          {/* Profile Info */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{name || "Profile Name"}</h1>
              <p className="text-muted-foreground">{userName}</p>
              <p className="text-muted-foreground">{workplace}</p>
              <p className="text-sm text-muted-foreground mt-1">{location}</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-center gap-5 hover:cursor-pointer p-2 text-white rounded-md">
              <div className="flex flex-col sm:flex-row gap-y-3 sm:gap-x-5">
                {name && <Button onClick={handleLogout}>Logout</Button>}
                {name && <Button onClick={handleCopyProfile}>Share</Button>}
              </div>
              <DialogForOtherSections
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
              />
            </div>
          </div>

          {/* Skills */}
          <div className="flex gap-2 mb-6">
            {badges?.slice(0, 3).map((badge: any, index) => (
              <Badge variant="secondary" key={index}>
                {badge}
              </Badge>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* About Section */}
      {about.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg p-6 mt-4 xl:mx-6"
        >
          <h2 className="text-xl font-semibold mb-4">About Me</h2>
          <div className="space-y-4">
            {clickedReadMore ? (
              <p className="break-words">{about}</p>
            ) : (
              <p className="break-words">{about.slice(0, 400)}...</p>
            )}
          </div>
          {about.length >= 300 && (
            <Button
              onClick={() => setClickedReadMore(!clickedReadMore)}
              variant="ghost"
              className="mt-4"
            >
              {clickedReadMore ? "Read Less..." : "Read More..."}
            </Button>
          )}
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-x-6 gap-y-14 mx-3 mt-10  ">
        {snippets
          ?.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((snippet, index) => (
            <div key={index}>
              <CodeCard snippet={snippet} />
            </div>
          ))}
      </div>
    </div>
  );
}
