import { useRef, useEffect } from "react"
import { fabric } from "fabric"

export const useFabric = (canvasId: string) => {
  const canvasRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvasElement) {
      console.error("Canvas element not found")
      return
    }

    const canvas = new fabric.Canvas(canvasElement, {
      height: 500,
      width: 500,
    })

    canvasRef.current = canvas

    return () => {
      canvas.dispose()
    }
  }, [canvasId])

  const setBackgroundImage = async (imageUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    try {
      const img = await fabric.Image.fromURL(imageUrl)

      // Adjust canvas width dynamically based on image aspect ratio
      const aspectRatio = img.width! / img.height!
      const newWidth = 500 * aspectRatio

      canvas.setDimensions({ width: newWidth, height: 500 })

      img.set({
        scaleX: newWidth / img.width!,
        scaleY: 500 / img.height!,
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
      })

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
      // console.log("Background image set");
    } catch (error) {
      console.error("Error setting background image:", error)
    }
  }

  return { canvasRef, setBackgroundImage }
}
