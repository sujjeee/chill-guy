import React from "react"
import { Canvas, FabricImage } from "fabric"
import * as fabric from "fabric"

export const bgColors = [
  "#8d927b",
  "#a0b0c0",
  "#c0a0b0",
  "#b0c0a0",
  "#a0c0b0",
  "#b0a0c0",
  "#c0b0a0",
]

export function useFabric() {
  const canvasRef = React.useRef<Canvas | null>(null)
  const parentDivRef = React.useRef<HTMLDivElement | null>(null)
  const [currentColorIndex, setCurrentColorIndex] = React.useState(0)

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

    canvas.backgroundColor = bgColors[0]
    canvas.renderAll()

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

  function changeBackgroundColor() {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const nextIndex = (currentColorIndex + 1) % bgColors.length
    const nextColor = bgColors[nextIndex]

    canvas.backgroundColor = nextColor
    canvas.renderAll()

    setCurrentColorIndex(nextIndex)
  }

  async function addText() {
    const canvas = canvasRef.current

    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const memeText = new fabric.Textbox("Your Meme Text Here", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      width: canvas.getWidth() * 0.8,
      fontSize: 40,
      fontFamily: "Impact",
      fill: "white",
      stroke: "black",
      strokeWidth: 1.5,
      textAlign: "center",
      originX: "center",
      originY: "center",
      editable: true,
    })

    canvas.add(memeText)
    canvas.setActiveObject(memeText)
    canvas.renderAll()
  }

  async function addChillGuy() {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const imageUrl = "http://localhost:3000/chillguy.png"

    try {
      const img = await FabricImage.fromURL(imageUrl)

      if (!img) {
        console.error("Failed to load image")
        return
      }

      // Get canvas dimensions
      const canvasWidth = canvas.getWidth()
      const canvasHeight = canvas.getHeight()

      // Scale the image to fit within the canvas (with padding)
      const maxWidth = canvasWidth * 0.5
      const maxHeight = canvasHeight * 0.5
      const scaleX = maxWidth / img.width!
      const scaleY = maxHeight / img.height!
      const scale = Math.min(scaleX, scaleY)

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
        selectable: true,
      })

      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()

      console.log("Image added to canvas in the center")
    } catch (error) {
      console.error("Error adding image to canvas:", error)
    }
  }

  function flipImage(direction: "horizontal" | "vertical") {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "image") {
      const image = activeObject as fabric.Image

      // Toggle flipX or flipY based on direction
      if (direction === "horizontal") {
        image.set("flipX", !image.flipX)
      } else if (direction === "vertical") {
        image.set("flipY", !image.flipY)
      }

      // Re-render the canvas
      canvas.renderAll()

      console.log(`Image flipped ${direction}`)
    } else {
      console.warn("No image object selected to flip")
    }
  }

  function deleteSelectedObject() {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      // If an object is selected
      canvas.remove(activeObject)
      canvas.discardActiveObject()
      canvas.renderAll()
      console.log("Selected object deleted")
    } else {
      console.warn("No object selected to delete")
    }
  }

  return {
    canvasRef,
    parentDivRef,
    canvasDimensions,
    setBackgroundImage,
    addText,
    addChillGuy,
    flipImage,
    changeBackgroundColor,
    currentBackgroundColor: bgColors[currentColorIndex],
    deleteSelectedObject,
  }
}
