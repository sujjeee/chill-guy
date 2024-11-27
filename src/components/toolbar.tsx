"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { type Accept, useDropzone } from "react-dropzone"
import { Canvas } from "fabric"

interface ToolbarProps {
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>
  addText: () => void
  addChillGuy: () => void
  flipImage: (direction: "horizontal" | "vertical") => void
  deleteSelectedObject: () => void
  changeBackgroundColor: () => void
  currentBackgroundColor: string
}

export function Toolbar({
  setBackgroundImage,
  addText,
  addChillGuy,
  flipImage,
  deleteSelectedObject,
  changeBackgroundColor,
  currentBackgroundColor,
}: ToolbarProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const dataUrl = URL.createObjectURL(acceptedFiles[0])
        setBackgroundImage(dataUrl).catch((error) => {
          console.error("Error setting background image:", error)
        })
      }
    },
    [setBackgroundImage],
  )

  const accept: Accept = {
    "image/*": [".jpg", ".jpeg", ".png"],
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  })

  return (
    <div className="max-w-[100vw] px-5">
      <div className="no-scrollbar w-full overflow-x-auto rounded-full border bg-white sm:overflow-visible">
        <div className="flex items-center space-x-2 p-2 text-2xl md:justify-center">
          <Button
            {...getRootProps()}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <input {...getInputProps()} />
            <Icons.background className="size-4" />
          </Button>
          <Button
            onClick={changeBackgroundColor}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
            style={{ backgroundColor: currentBackgroundColor }}
          ></Button>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>

          <Button
            onClick={addChillGuy}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <img src="http://localhost:3000/chillguy.png" className="size-6" />
          </Button>

          <Button
            onClick={() => flipImage("horizontal")}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <Icons.flip className="size-4" />
          </Button>

          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>

          <Button
            onClick={addText}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <Icons.text className="size-4" />
          </Button>

          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>

          <Button
            onClick={deleteSelectedObject}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <Icons.trash className="size-4 text-red-600" />
          </Button>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly"
          >
            <Icons.download className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
