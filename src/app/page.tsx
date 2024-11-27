"use client"

import { Toolbar } from "@/components/toolbar"
import { useFabric } from "@/hooks/use-fabric"

export default function HomePage() {
  const {
    parentDivRef,
    canvasDimensions,
    setBackgroundImage,
    addText,
    addChillGuy,
    flipImage,
  } = useFabric()

  return (
    <>
      <div className="fixed left-0 top-0 -z-10  h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <section className="flex-1 container fixed left-1/2 top-1/2 flex  -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-4 w-full">
        <div
          ref={parentDivRef}
          className="h-[500px] bg-white border rounded-2xl overflow-hidden"
          style={{ width: canvasDimensions.width }}
        >
          <canvas id="canvas"></canvas>
        </div>
      </section>

      <Toolbar
        setBackgroundImage={setBackgroundImage}
        addText={addText}
        addChillGuy={addChillGuy}
        flipImage={flipImage}
      />
    </>
  )
}
