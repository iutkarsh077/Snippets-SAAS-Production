"use client";
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import DialogCreateInterview from './_components/Dialog';

const Interviewer = () => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div className="flex mt-24 mx-10">
      <div>
        <div onClick={()=>setOpenDialog(!openDialog)} className='border-2 dark:border-white border-black border-dashed rounded-md hover:cursor-pointer h-80 w-52 flex flex-col justify-center items-center'>
           <Plus className='w-12 h-12  font-medium' />
           <p className='font-medium whitespace-pre-wrap'>Create an interview</p>
        </div>
      </div>
      {
        openDialog && (
          <DialogCreateInterview setOpenDialog={setOpenDialog}/>
        )
      }
    </div>
  )
}

export default Interviewer
