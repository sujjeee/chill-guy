import React from "react"
import { Canvas, FabricImage } from "fabric"
import * as fabric from "fabric"
import { useWindow } from "@/hooks/use-window"

const CANVAS_DIMENSIONS = { default: 500, mobileMultiplier: 0.9 }
const DEFAULT_BACKGROUND_COLOR = "#8d927b"
const DEFAULT_TEXT_OPTIONS = {
  text: "Your Text Here",
  fontSize: 40,
  fontFamily: "Impact",
  fill: "white",
  stroke: "black",
  strokeWidth: 1.5,
  textAlign: "center",
}

export function useFabric() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = React.useState<Canvas | null>(null)
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    React.useState<string>(DEFAULT_BACKGROUND_COLOR)

  const { isMobile, windowSize } = useWindow()

  React.useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMENSIONS.default,
      height: CANVAS_DIMENSIONS.default,
    })

    setCanvas(fabricCanvas)
    fabricCanvas.backgroundColor = currentBackgroundColor

    adjustCanvasSize(fabricCanvas, isMobile) // Initial size adjustment

    return () => {
      fabricCanvas.dispose()
    }
  }, [])

  React.useEffect(() => {
    if (canvas) {
      adjustCanvasSize(canvas, isMobile) // Adjust size on window resize
      canvas.renderAll()
    }
  }, [isMobile, windowSize.width, windowSize.height])

  function adjustCanvasSize(fabricCanvas: Canvas, isMobile: boolean) {
    const size = isMobile
      ? Math.min(
          windowSize.width! * CANVAS_DIMENSIONS.mobileMultiplier,
          CANVAS_DIMENSIONS.default,
        )
      : CANVAS_DIMENSIONS.default

    fabricCanvas.setDimensions({ width: size, height: size })
  }

  async function setBackgroundImage(imageUrl: string): Promise<Canvas | null> {
    if (!canvas) return null

    const img = await FabricImage.fromURL(imageUrl)
    if (!img) {
      alert("Failed to load image")
      return null
    }

    if (windowSize.width! > 768) {
      // Desktop: Adjust canvas width based on the image aspect ratio
      const imgWidth = (img.width! * CANVAS_DIMENSIONS.default) / img.height!
      canvas.setDimensions({
        width: imgWidth,
        height: CANVAS_DIMENSIONS.default,
      })
    } else {
      // Mobile: Adjust canvas dimensions to remain square or constrained
      const size = Math.min(
        windowSize.width! * CANVAS_DIMENSIONS.mobileMultiplier,

        CANVAS_DIMENSIONS.default,
      )

      canvas.setDimensions({ width: size, height: size })
    }

    // Scale the background image to cover the entire canvas
    const canvasWidth = canvas.width!
    const canvasHeight = canvas.height!
    const scaleX = canvasWidth / img.width!
    const scaleY = canvasHeight / img.height!
    const scale = Math.max(scaleX, scaleY)

    img.scale(scale)
    img.set({
      originX: "center",
      originY: "center",
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      objectCaching: false,
    })

    canvas.backgroundImage = img
    canvas.renderAll()

    return canvas
  }

  function addText() {
    if (!canvas) return

    const text = new fabric.Textbox(DEFAULT_TEXT_OPTIONS.text, {
      ...DEFAULT_TEXT_OPTIONS,
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      width: canvas.getWidth() * 0.8,
      originX: "center",
      originY: "center",
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    canvas.renderAll()
  }

  async function addChillGuy() {
    if (!canvas) return

    const imageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/chillguy.png`
    const img = await FabricImage.fromURL(imageUrl)

    if (!img) {
      console.error("Failed to load image")
      return
    }

    const { width, height } = canvas
    const scale = Math.min(
      (width! * 0.5) / img.width!,
      (height! * 0.5) / img.height!,
    )

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: width! / 2,
      top: height! / 2,
      originX: "center",
      originY: "center",
      selectable: true,
    })

    canvas.add(img)
    canvas.setActiveObject(img)
    canvas.renderAll()
  }

  function flipImage(direction: "horizontal" | "vertical") {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject && activeObject.type === "image") {
      const image = activeObject as fabric.Image
      direction === "horizontal"
        ? image.set("flipX", !image.flipX)
        : image.set("flipY", !image.flipY)

      canvas.renderAll()
    }
  }

  function deleteSelectedObject() {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.renderAll()
    }
  }

  function downloadCanvas() {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 3,
    })

    const link = document.createElement("a")
    link.href = dataURL
    link.download = "meme.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function changeBackgroundColor(color: string) {
    if (canvas) {
      setCurrentBackgroundColor(color)
      canvas.backgroundColor = color
      canvas.renderAll()
    }
  }

  return {
    canvasRef,
    setBackgroundImage,
    addText,
    addChillGuy,
    flipImage,
    changeBackgroundColor,
    currentBackgroundColor,
    deleteSelectedObject,
    downloadCanvas,
  }
}
