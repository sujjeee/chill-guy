"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import { type Accept, useDropzone } from "react-dropzone";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { ChromePicker } from "react-color"; // Import ChromePicker
import { Canvas } from "fabric";

interface ToolbarProps {
  setBackgroundImage: (imageUrl: string) => Promise<Canvas | null>;
  addText: () => void;
  addChillGuy: () => void;
  flipImage: (direction: "horizontal" | "vertical") => void;
  deleteSelectedObject: () => void;
  downloadCanvas: () => void;
  changeBackgroundColor: (color: string) => void;
  currentBackgroundColor: string;
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
  const [showColorPicker, setShowColorPicker] = useState(false); // Toggle state
  const [customColor, setCustomColor] = useState(currentBackgroundColor);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const dataUrl = URL.createObjectURL(acceptedFiles[0]);
        setBackgroundImage(dataUrl).catch((error) => {
          console.error("Error setting background image:", error);
        });
      }
    },
    [setBackgroundImage]
  );

  const accept: Accept = {
    "image/*": [".jpg", ".jpeg", ".png"],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  const predefinedColors = [
    "#8d927b",
    "#a0b0c0",
    "#c0a0b0",
    "#b0c0a0",
    "#a0c0b0",
    "#b0a0c0",
    "#FFA500",
    "#c0b0a0",
  ];

  return (
    <div className="relative max-w-[100vw] px-5">
      {/* Toolbar Section */}
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

          {/* Popover for Color Palette */}
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
            <PopoverContent
              align="center"
              side="top"
              sideOffset={10}
              className="z-10 flex flex-col space-y-2 bg-white border rounded-lg shadow-lg p-3"
            >
              <div className="flex items-center space-x-2">
                {predefinedColors.map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full cursor-pointer border"
                    style={{ backgroundColor: color }}
                    onClick={() => changeBackgroundColor(color)}
                  />
                ))}

                <div
                  className="w-8 h-8 flex items-center justify-center border rounded-full cursor-pointer "
                  onClick={() => setShowColorPicker(!showColorPicker)} // Toggle state
                >
                  <Icons.plus className="size-4" />
                </div>
              </div>

              {/* Conditionally render the ChromePicker */}
              {showColorPicker && (
                <div className="mt-3 absolute bottom-0 -right-60">
                  <ChromePicker
                    color={customColor}
                    onChange={(color) => setCustomColor(color.hex)}
                    onChangeComplete={(color) => {
                      setCustomColor(color.hex);
                      changeBackgroundColor(color.hex);
                    }}
                  />
                </div>
              )}
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
  );
}
