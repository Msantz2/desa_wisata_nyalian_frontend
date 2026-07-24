import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import EmptyState from "@/components/shared/EmptyState";
import DestinationCard from "@/components/destination/DestinationCard";
import { Button } from "@/components/ui/button";
import type { Destination } from "@/types/destination";

interface FeaturedDestinationsProps {
  destinations: Destination[];
}

export default function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  const featured = destinations.slice(0, 3);
  
  return (
    <SectionContainer>
      <SectionTitle
        title="Featured Destinations"
        subtitle="Explore the most popular attractions in Nyalian Village"
      />
      
      {featured.length === 0 ? (
        <EmptyState message="No featured destinations available at the moment" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featured.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/destinations">
              <Button size="lg" className="font-semibold">
                View All Destinations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </SectionContainer>
  );
}
