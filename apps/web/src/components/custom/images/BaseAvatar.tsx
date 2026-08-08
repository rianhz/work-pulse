"use client";

import { useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { UserCircle } from "lucide-react";
import { UniversalUploader } from "../uploader/ImageUploader";

interface BaseAvatarProps {
  src?: string;
  alt?: string;
  fallbackInitials?: string;
  fallbackImage?: React.ReactNode;
  className?: string;
  priority?: boolean;
  imageLoading?: "lazy" | "eager";
  isEditable?: boolean;
  onUploadSuccess?: (url: string) => void;
  folderName?: string;
  editText?: string;
}

export default function BaseAvatar({
  src,
  alt,
  fallbackInitials,
  fallbackImage = <UserCircle size={100} className="text-muted-foreground" />,
  className = "",
  priority = false,
  imageLoading = "lazy",
  isEditable = false,
  onUploadSuccess,
  folderName = "work-pulse",
  editText = "Change",
}: BaseAvatarProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const editOverlay = isEditable && (
    <div 
      onClick={(e) => {
        e.stopPropagation(); 
        setIsUploaderOpen(true);
      }}
      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10"
    >
      <span className="select-none px-1 text-center text-[10px] font-medium leading-tight text-white">
        {editText}
      </span>
    </div>
  );

  const renderFallback = () => {
    if (!src || error) {
      return (
        /* Added overflow-hidden here so fallback background + overlay honor parent's rounding */
        <div className={`group relative flex items-center justify-center bg-muted overflow-hidden ${className}`}>
          {fallbackInitials ? (
            <span className="text-4xl font-bold text-muted-foreground select-none">
              {fallbackInitials}
            </span>
          ) : (
            fallbackImage
          )}
          {editOverlay}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* 1. Avatar Graphic Shell */}
      {(!src || error) ? (
        renderFallback()
      ) : (
        /* Added overflow-hidden here so Next.js Image + overlay honor parent's rounding */
        <div className={`group relative overflow-hidden border border-muted ${className}`}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Spinner />
            </div>
          )}

          <Image
            src={src}
            alt={alt || ""}
            fill
            priority={priority}
            sizes="(max-width: 768px) 96px, 96px"
            className={`object-cover transition-opacity duration-300 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
            loading={imageLoading}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          
          {editOverlay}
        </div>
      )}

      {/* 2. Embedded Popup Uploader */}
      {isEditable && (
        <UniversalUploader
          variant="popup"
          isOpen={isUploaderOpen}
          folderName={folderName}
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={(url) => {
            onUploadSuccess?.(url);
          }}
        />
      )}
    </>
  );
}