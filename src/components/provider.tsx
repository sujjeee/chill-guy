"use client"

import React, { createContext, useState, useCallback } from "react"
import { Canvas } from "fabric"

interface FabricContextType {
  canvas: Canvas | null
  initializeCanvas: (canvasElement: HTMLCanvasElement) => void
}

export const FabricContext = createContext<FabricContextType>({
  canvas: null,
  initializeCanvas: () => {},
})

export const FabricProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  const initializeCanvas = useCallback(
    (canvasElement: HTMLCanvasElement) => {
      // Dispose of existing canvas if it exists
      if (canvas) {
        canvas.dispose()
      }

      // Create new canvas
      const newCanvas = new Canvas(canvasElement, {
        height: 500,
        width: 500,
      })

      setCanvas(newCanvas)
    },
    [canvas],
  )

  return (
    <FabricContext.Provider value={{ canvas, initializeCanvas }}>
      {children}
    </FabricContext.Provider>
  )
}
