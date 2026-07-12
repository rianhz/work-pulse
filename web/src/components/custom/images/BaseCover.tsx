"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontalIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { UniversalUploader } from "../uploader/ImageUploader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DEFAULT_COVER_IMAGE } from "@/helpers/constants";

interface BaseCoverProps {
  src?: string;
  alt?: string;
  className?: string; // Allows parent overrides (e.g., custom border-radius or heights)
  priority?: boolean;
  imageLoading?: "lazy" | "eager";
  isEditable?: boolean;
  onUploadSuccess?: (url: string) => void;
  onDeleteSuccess?: () => void; // Parent callback to clear the cover image
  folderName?: string;
}

export function BaseCover({
  src,
  alt = "Cover Image",
  className = "",
  priority = false,
  imageLoading = "eager",
  isEditable = false,
  onUploadSuccess,
  onDeleteSuccess,
  folderName = "work-pulse-covers",
}: BaseCoverProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const defaultFallbackSrc = DEFAULT_COVER_IMAGE;
  const displaySrc = !src || error ? defaultFallbackSrc : src;

  return (
    <>
      <div className={`relative w-full h-60 overflow-hidden bg-muted group ${className}`}>
        
        {loading && src && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Spinner />
          </div>
        )}

        <Image
          src={displaySrc}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={`object-cover transition-opacity duration-300 ${
            loading && src && !error ? "opacity-0" : "opacity-100"
          }`}
          loading={imageLoading}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />

        {/* Dropdown Menu - Pin to bottom right */}
        {isEditable && (
          <div className="absolute bottom-4 right-4 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="p-1 backdrop-blur-sm border rounded-md shadow-sm transition-colors focus-visible:outline-none">
                  <MoreHorizontalIcon className="cursor-pointer h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => setIsUploaderOpen(true)}
                >
                  Change
                </DropdownMenuItem>
                
                {/* Only show delete if there's actually a custom asset applied */}
                {src && !error && (
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={() => {
                      setError(false);
                      onDeleteSuccess?.();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Embedded Integrated Popup Uploader */}
      {isEditable && (
        <UniversalUploader
          variant="popup"
          isOpen={isUploaderOpen}
          folderName={folderName}
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={(url) => {
            setError(false); // Reset error layout just in case a functional image is loaded over a dead link
            onUploadSuccess?.(url);
          }}
        />
      )}
    </>
  );
}