import { useCallback, useEffect, useState } from "react"
import { fabric } from "fabric"

export const useFabricCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  const initCanvas = useCallback(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        backgroundColor: "#f0f0f0",
        renderOnAddRemove: false,
        stateful: false,
      })
      fabricCanvas.selection = false
      setCanvas(fabricCanvas)

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [canvasRef])

  useEffect(() => {
    const cleanup = initCanvas()
    return cleanup
  }, [initCanvas])

  const addObjectWithBoundaryCheck = useCallback(
    (obj: fabric.Object) => {
      if (!canvas) return

      obj.setCoords()

      const canvasWidth = canvas.width ?? 500
      const canvasHeight = canvas.height ?? 500

      obj.on("moving", () => {
        const objWidth = obj.getScaledWidth()
        const objHeight = obj.getScaledHeight()

        obj.left = Math.min(Math.max(obj.left ?? 0, 0), canvasWidth - objWidth)
        obj.top = Math.min(Math.max(obj.top ?? 0, 0), canvasHeight - objHeight)
      })

      canvas.add(obj)
      canvas.requestRenderAll()
    },
    [canvas],
  )

  const addText = useCallback(
    (text: string, fontSize: number) => {
      if (canvas) {
        const fabricText = new fabric.Textbox(text, {
          left: 50,
          top: 50,
          fontSize: fontSize,
          fill: "black",
          width: 400,
          breakWords: true,
        })

        addObjectWithBoundaryCheck(fabricText)
      }
    },
    [canvas, addObjectWithBoundaryCheck],
  )

  const changeFontSize = useCallback(
    (newSize: number) => {
      const activeObject = canvas?.getActiveObject()
      if (activeObject && activeObject.type === "textbox") {
        activeObject.set("fontSize", newSize)
        canvas?.requestRenderAll()
      }
    },
    [canvas],
  )

  const addImage = useCallback(
    (file: File) => {
      if (canvas) {
        const reader = new FileReader()
        reader.onload = (f) => {
          const data = f.target?.result
          fabric.Image.fromURL(
            data as string,
            (img) => {
              img.scaleToWidth(200)
              addObjectWithBoundaryCheck(img)
            },
            { crossOrigin: "anonymous" },
          )
        }
        reader.readAsDataURL(file)
      }
    },
    [canvas, addObjectWithBoundaryCheck],
  )

  useEffect(() => {
    if (canvas) {
      canvas.on("object:moving", () => {
        canvas.requestRenderAll()
      })
      canvas.on("object:scaling", () => {
        canvas.requestRenderAll()
      })
    }
  }, [canvas])

  return { canvas, addText, changeFontSize, addImage }
}
