"use client";

import { Activity, useState } from "react";
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
import { DEFAULT_COVER_PLACEHOLDER_IMAGE } from "@/helpers/constants";

interface BaseCoverProps {
  src?: string;
  alt?: string;
  className?: string; 
  priority?: boolean;
  imageLoading?: "lazy" | "eager";
  isEditable?: boolean;
  onUploadSuccess?: (url: string) => void;
  onDeleteSuccess?: () => void; 
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

  const defaultFallbackSrc = DEFAULT_COVER_PLACEHOLDER_IMAGE;
  const displaySrc = !src || error ? defaultFallbackSrc : src;

  return (
    <>
      <div className={`relative w-full bg-muted group ${className}`}>
        <Activity mode={loading && src && !error ? "visible" : "hidden"}>
          <div className="absolute h-60 inset-0 flex items-center justify-center bg-muted z-10">
            <Spinner />
          </div>
        </Activity>

        <div className="relative w-full overflow-hidden rounded-md aspect-[16/9] md:aspect-[16/7] xl:aspect-[3/1]">
          <Image
            src={displaySrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw,(max-width: 1024px) 100vw,1216px"
            priority
            loading={imageLoading}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        </div>

        <Activity mode={isEditable ? "visible" : "hidden"}>
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
                
                <Activity mode={src && !error ? "visible" : "hidden"}>
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={() => {
                      setError(false);
                      onDeleteSuccess?.();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </Activity>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Activity>
      </div>

      <Activity mode={isEditable ? "visible" : "hidden"}>
        <UniversalUploader
          variant="popup"
          isOpen={isUploaderOpen}
          folderName={folderName}
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={(url) => {
            setError(false);
            onUploadSuccess?.(url);
          }}
        />
      </Activity>
    </>
  );
}