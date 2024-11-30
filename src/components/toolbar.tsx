"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { type Accept, useDropzone } from "react-dropzone"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover"
import { Canvas } from "fabric"
import { HexColorPicker } from "react-colorful"

interface ToolbarProps {
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>
  addText: () => void
  addChillGuy: () => void
  flipImage: (direction: "horizontal" | "vertical") => void
  deleteSelectedObject: () => void
  downloadCanvas: () => void
  changeBackgroundColor: (color: string) => void
  currentBackgroundColor: string
}

export function Toolbar({
  setBackgroundImage,
  addText,
  addChillGuy,
  flipImage,
  deleteSelectedObject,
  downloadCanvas,
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
    <div className="relative max-w-[100vw] px-5">
      <div className="no-scrollbar w-full overflow-x-auto rounded-full border bg-white sm:overflow-visible">
        <div className="flex items-center space-x-2 p-2 text-2xl md:justify-center">
          <Button
            {...getRootProps()}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Background</span>
            <input {...getInputProps()} />
            <Icons.background className="size-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size={"icon"}
                className="rounded-full hover:animate-jelly tooltip"
                style={{ backgroundColor: currentBackgroundColor }}
              >
                <span className="tooltiptext">Color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-3 w-fit p-0" align="start">
              <HexColorPicker
                color={currentBackgroundColor}
                onChange={(color: string) => {
                  return changeBackgroundColor(color)
                }}
              />
            </PopoverContent>
          </Popover>
          <Button
            onClick={addChillGuy}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Chill Guy</span>
            <img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/chillguy.png`}
              className="size-6"
            />
          </Button>
          <Button
            onClick={() => flipImage("horizontal")}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Flip</span>
            <Icons.flip className="size-4" />
          </Button>
          <Button
            onClick={addText}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Text</span>
            <Icons.text className="size-4" />
          </Button>
          <Button
            onClick={deleteSelectedObject}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Delete</span>
            <Icons.trash className="size-4 text-red-600" />
          </Button>
          <Button
            onClick={downloadCanvas}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip"
          >
            <span className="tooltiptext">Download</span>
            <Icons.download className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
