"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  label?: string
  value?: string
  onChange: (imageData: string) => void
  disabled?: boolean
}

export function ImageUpload({ label = "Product Image", value, onChange, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      processFile(imageFile)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)

    // Converter para base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setPreview(base64String)
      onChange(base64String)
      setIsUploading(false)
    }
    reader.onerror = () => {
      alert("Error reading file")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview ? (
        // Preview mode
        <div className="relative group">
          <div className="aspect-square w-full max-w-md rounded-lg overflow-hidden border-2 border-border bg-muted">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClick}
              disabled={disabled || isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        // Upload mode
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            aspect-square w-full max-w-md rounded-lg border-2 border-dashed
            transition-all cursor-pointer
            ${isDragging ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            flex flex-col items-center justify-center gap-4 p-8
            ${isUploading ? "animate-pulse" : ""}
          `}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">
                  {isDragging ? "Drop image here" : "Drag & drop image here"}
                </p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
              </div>
              <Button type="button" variant="secondary" size="sm" disabled={disabled}>
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <p className="text-xs text-muted-foreground">
        Image will be stored as base64. For production, consider using a CDN like Cloudinary or AWS S3.
      </p>
    </div>
  )
}
