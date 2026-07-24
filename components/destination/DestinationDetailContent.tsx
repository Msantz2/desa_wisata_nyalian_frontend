"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Clock, MapPin, Star, Ticket } from "lucide-react";
import type { Destination } from "@/types/destination";
import type { Video } from "@/types/video";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionContainer from "@/components/shared/SectionContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getFacilityIcon } from "@/lib/facilityIcons";
import ImageGallery from "@/components/gallery/ImageGallery";
import VideoGallery from "@/components/gallery/VideoGallery";
import AddressCard from "@/components/maps/AddressCard";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import SocialShare from "@/components/shared/SocialShare";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import DestinationGrid from "./DestinationGrid";
import SectionTitle from "@/components/shared/SectionTitle";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });
const VideoModal = dynamic(() => import("@/components/gallery/VideoModal"), { ssr: false });
const GoogleMap = dynamic(() => import("@/components/maps/GoogleMap"), { ssr: false });

interface DestinationDetailContentProps {
  destination: Destination;
  videos: Video[];
  relatedDestinations: Destination[];
  whatsappPhone: string;
}

export default function DestinationDetailContent({
  destination,
  videos,
  relatedDestinations,
  whatsappPhone,
}: DestinationDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const whatsappMessage = `Hello, I would like more information about ${destination.name}. Thank you.`;

  return (
    <>
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={getPlaceholderImage(destination.images[0])}
          alt={destination.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-7xl">
            <Badge className="bg-primary text-white mb-4">
              {destination.category}
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                <span className="text-white/80">({destination.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <span>{destination.location.village}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionContainer className="py-12">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Destinations", href: "/destinations" },
              { label: destination.name },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 space-y-8 sm:space-y-12">

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Overview
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                {destination.shortDescription}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Description
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Facilities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.facilities.map((facility) => {
                  const Icon = getFacilityIcon(facility);
                  return (
                    <div
                      key={facility}
                      className="flex items-center gap-3 bg-card border border-border rounded-lg p-4"
                    >
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text-primary">{facility}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Gallery
              </h2>
              <ImageGallery
                images={destination.images}
                onImageClick={handleImageClick}
                variant="grid"
              />
            </section>

            {videos.length > 0 && (
              <section>
                <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                  Videos
                </h2>
                <VideoGallery videos={videos} onVideoClick={handleVideoClick} />
              </section>
            )}

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Location
              </h2>
              <div className="space-y-4">
                <AddressCard
                  village={destination.location.village}
                  district={destination.location.district}
                  regency={destination.location.regency}
                  province={destination.location.province}
                  address={destination.location.address}
                />
                <Coordinates
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                />
                <GoogleMap
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                  title={destination.name}
                />
                <NavigationButton
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                />
              </div>
            </section>

            {relatedDestinations.length > 0 && (
              <section>
                <SectionTitle
                  title="Related Destinations"
                  subtitle="Explore more places in the same category"
                  align="left"
                />
                <DestinationGrid destinations={relatedDestinations} />
              </section>
            )}

            <section>
              <div className="flex justify-center">
                <SocialShare
                  title={destination.name}
                  description={destination.shortDescription}
                />
              </div>
            </section>
          </main>

          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <Card className="p-6 lg:sticky lg:top-24">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                Visit Information
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-primary">Operating Hours</p>
                    <p className="text-sm text-text-secondary">
                      {destination.operatingHours.open} - {destination.operatingHours.close}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary mb-2">Ticket Price</p>
                    {destination.ticketPrice.adult === 0 && destination.ticketPrice.child === 0 ? (
                      <p className="text-lg font-bold text-primary">Free Entry</p>
                    ) : (
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Adult:</span>
                          <span className="font-semibold text-text-primary">
                            {typeof destination.ticketPrice.adult === 'number' 
                              ? formatCurrency(destination.ticketPrice.adult)
                              : destination.ticketPrice.adult}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Child:</span>
                          <span className="font-semibold text-text-primary">
                            {typeof destination.ticketPrice.child === 'number' 
                              ? formatCurrency(destination.ticketPrice.child)
                              : destination.ticketPrice.child}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <WhatsAppCTA
                phone={whatsappPhone}
                message={whatsappMessage}
                label="Ask for Details"
                size="lg"
              />
            </Card>
          </aside>
        </div>
      </SectionContainer>

      <Lightbox
        images={destination.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <VideoModal
        video={selectedVideo}
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
