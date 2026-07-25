"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback } from "react";
import { ImageOff } from "lucide-react";

type SafeImageProps = ImageProps & {
  onImageError?: (error: Error) => void;
};

export default function SafeImage({ alt, onImageError, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 2; // Allow 2 attempts before showing error

  const handleError = useCallback((err: any) => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    const errorMsg = `Image failed to load: ${props.src || 'unknown source'}`;
    
    // Only show error placeholder after multiple failed attempts
    if (newAttemptCount >= MAX_ATTEMPTS) {
      console.error(`[SafeImage] ${errorMsg}`, {
        src: props.src,
        alt: alt,
        attempts: newAttemptCount,
      });
      
      setError(true);
      
      if (onImageError) {
        onImageError(err instanceof Error ? err : new Error(errorMsg));
      }
    } else {
      // Log but don't show error yet - might be transient
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[SafeImage] Load attempt ${newAttemptCount} failed: ${errorMsg}`);
      }
    }
  }, [attemptCount, props.src, alt, onImageError]);

  // Only show placeholder after confirmed failures
  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center" role="img" aria-label={`Failed to load: ${alt}`}>
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <ImageOff className="w-8 h-8" aria-hidden="true" />
          <span className="text-xs text-center px-2 line-clamp-2">{alt}</span>
          <span className="text-xs text-gray-400">(image unavailable)</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={handleError}
    />
  );
}
