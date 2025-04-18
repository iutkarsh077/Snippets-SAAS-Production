"use client";
import { useState } from "react";
import CodeCard from "./_components/CodeInput";
import SearchLanguage from "./_components/Searchlanguage";

import DescriptionBox from "./_components/DescriptionForUpload";

const UploadSnippets = () => {
    const [lang, setLang] = useState("");
    const [code, setCode] = useState("")
    const [description, setDescription] = useState("");
    const [showCodeCard, setShowCodeCard] = useState(true);
    const [showSearchLanguage, setShowSearchLanguage] = useState(false);
    const [showDescriptionBox, setshowDescriptionBox] = useState(false);

  return (
    <div className="flex flex-col items-center w-full ml-2 pr-2 xl:ml-0 xl:pr-0 mt-20">
        <div className={`${showCodeCard === true ? "block" : "hidden"} w-full flex justify-center`}><CodeCard code={code} setCode={setCode} setShowCodeCard={setShowCodeCard} setShowSearchLanguage={setShowSearchLanguage}/></div>
        <div className={`${showSearchLanguage === true ? "block" : "hidden"} w-full`}><SearchLanguage lang={lang} setLang={setLang} setShowSearchLanguage={setShowSearchLanguage} setshowDescriptionBox={setshowDescriptionBox}/></div>
        
        <div className={`${showDescriptionBox === true ? "block" : "hidden"} w-full`}><DescriptionBox setDescription={setDescription} language={lang} code={code}/></div>
      </div>
  )
}

export default UploadSnippets
