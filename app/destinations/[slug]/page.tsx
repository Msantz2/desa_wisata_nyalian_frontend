import { notFound } from "next/navigation";
import { getDestinations, getDestinationBySlug, getVideos, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { createTouristAttractionSchema, createBreadcrumbSchema } from "@/lib/structuredData";
import type { Metadata } from "next";
import DestinationDetailContent from "@/components/destination/DestinationDetailContent";
import StructuredData from "@/components/seo/StructuredData";

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const destinations = getDestinations();
  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export function generateMetadata({ params }: DestinationPageProps): Metadata {
  const destination = getDestinationBySlug(params.slug);

  if (!destination) {
    return buildMetadata({
      title: "Destination Not Found",
      description: "The destination you are looking for could not be found.",
      path: `/destinations/${params.slug}`,
    });
  }

  return buildMetadata({
    title: destination.name,
    description: destination.shortDescription,
    path: `/destinations/${params.slug}`,
    image: destination.images[0],
    keywords: [destination.name, destination.category, "Nyalian Village", "Bali destination", ...destination.facilities.slice(0, 3)],
  });
}

export default function DestinationPage({ params }: DestinationPageProps) {
  const destination = getDestinationBySlug(params.slug);

  if (!destination) {
    notFound();
  }

  const allVideos = getVideos();
  const destinationVideos = allVideos.filter(
    (video) => video.category === destination.category
  );

  const allDestinations = getDestinations();
  const relatedDestinations = allDestinations
    .filter(
      (d) => d.id !== destination.id && d.category === destination.category
    )
    .slice(0, 4);

  const fallbackRelated =
    relatedDestinations.length < 3
      ? allDestinations
          .filter((d) => d.id !== destination.id && d.featured)
          .slice(0, 4 - relatedDestinations.length)
      : [];

  const finalRelated = [...relatedDestinations, ...fallbackRelated].slice(0, 4);

  const settings = getSettings();

  const attractionSchema = createTouristAttractionSchema(destination);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: destination.name, path: `/destinations/${params.slug}` },
  ]);

  return (
    <>
      <StructuredData data={attractionSchema} />
      <StructuredData data={breadcrumbSchema} />
      <DestinationDetailContent
        destination={destination}
        videos={destinationVideos}
        relatedDestinations={finalRelated}
        whatsappPhone={settings.whatsapp}
      />
    </>
  );
}
