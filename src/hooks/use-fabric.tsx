import React from "react"
import { Canvas, FabricImage } from "fabric"

export function useFabric() {
  const canvasRef = React.useRef<Canvas | null>(null)
  const parentDivRef = React.useRef<HTMLDivElement | null>(null)

  const [canvasDimensions, setCanvasDimensions] = React.useState({
    width: 500,
    height: 500,
  })

  React.useEffect(() => {
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement

    if (!canvasElement) {
      console.log("Canvas element not found!")
      return
    }

    const canvas = new Canvas(canvasElement, {
      height: 500,
      width: 500,
    })

    canvasRef.current = canvas

    return () => {
      canvas.dispose()
    }
  }, [])

  async function setBackgroundImage(imageUrl: string): Promise<Canvas | null> {
    const canvas = canvasRef.current
    const parentDiv = parentDivRef.current

    if (!canvas || !parentDiv) {
      console.error("Canvas or parent div is not initialized")
      return null
    }

    try {
      const img = await FabricImage.fromURL(imageUrl)

      if (!img) {
        alert("Failed to load image")
        return null
      }

      const aspectRatio = img.width! / img.height!
      const newWidth = 500 * aspectRatio

      parentDiv.style.width = `${newWidth}px`

      canvas.setDimensions({ width: newWidth, height: 500 })

      img.set({
        scaleX: newWidth / img.width!,
        scaleY: 500 / img.height!,
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
      })

      canvas.backgroundImage = img
      canvas.renderAll()

      setCanvasDimensions({
        width: newWidth,
        height: 500,
      })

      return canvas
    } catch (error) {
      console.error("Error setting background image:", error)
      return null
    }
  }

  return {
    canvasRef,
    parentDivRef,
    canvasDimensions,
    setBackgroundImage,
  }
}
