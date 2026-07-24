import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import ReviewCarousel from "@/components/review/ReviewCarousel";
import type { Review } from "@/types/review";

interface ReviewPreviewProps {
  reviews: Review[];
}

export default function ReviewPreview({ reviews }: ReviewPreviewProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle
        title="What Visitors Say"
        subtitle="Hear from travelers who have experienced Nyalian Village"
      />
      
      <ReviewCarousel reviews={reviews} />
    </SectionContainer>
  );
}
