"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected?: (file: File) => void;
  className?: string;
}

export default function ImageUpload({ onImageSelected, className = "" }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.includes("image")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div
        className={`relative group flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${
            dragActive
              ? "border-rose-gold-400 bg-rose-gold-500/10 scale-[1.02] shadow-[0_0_40px_rgba(201,151,59,0.15)]"
              : preview 
                ? "border-transparent bg-dark-900" 
                : "border-dark-700 bg-dark-800 hover:border-rose-gold-400 hover:bg-dark-800/80 hover:shadow-[0_8px_30px_rgba(201,151,59,0.08)]"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={removeImage}
                className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-xl transition-all hover:scale-110 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Background glowing glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-rose-gold-500/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 
              ${dragActive ? 'bg-rose-gold-500 text-white scale-110' : 'bg-dark-700 text-rose-gold-400 group-hover:bg-rose-gold-500/20 group-hover:scale-110'}
            `}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-dark-50 mb-2 text-center group-hover:text-rose-gold-300 transition-colors">
              Upload or drag and drop image
            </h3>
            
            <p className="text-sm text-dark-400 text-center flex items-center gap-2">
              <ImageIcon className="w-4 h-4 opacity-50" />
              Format should be PNG or JPG
            </p>

            <div className="mt-6">
              <span className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-dark-900 text-xs font-semibold text-dark-200 border border-dark-700 group-hover:border-rose-gold-500/50 group-hover:text-rose-gold-400 transition-all shadow-sm">
                Browse Files
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
