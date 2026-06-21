"use client";

import { useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

interface BaseAvatarProps {
  src?: string;
  alt?: string;
  fallbackInitials?: string;
  className?: string;
  priority?: boolean; // Added to handle Largest Contentful Paint (LCP) dynamically
}

export default function BaseAvatar({
  src,
  alt,
  fallbackInitials,
  className = "",
  priority = false, // Defaults to false, set to true if it's the main page element
}: BaseAvatarProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`w-[100px] h-[100px] flex items-center justify-center align-center bg-muted rounded-full`}>
        <span className="text-4xl font-bold bg-muted text-muted-foreground">
          {fallbackInitials}
        </span>
      </div>
    );
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
        priority={priority} // Clears warning #2 when passed as true
        sizes="(max-width: 768px) 96px, 96px" // Clears warning #1 (Informs Next.js this avatar is roughly 96px wide)
        className={`object-cover transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}