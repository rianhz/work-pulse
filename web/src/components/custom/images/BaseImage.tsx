"use client";

import { useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { UserCircle } from "lucide-react";

interface BaseAvatarProps {
  src?: string;
  alt?: string;
  fallbackInitials?: string;
  fallbackIcon?: React.ReactNode;
  className?: string;
  priority?: boolean;
  imageLoading?: "lazy" | "eager";
}

export default function BaseAvatar({
  src,
  alt,
  fallbackInitials,
  fallbackIcon = <UserCircle size={100} className="text-muted-foreground" />,
  className = "",
  priority = false, // Defaults to false, set to true if it's the main page element
  imageLoading = "lazy",
}: BaseAvatarProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    if(fallbackInitials){
      return (
        <div className={`w-[100px] h-[100px] flex items-center justify-center align-center bg-muted rounded-full`}>
          <span className="text-4xl font-bold bg-muted text-muted-foreground">
            {fallbackInitials}
          </span>
        </div>
      )
    }

    return (
      <div className={`w-[100px] h-[100px] flex items-center justify-center align-center bg-muted rounded-full`}>
        {fallbackIcon}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
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
    </div>
  );
}