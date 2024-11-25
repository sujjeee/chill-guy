"use client"

import { useRef } from "react"

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <canvas
      ref={canvasRef}
      className="rounded-lg bg-red-600 w-full max-w-[800px] border-border "
    />
  )
}
