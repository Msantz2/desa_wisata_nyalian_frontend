import { notFound } from "next/navigation";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { Clock, Users, Star, CheckCircle, XCircle } from "lucide-react";
import { getPackages, getPackageBySlug, getDestinations } from "@/lib/data";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { getSettings } from "@/lib/data";
import SectionContainer from "@/components/shared/SectionContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import SocialShare from "@/components/shared/SocialShare";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import ImageGallery from "@/components/gallery/ImageGallery";
import DestinationCard from "@/components/destination/DestinationCard";
import PackageCard from "@/components/package/PackageCard";

export async function generateStaticParams() {
  const packages = getPackages();
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pkg = getPackageBySlug(params.slug);

  if (!pkg) {
    return buildMetadata({
      title: "Package Not Found",
      description: "The package you are looking for could not be found.",
      path: `/packages/${params.slug}`,
    });
  }

  return buildMetadata({
    title: pkg.name,
    description: pkg.shortDescription,
    path: `/packages/${params.slug}`,
    image: pkg.thumbnail,
    keywords: [pkg.name, pkg.category, "Bali tour package", "Nyalian Village", ...pkg.highlights.slice(0, 3)],
  });
}

export default function PackageDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pkg = getPackageBySlug(params.slug);

  if (!pkg) {
    notFound();
  }

  const settings = getSettings();
  const allDestinations = getDestinations();
  const allPackages = getPackages();

  const linkedDestinations = pkg.destinations
    .map((id) => allDestinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  const relatedPackages = allPackages
    .filter(
      (p) =>
        p.id !== pkg.id &&
        (p.category === pkg.category || p.duration.includes(pkg.duration.split(" ")[0]))
    )
    .slice(0, 3);

  if (relatedPackages.length < 3) {
    const additionalPackages = allPackages
      .filter((p) => p.id !== pkg.id && p.featured && !relatedPackages.find((rp) => rp.id === p.id))
      .slice(0, 3 - relatedPackages.length);
    relatedPackages.push(...additionalPackages);
  }

  const whatsappMessage = `Hello, I am interested in the ${pkg.name}. Could you please provide more information? Thank you.`;

  return (
    <>
      <div className="relative h-[400px] w-full">
        <Image
          src={getPlaceholderImage(pkg.thumbnail, 1200, 400)}
          alt={pkg.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <SectionContainer>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-secondary text-white">{pkg.category}</Badge>
              {pkg.featured && (
                <Badge className="bg-accent text-white">Featured</Badge>
              )}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
              {pkg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-semibold">{pkg.rating.toFixed(1)}</span>
              </div>
              <div className="text-2xl font-bold">
                From {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
              </div>
            </div>
          </SectionContainer>
        </div>
      </div>

      <SectionContainer className="py-12">
        <Breadcrumb
          items={[
            { label: "Packages", href: "/packages" },
            { label: pkg.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                Overview
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                {pkg.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-text-muted">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{pkg.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="font-semibold text-text-primary">
                    {pkg.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pkg.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-text-muted" />
                    Excluded
                  </h3>
                  <ul className="space-y-2">
                    {pkg.excluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-text-muted mt-1">•</span>
                        <span className="text-text-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                Itinerary
              </h2>
              <div className="space-y-4">
                {pkg.itinerary.map((item, index) => {
                  const [time, ...activityParts] = item.split(" - ");
                  const activity = activityParts.join(" - ");
                  
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {time}
                          </span>
                        </div>
                        {index < pkg.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-text-secondary">{activity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {linkedDestinations.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                  Destinations Included
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {linkedDestinations.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Gallery
              </h2>
              <ImageGallery images={pkg.gallery} variant="grid" />
            </section>

            {relatedPackages.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-4">
                  You May Also Like
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPackages.map((relatedPkg) => (
                    <PackageCard key={relatedPkg.id} package={relatedPkg} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-4">
                <SocialShare
                  title={pkg.name}
                  description={pkg.shortDescription}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                  Booking Information
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-primary">
                      {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
                    </p>
                    <p className="text-sm text-text-muted">per person</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-muted">Duration</span>
                      <span className="font-semibold text-text-primary">
                        {pkg.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Group size</span>
                      <span className="font-semibold text-text-primary">
                        {pkg.capacity}
                      </span>
                    </div>
                  </div>
                </div>

                <WhatsAppCTA
                  phone={settings.whatsapp}
                  message={whatsappMessage}
                  label="Book This Package"
                  size="lg"
                />

                <p className="text-xs text-text-muted mt-4 text-center">
                  Contact us via WhatsApp for availability and booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
