"use client"

import { ImageIcon, TextCursorIcon } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"

export function Toolbar() {
  return (
    <footer className="fixed bottom-10 w-full">
      <div className="mx-auto flex items-center justify-center gap-4">
        <Button variant="outline" size="icon">
          <ImageIcon />
        </Button>
        <Button variant="outline" size="icon">
          <TextCursorIcon />
        </Button>
      </div>
    </footer>
  )
}
