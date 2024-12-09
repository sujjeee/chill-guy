"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"
import { type Accept, useDropzone } from "react-dropzone"
import { Canvas } from "fabric"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { useWindow } from "@/hooks/use-window"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
// import { ScrollArea } from "./ui/scroll-area"
import { otherFonts, recommendedFonts } from "@/lib/constants"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { selectedTextPropertiesProps } from "@/hooks/use-fabric"
import { AnimatePresence, motion } from "framer-motion"

interface ToolbarProps {
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>
  addText: () => void
  addChillGuy: () => void
  changeFontFamily: (fontFamily: string) => void
  changeTextColor: (color: string) => void
  flipImage: (direction: "horizontal" | "vertical") => void
  deleteSelectedObject: () => void
  downloadCanvas: () => void
  downloadPDF: () => void
  changeBackgroundColor: (color: string) => void
  currentBackgroundColor: string
  selectedTextProperties: selectedTextPropertiesProps
  toggleFilter: () => void
  isImageSelected: boolean
}

export function Toolbar({
  setBackgroundImage,
  addText,
  changeFontFamily,
  changeTextColor,
  addChillGuy,
  flipImage,
  deleteSelectedObject,
  downloadCanvas,
  downloadPDF,
  changeBackgroundColor,
  currentBackgroundColor,
  selectedTextProperties,
  toggleFilter,
  isImageSelected,
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

  const { isMobile } = useWindow()

  return (
    <div className="max-w-[100vw] px-5">
      <div className="no-scrollbar w-full overflow-x-auto rounded-full border bg-white sm:overflow-visible">
        <div className="flex items-center space-x-2 p-2 text-2xl md:justify-center">
          <Button
            {...getRootProps()}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
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
                className="rounded-full hover:animate-jelly tooltip shrink-0 "
                style={{ backgroundColor: currentBackgroundColor }}
              >
                <span className="tooltiptext">Color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="mt-3 w-fit p-0 bg-transparent rounded-lg"
              align="start"
            >
              <HexColorPicker
                className="border-none"
                color={currentBackgroundColor}
                onChange={(color: string) => {
                  return changeBackgroundColor(color)
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            onClick={addChillGuy}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
          >
            <span className="tooltiptext">Chill Guy</span>
            <img
              src={`${process.env.NEXT_PUBLIC_APP_URL}/chillguy.png`}
              className="size-6"
            />
          </Button>
          <AnimatePresence>
            {isImageSelected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.09 } }}
                transition={{
                  duration: 0.1,
                  stiffness: 900,
                  type: "spring",
                  damping: 50,
                }}
                className="flex items-center space-x-2"
              >
                <Button
                  onClick={() => flipImage("horizontal")}
                  variant="outline"
                  size={"icon"}
                  className="rounded-full hover:animate-jelly tooltip shrink-0"
                >
                  <span className="tooltiptext">Flip</span>
                  <Icons.flip className="size-4" />
                </Button>
                <Button
                  onClick={() => toggleFilter()}
                  variant="outline"
                  size={"icon"}
                  className="rounded-full hover:animate-jelly tooltip shrink-0 "
                >
                  <Icons.filters className="size-4" />
                  <span className="tooltiptext">Filters</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            onClick={addText}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
          >
            <span className="tooltiptext">Text</span>
            <Icons.text className="size-4" />
          </Button>
          <AnimatePresence>
            {selectedTextProperties.isTextSelected && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.09 } }}
                transition={{
                  duration: 0.1,
                  stiffness: 900,
                  type: "spring",
                  damping: 50,
                }}
                className="flex items-center space-x-2"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size={"icon"}
                      className="rounded-full hover:animate-jelly tooltip shrink-0"
                    >
                      <span className="tooltiptext">Font Family</span>
                      <Icons.font className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="max-w-[200px] w-full p-0 h-[250px] rounded-lg"
                  >
                    <Command>
                      <CommandInput placeholder="Search font family" />
                      <CommandList className="hide_scrollbar">
                        <CommandEmpty>No font family found.</CommandEmpty>
                        <CommandGroup heading="Recommended">
                          {/* <ScrollArea className="h-[250px] w-full"> */}
                          {recommendedFonts.map((fontName) => {
                            return (
                              <CommandItem
                                key={fontName}
                                value={fontName}
                                className={cn("cursor-pointer")}
                                onSelect={(currentValue) => {
                                  changeFontFamily(currentValue)
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: `'${fontName}', sans-serif`,
                                  }}
                                >
                                  {fontName}
                                </span>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto size-4",
                                    fontName ===
                                      selectedTextProperties.fontFamily
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                        <CommandGroup heading="Others">
                          {/* <ScrollArea className="h-[250px] w-full"> */}
                          {otherFonts.map((fontName) => {
                            return (
                              <CommandItem
                                key={fontName}
                                value={fontName}
                                className={cn("cursor-pointer")}
                                onSelect={(currentValue) => {
                                  changeFontFamily(currentValue)
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: `'${fontName}', sans-serif`,
                                  }}
                                >
                                  {fontName}
                                </span>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto size-4",
                                    fontName ===
                                      selectedTextProperties.fontFamily
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            )
                          })}
                          {/* </ScrollArea> */}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size={"icon"}
                      className="rounded-full hover:animate-jelly tooltip shrink-0 "
                      style={{
                        backgroundColor: selectedTextProperties.fontColor,
                      }}
                    >
                      <span className="tooltiptext">Text Color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="mt-3 w-fit p-0 bg-transparent rounded-lg"
                    align="start"
                  >
                    <HexColorPicker
                      className="border-none"
                      color={selectedTextProperties.fontColor}
                      onChange={(color: string) => {
                        return changeTextColor(color)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            onClick={deleteSelectedObject}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
          >
            <span className="tooltiptext">Delete</span>
            <Icons.trash className="size-4 text-red-600" />
          </Button>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            onClick={downloadCanvas}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
          >
            <span className="tooltiptext">Download Image</span>
            <Icons.download className="size-4" />
          </Button>
          <div className="h-5">
            <div className="mx-1.5 h-full w-px bg-[#e5e5e5]"></div>
          </div>
          <Button
            onClick={downloadPDF}
            variant="outline"
            size={"icon"}
            className="rounded-full hover:animate-jelly tooltip shrink-0"
          >
            <span className="tooltiptext">Download PDF</span>
            <Icons.pdf className="size-4" />
          </Button>
          {isMobile && (
            <div className="h-5 invisible">
              <div className="h-full w-px bg-[#e5e5e5]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
