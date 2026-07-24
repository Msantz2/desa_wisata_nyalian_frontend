import faqData from "@/data/faq.json";
import type { FAQ } from "@/types/faq";

export function getFAQs(): FAQ[] {
  return faqData as FAQ[];
}

export function getFAQById(id: string): FAQ | undefined {
  return faqData.find((faq) => faq.id === id) as FAQ | undefined;
}
