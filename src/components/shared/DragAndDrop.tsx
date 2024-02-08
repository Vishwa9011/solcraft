"use client";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { ComponentProps, useState } from 'react';

interface DragAndDropProps extends ComponentProps<'div'> {
  handleImg: (file: File) => void;
};

const DragAndDrop = ({ className, handleImg, ...rest }: DragAndDropProps) => {

  const [image, setImage] = useState("")
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    handleImg(file);
    console.log('file: ', file);
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
    console.log('drag enter');
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    console.log('drag leave');
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOver) setDragOver(true);
    console.log('drag over');
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files[0];
    console.log('files: ', files);
    setImage(URL.createObjectURL(files));
    handleImg(files);

    console.log('files: ', files);
    console.log('drop');
  }


  return (
    <div className={cn(className, "border-2 border-dashed rounded-lg border-gray-500")} {...rest}>
      {
        image ?
          <div className='flex w-full flex-1 h-full justify-center items-center'>
            <Image src={image} alt="image" width={100} height={100} className="object-cover object-center m-auto" />
          </div>
          :
          <div className="w-full h-full flex flex-col items-center justify-center gap-2" onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
            <Image src={"/assets/icons/upload.svg"} width={50} height={50} alt='upload' />
            <div className="text-gray-400">
              <p className="text-sm font-semibold">Drag photo here</p>
              <p>SVG, PNG, JPG</p>
            </div>
            <label className='btn btn-primary gray-200 relative py-2 px-8 overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-lg hover:before:left-0'>
              Select from device
              <input type="file" className="hidden" onChange={handleChange} />
            </label>
          </div>
      }
    </div>
  );
}

export default DragAndDrop;