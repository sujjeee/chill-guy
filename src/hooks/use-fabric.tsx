import React from "react"
import { Canvas, FabricImage } from "fabric"
import jsPDF from 'jspdf';
import * as fabric from "fabric"
import { useWindow } from "@/hooks/use-window"
import { filterNames, getFilter } from "@/lib/constants"

const CANVAS_DIMENSIONS = { default: 500, mobileMultiplier: 0.9 }
const DEFAULT_BACKGROUND_COLOR = "#8d927b"
const DEFAULT_FONT_COLOR = "#000000"
const DEFAULT_FONT_FAMILY = "Impact"
const DEFAULT_TEXT_OPTIONS = {
  text: "Your Text Here",
  fontSize: 40,
  fontFamily: DEFAULT_FONT_FAMILY,
  fill: DEFAULT_FONT_COLOR,
  // stroke: "black",
  // strokeWidth: 1.5,
  textAlign: "center",
}

export interface selectedTextPropertiesProps {
  fontFamily: string
  fontColor: string
  isTextSelected: boolean
}

export function useFabric() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = React.useState<Canvas | null>(null)
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    React.useState<string>(DEFAULT_BACKGROUND_COLOR)
  const [selectedTextProperties, setSelectedTextProperties] =
    React.useState<selectedTextPropertiesProps>({
      fontFamily: DEFAULT_FONT_FAMILY,
      fontColor: DEFAULT_FONT_COLOR,
      isTextSelected: false,
    })
  const [isImageSelected, setIsImageSelected] = React.useState<boolean>(false)
  const [currentFilterIndex, setCurrentFilterIndex] = React.useState<number>(0)
  const { isMobile, windowSize } = useWindow()

  React.useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMENSIONS.default,
      height: CANVAS_DIMENSIONS.default,
    })

    setCanvas(fabricCanvas)
    fabricCanvas.backgroundColor = currentBackgroundColor

    // Add a listener for when an object is added to the canvas
    fabricCanvas.on("object:added", (e) => {
      const object = e.target
      if (object) {
        object.set({
          cornerColor: "#FFF",
          cornerStyle: "circle",
          borderColor: "#8a4fec",
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 1,
          cornerStrokeColor: "#8a4fec",
        })

        // TODO: MAKE IT MORE LIKE CANVA SELECTOR

        // Define custom controls
        // object.controls = {
        //   ...object.controls,
        //   mtr: new fabric.Control({
        //     x: 0,
        //     y: -0.58,
        //     offsetY: -30,
        //     cursorStyle: "grab",
        //     actionName: "rotate",
        //     actionHandler: fabric.controlsUtils.rotationWithSnapping,
        //   }),
        // }

        fabricCanvas.renderAll()
      }
    })

    // Add listeners for object selection and deselection
    const updateSelectedProperties = () => {
      const activeObject = fabricCanvas.getActiveObject()

      if (activeObject && activeObject.type === "textbox") {
        setSelectedTextProperties({
          fontFamily: activeObject.get("fontFamily") as string,
          fontColor: activeObject.get("fill") as string,
          isTextSelected: true,
        })
      } else {
        setSelectedTextProperties({
          fontFamily: DEFAULT_FONT_FAMILY,
          fontColor: DEFAULT_FONT_COLOR,
          isTextSelected: false,
        })
      }

      // Update image selection state
      if (activeObject && activeObject.type === "image") {
        setIsImageSelected(true)
      } else {
        setIsImageSelected(false)
      }
    }

    // Listen to multiple events that might change selection
    fabricCanvas.on("selection:created", updateSelectedProperties)
    fabricCanvas.on("selection:updated", updateSelectedProperties)
    fabricCanvas.on("selection:cleared", updateSelectedProperties)

    // Add a listener for object modifications
    fabricCanvas.on("object:modified", updateSelectedProperties)

    adjustCanvasSize(fabricCanvas, isMobile) // Initial size adjustment

    return () => {
      // Remove event listeners
      fabricCanvas.off("selection:created", updateSelectedProperties)
      fabricCanvas.off("selection:updated", updateSelectedProperties)
      fabricCanvas.off("selection:cleared", updateSelectedProperties)
      fabricCanvas.off("object:modified", updateSelectedProperties)
      fabricCanvas.dispose()
    }
  }, [])

  React.useEffect(() => {
    if (canvas) {
      adjustCanvasSize(canvas, isMobile) // Adjust size on window resize
      canvas.renderAll()
    }
  }, [isMobile, windowSize.width, windowSize.height])

  React.useEffect(() => {
    if (!canvas) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && canvas.getActiveObject()) {
        deleteSelectedObject()
      }
    }

    // Add event listener to the window
    window.addEventListener("keydown", handleKeyDown)

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [canvas, deleteSelectedObject])

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

  function changeFontFamily(fontFamily: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as fabric.Textbox
      text.set("fontFamily", fontFamily)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontFamily: fontFamily,
      }))

      canvas.renderAll()
    }
  }

  function changeTextColor(color: string) {
    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as fabric.Textbox
      text.set("fill", color)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontColor: color,
      }))

      canvas.renderAll()
    }
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

  function toggleFilter() {
    // Move to the next filter in the list
    const nextIndex = (currentFilterIndex + 1) % filterNames.length
    setCurrentFilterIndex(nextIndex)

    // Determine the next filter
    const nextFilter = filterNames[nextIndex]

    if (!canvas) return

    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "image") {
      const image = activeObject as FabricImage
      const filter = getFilter(nextFilter)

      image.filters = filter ? [filter] : []
      image.applyFilters()
      ;(image as any).filterName = nextFilter
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

  function downloadPDF() {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Create a temporary high-resolution canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Set the temporary canvas to 2x the original size for higher quality
    const scale = 2;
    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;

    // Scale and draw the original canvas onto the temporary canvas
    tempCtx.scale(scale, scale);
    tempCtx.drawImage(canvas, 0, 0);

    // Get the high-quality image data
    const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);

    // Create a new jsPDF instance with the same aspect ratio as the canvas
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // Add the high-quality image to the PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, '', 'FAST');

    // Save the PDF with better compression
    pdf.save("meme.pdf", { compress: false });
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
    changeFontFamily,
    changeTextColor,
    flipImage,
    changeBackgroundColor,
    currentBackgroundColor,
    deleteSelectedObject,
    downloadCanvas,
    downloadPDF,
    selectedTextProperties,
    toggleFilter,
    isImageSelected,
  }
}
