"use client"

import { Toolbar } from "@/components/toolbar"
import { bgColors, useFabric } from "@/hooks/use-fabric"

export default function HomePage() {
  const {
    parentDivRef,
    canvasDimensions,
    setBackgroundImage,
    addText,
    addChillGuy,
    flipImage,
    deleteSelectedObject,
    downloadCanvas,
    changeBackgroundColor,
    currentBackgroundColor,
  } = useFabric()

  return (
    <>
      <div className="px-2 space-y-10 min-h-screen items-center h-full flex-col flex justify-between">
        <div></div>
        <div
          ref={parentDivRef}
          className="h-[500px] border rounded-3xl overflow-hidden w-full"
          style={{
            maxWidth: canvasDimensions.width,
            backgroundColor: currentBackgroundColor,
          }}
        >
          <canvas id="canvas"></canvas>
        </div>
        <div className="pt-10 pb-8 space-y-5 flex items-center flex-col">
          <Toolbar
            setBackgroundImage={setBackgroundImage}
            addText={addText}
            addChillGuy={addChillGuy}
            flipImage={flipImage}
            deleteSelectedObject={deleteSelectedObject}
            downloadCanvas={downloadCanvas}
            changeBackgroundColor={changeBackgroundColor}
            currentBackgroundColor={currentBackgroundColor}
          />
          <div className="flex flex-col justify-center text-center items-center text-sm md:flex-row">
            <a
              className="text-balance leading-loose text-muted-foreground  font-medium hover:text-blue-700"
              href="https://x.com/intent/follow?screen_name=sujjeeee"
              target="_blank"
            >
              Built by Sujjeee
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
