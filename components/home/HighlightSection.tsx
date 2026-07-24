import {
  Crown,
  Droplets,
  Sprout,
  Paintbrush,
} from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import HighlightCard from "./HighlightCard";
import type { VillageProfile } from "@/types/village";

interface HighlightSectionProps {
  village: VillageProfile;
}

export default function HighlightSection({ village }: HighlightSectionProps) {
  const highlights = [
    {
      icon: Crown,
      title: "Royal & Performing Arts Heritage",
      description: "Home to Puri Agung Nyalian — a living royal residence and the birthplace of Balinese Arja theatre.",
    },
    {
      icon: Droplets,
      title: "Spiritual & Purification Tourism",
      description: "Melukat at a genuinely sacred cliffside spring, not a constructed spa experience.",
    },
    {
      icon: Sprout,
      title: "Nature & Agrarian Landscape",
      description: "Rice terraces and river valley scenery that Nyalian's community still actively farms today.",
    },
    {
      icon: Paintbrush,
      title: "Village Life & Local Craft",
      description: "Meet the artisans behind Nyalian's traditional capil hat weaving in Dusun Pemenang.",
    },
  ];

  return (
    <SectionContainer background="section">
      <SectionTitle
        title="Why Visit Nyalian"
        subtitle="Discover what makes our village special"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={index}
            icon={highlight.icon}
            title={highlight.title}
            description={highlight.description}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
