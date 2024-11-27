import React from "react"
import { Canvas, FabricImage } from "fabric"
import * as fabric from "fabric"

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

  async function addText() {
    const canvas = canvasRef.current

    if (!canvas) {
      console.error("Canvas is not initialized")
      return
    }

    const memeText = new fabric.Textbox("Your Meme Text Here", {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
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

    const imageUrl =
      "https://i.ibb.co/XzgSxdY/6032aebb-0624-460c-a8cb-aa2df3e7de28.png"

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
      const maxWidth = canvasWidth * 0.8 // Reduce the size to 80% of the canvas width
      const maxHeight = canvasHeight * 0.8 // Reduce the size to 80% of the canvas height
      const scaleX = maxWidth / img.width!
      const scaleY = maxHeight / img.height!
      const scale = Math.min(scaleX, scaleY) // Choose the smaller scale to maintain aspect ratio

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: canvasWidth / 2, // Center horizontally
        top: canvasHeight / 2, // Center vertically
        originX: "center", // Center the origin horizontally
        originY: "center", // Center the origin vertically
        selectable: true, // Allow users to resize and drag
      })

      // Add the image to the canvas
      canvas.add(img)
      canvas.setActiveObject(img) // Set the image as the active object
      canvas.renderAll() // Re-render the canvas

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

  return {
    canvasRef,
    parentDivRef,
    canvasDimensions,
    setBackgroundImage,
    addText,
    addChillGuy,
    flipImage,
  }
}
