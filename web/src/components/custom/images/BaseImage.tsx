"use client";

import { useState } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface BaseAvatarProps {
  src?: string;
  alt: string;
  fallbackInitials?: string;
  className?: string;
}

export default function BaseAvatar({
  src,
  alt,
  fallbackInitials,
  className = "",
}: BaseAvatarProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`size-24 flex items-center justify-center align-center bg-muted rounded-full`}>
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
        alt={alt}
        fill
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