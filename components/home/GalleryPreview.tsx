"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import ImageGallery from "@/components/gallery/ImageGallery";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });

interface GalleryPreviewProps {
  images: string[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle
        title="Galeri Foto"
        subtitle="Jelajahi keindahan Desa Nyalian melalui gambar"
      />
      
      <ImageGallery images={images} onImageClick={handleImageClick} />
      
      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </SectionContainer>
  );
}
