"use client"

import React, { useEffect, useRef, useState } from "react"
import { Canvas, Circle, FabricImage } from "fabric"

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current)
      setCanvas(fabricCanvas)

      const resizeCanvas = () => {
        if (window.innerWidth > 768) {
          // Larger screen - make the canvas square initially (500px)
          fabricCanvas.setDimensions({ width: 500, height: 500 })
          // Adjust dimensions if background image is available
          if (fabricCanvas.backgroundImage) {
            const img = fabricCanvas.backgroundImage as FabricImage
            const imgWidth = (img.width! * 500) / img.height!
            fabricCanvas.setDimensions({ width: imgWidth, height: 500 })
          }
        } else {
          // Smaller screen - make the canvas square
          const size = Math.min(window.innerWidth * 0.9, 500)
          fabricCanvas.setDimensions({ width: size, height: size })
        }
        fabricCanvas.renderAll()
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      return () => {
        fabricCanvas.dispose()
        window.removeEventListener("resize", resizeCanvas)
      }
    }
  }, [])

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        radius: 30,
        fill: getRandomColor(),
        left: Math.random() * (canvas.width! - 60) + 30,
        top: Math.random() * (canvas.height! - 60) + 30,
      })
      canvas.add(circle)
    }
  }

  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }

  const handleBackgroundImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file && canvas) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        FabricImage.fromURL(imageUrl).then((img) => {
          // Set canvas dimensions based on the image aspect ratio
          if (window.innerWidth > 768) {
            const imgWidth = (img.width! * 500) / img.height!
            canvas.setDimensions({ width: imgWidth, height: 500 })
          } else {
            const size = Math.min(window.innerWidth * 0.9, 500)
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
          })

          canvas.backgroundImage = img
          canvas.renderAll()
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg shadow-lg"
      />
      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={addCircle}
          className="mb-4 p-2 border text-white bg-black rounded-2xl"
        >
          Add Circle
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundImageChange}
          className="mb-4 p-2 border rounded-2xl"
        />
      </div>
    </div>
  )
}

export default FabricCanvas
