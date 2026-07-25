"use client";

import Breadcrumb from "@/components/layout/Breadcrumb";
import HeroSlideshow from "@/components/shared/HeroSlideshow";
import ImageGallery from "@/components/gallery/ImageGallery";
import GoogleMap from "@/components/maps/GoogleMap";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import type { VillageProfile } from "@/types/village";
import type { SiteSettings } from "@/types/settings";

// Same hero images as Home page
const HERO_IMAGES = [
  "/images/Desa Nyalian_1.webp",
  "/images/Desa Nyalian_2.webp",
  "/images/Desa Nyalian_3.webp",
  "/images/Desa Nyalian_4.webp",
  "/images/Desa Nyalian_5.webp",
  "/images/Desa Nyalian_6.webp",
  "/images/Desa Nyalian_7.webp",
  "/images/Desa Nyalian_8.webp",
  "/images/Desa Nyalian_9.webp",
  "/images/Desa Nyalian_10.webp",
  "/images/Desa Nyalian_11.webp",
  "/images/Desa Nyalian_12.webp",
  "/images/Desa Nyalian_13.webp",
  "/images/Desa Nyalian_14.webp",
  "/images/Jamu Sirkuma_1.webp",
  "/images/Jamu Sirkuma_2.webp",
  "/images/Jamu Sirkuma_3.webp",
  "/images/Pura Puncak Sari_1.webp",
  "/images/Pura Puncak Sari_2.webp",
  "/images/Pura Tirta Tadah Uwuk_1.webp",
  "/images/Pura Tirta Tadah Uwuk_2.webp",
  "/images/Pura Tirta Tadah Uwuk_3.webp",
  "/images/Pura Tirta Tadah Uwuk_4.webp",
  "/images/Pura Tirta Tadah Uwuk_5.webp",
  "/images/Pura Tirta Tadah Uwuk_6.webp",
  "/images/Pura Tirta Tadah Uwuk_7.webp",
  "/images/Pura Tirta Tadah Uwuk_8.webp",
  "/images/Pura Tirta Tadah Uwuk_9.webp",
  "/images/Pura Tirta Tadah Uwuk_10.webp",
  "/images/Pura Tirtha Harum_1.webp",
  "/images/Pura Tirtha Harum_2.webp",
  "/images/Pura Tirtha Harum_3.webp",
  "/images/Pura Tirtha Harum_4.webp",
  "/images/Pura Tirtha Harum_5.webp",
  "/images/Pura Tirtha Harum_6.webp",
  "/images/Pura Tirtha Harum_7.webp",
  "/images/Pura Tirtha Harum_8.webp",
  "/images/Sanggar Seni Tirtapudja_1.webp",
  "/images/Sanggar Seni Tirtapudja_2.webp",
  "/images/Sanggar Seni Tirtapudja_3.webp",
  "/images/Topi Capil_1.webp",
  "/images/Topi Capil_2.webp",
  "/images/Topi Capil_3.webp",
];

interface AboutClientProps {
  village: VillageProfile;
  settings: SiteSettings;
}

export default function AboutClient({ village, settings }: AboutClientProps) {
  return (
    <div className="pt-20">
      <HeroSlideshow images={HERO_IMAGES} title={village.name} />

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
