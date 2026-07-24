"use client";

import Image from "next/image";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ImageGallery from "@/components/gallery/ImageGallery";
import GoogleMap from "@/components/maps/GoogleMap";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import type { VillageProfile } from "@/types/village";
import type { SiteSettings } from "@/types/settings";

interface AboutClientProps {
  village: VillageProfile;
  settings: SiteSettings;
}

export default function AboutClient({ village, settings }: AboutClientProps) {
  const heroImageUrl = getPlaceholderImage(village.heroImage);

  return (
    <div className="pt-20">
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={heroImageUrl}
          alt={village.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-7xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {village.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
            ]}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Village History
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.history}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Village Philosophy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.philosophy}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Vision
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.vision}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Mission
            </h2>
            <ul className="list-disc list-inside space-y-3 text-text-secondary leading-relaxed">
              {village.mission.map((item, index) => (
                <li key={index} className="ml-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Tourism Potential
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Nyalian Village offers diverse attractions that showcase the natural beauty and cultural richness of Balinese mountain life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {village.tourismPotential.map((potential, index) => (
              <div key={index} className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <p className="text-text-secondary leading-relaxed">{potential}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Cultural Heritage
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.culturalHeritage}
            </p>
          </section>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Photo Gallery
            </h2>
          </div>
          <ImageGallery images={village.gallery} variant="grid" />
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Location
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GoogleMap
                embedUrl={settings.googleMapsEmbed}
                title="Nyalian Village Location"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-primary mt-1 flex-shrink-0">📍</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-text-primary">Location</h3>
                    <p className="text-sm text-text-secondary">{settings.address}</p>
                  </div>
                </div>
              </div>
              <Coordinates
                latitude={settings.latitude}
                longitude={settings.longitude}
              />
              <NavigationButton
                latitude={settings.latitude}
                longitude={settings.longitude}
                label="Get Directions"
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center bg-background-section rounded-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">
            Plan Your Visit
          </h3>
          <p className="text-text-secondary mb-6">
            Contact us on WhatsApp for reservations, tour packages, or any questions about visiting Nyalian Village.
          </p>
          <WhatsAppCTA
            phone={settings.whatsapp}
            message="Hello! I would like to learn more about Nyalian Village."
          />
        </div>
      </div>
    </div>
  );
}
