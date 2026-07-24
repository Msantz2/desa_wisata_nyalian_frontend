"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

type SafeImageProps = ImageProps;

export default function SafeImage({ alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center" role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageOff className="w-8 h-8" aria-hidden="true" />
          <span className="text-sm">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
