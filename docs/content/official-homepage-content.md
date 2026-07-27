# Official Homepage Content — Nyalian Tourism Village

**Document type:** Content Documentation
**Status:** Draft v1.0 — hero, highlight, and CTA copy are production-ready; featured destination/package selection is a recommended curation pending Pokdarwis review; hero background image and WhatsApp CTA link are pending assets from other files
**Location in repo:** `docs/content/official-homepage-content.md`
**Depends on:** `official-tourism-content.md` (Section 2 — Village Identity, Section 6 — Visitor Experience Pillars), `official-destinations.md`, `official-tour-packages.md`, `official-seo-content.md` (Section 2 — Home page Title/Description, which this file must stay consistent with)
**Feeds into:** site homepage (`/`) content, `village.json`/`settings.json` fields, `Hero`/`HighlightSection`/`FeaturedDestinations`/`FeaturedPackages`/`CTASection` components

> **Correction carried forward (read first):** `official-tourism-content.md` flagged that earlier project material referenced "Bangli Regency" or "Bali's mountains" in homepage/hero copy. Nyalian is correctly located in **Banjarangkan District, Klungkung Regency**, and its defining landscape is the **Tukad Melangit river valley and rice terraces**, not a mountain setting. None of the copy below references Bangli or mountains — this file supersedes any earlier draft that did.
>
> **No invented numbers, ratings, or quotes.** This file deliberately excludes visitor counts, star ratings, and testimonials, because none exist yet in any prior file (`official-tourism-content.md` Section 8 explicitly lists village-level visitor statistics as unconfirmed, and `official-seo-content.md` Section 6 defers `AggregateRating` until real reviews exist). Every statistic used below is a real, countable fact drawn directly from prior documentation — see the sourcing note under each one.

---

## 1. Hero Content

| Field | Content |
|---|---|
| **Hero Title** | Nyalian Tourism Village |
| **Hero Subtitle** | Where Bali's Royal Heritage Was Born |
| **Hero Description** | A living royal village in Klungkung, Bali — where sacred ritual, rice-field landscapes, and everyday community life remain one and the same, not staged for visitors, but shared with them. |
| **Primary CTA** | "Explore Destinations" → `/destinations` |
| **Secondary CTA** | "View Tour Packages" → `/packages` |
| **Background image** | **[Pending — `official-gallery.md`]**: candidates are `nyalian-village-hero.jpg`, `puri-agung-nyalian-hero.jpg`, or `tukad-melangit-valley-hero.jpg` |

This subtitle/description pair directly refines the working identity statement established in `official-tourism-content.md` Section 2 — kept consistent in meaning, adapted here to fit the Hero Title/Subtitle/Description split used by the site's homepage component.

---

## 2. Homepage Statistics

Every figure below is a real, sourced fact — not a promotional estimate. Do not add visitor counts, ratings, or awards until genuinely confirmed.

| Statistic | Display Label | Source |
|---|---|---|
| 5 | Documented Destinations | `official-destinations.md` |
| 7 | Curated Tour Packages | `official-tour-packages.md` |
| 2019 | Community Tourism Development Began | `official-destinations.md` — Puri Agung Nyalian formally introduced as a village tourism destination at the 2019 "Prani Royal Diner" event |
| 1 | Sister Village Partnership | `official-tourism-content.md` — Desa Cabean Kunti, Boyolali, since 2022 |
| 3 | Desa Pakraman (Customary Communities) | `official-cultural-heritage.md` — Nyalian, Uma Anyar, Pemenang |

---

## 3. Homepage Highlights (Visitor Experience Pillars)

Directly reframes the four pillars from `official-tourism-content.md` Section 6 as homepage highlight cards:

| Pillar | Homepage Highlight Copy |
|---|---|
| Royal & Performing Arts Heritage | Home to Puri Agung Nyalian — a living royal residence and the birthplace of Balinese Arja theatre. |
| Spiritual & Purification Tourism | Melukat at a genuinely sacred cliffside spring, not a constructed spa experience. |
| Nature & Agrarian Landscape | Rice terraces and river valley scenery that Nyalian's community still actively farms today. |
| Village Life & Local Craft | Meet the artisans behind Nyalian's traditional capil hat weaving in Dusun Pemenang. |

---

## 4. Featured Destinations (Homepage Selection)

**Recommended featured set: 4 of 5 destinations.** Pura Kahyangan Desa Nyalian is intentionally **not** featured on the homepage — its significance (the sacred Sang Hyang Jaran Mesiram ritual) deserves the fuller, more careful framing of its own destination page rather than a punchy homepage card, consistent with the sensitive-content handling established throughout this documentation set. This selection should be confirmed with Pokdarwis Nyalian before implementation.

| Destination | Homepage Card Copy |
|---|---|
| Puri Agung Nyalian | Step into a living royal residence — birthplace of Balinese Arja theatre and centuries of palace tradition. |
| Pura Tirta Tadah Uwug | Purify body and spirit at a sacred cliffside spring, hidden in bamboo forest along the Tukad Melangit. |
| Pura Tirta Harum | Trek through forest ravine to a hidden clan temple — Nyalian's most adventurous discovery. |
| Tukad Melangit Valley & Rice Field Landscape | Wander working rice terraces and river valley scenery that locals still call home. |

---

## 5. Featured Packages (Homepage Selection)

**Recommended featured set: 4 of 7 packages**, chosen to represent Nyalian's range of visitor intents (overview, spiritual, hands-on, immersive) without leading with Package 6. Sacred Ceremony Witness is intentionally excluded from homepage promotion — its by-request, non-guaranteed nature is better explained in full on its own package page than compressed into a homepage teaser, per the sensitive-content SEO rule in `official-seo-content.md` Section 9.

| Package | Homepage Card Copy |
|---|---|
| 3. Nyalian Full-Day Discovery | The complete Nyalian experience in a day — heritage, spirituality, and nature, with a home-cooked lunch. |
| 2. Sacred Waters Melukat Experience | A guided melukat purification ritual at Nyalian's sacred cliffside spring. |
| 5. Village Life & Craft Immersion | Weave your own capil hat alongside a local artisan family in Dusun Pemenang. |
| 7. Nyalian Immersive Stay — 2D1N | Stay the night with a Nyalian host family and live the village's four pillars firsthand. |

---

## 6. CTA Section (Homepage Closing Banner)

| Field | Content |
|---|---|
| **CTA Title** | Ready to Experience Nyalian? |
| **CTA Subtext** | Plan your visit or reach out directly — we're happy to help you experience Nyalian respectfully and authentically. |
| **CTA Button** | "Plan Your Visit" → `/plan-your-visit` |
| **WhatsApp Button (secondary)** | **[Pending — official contact channel, see `official-faq.md` Data Confirmation Summary]** |

---

## 7. Credibility Line (Optional Homepage Element)

A short, factual trust signal — not a claim of official designation (Nyalian's formal "Desa Wisata" status is still unconfirmed per `official-tourism-content.md` Section 8):

> *"Nyalian's tourism development is supported by the Klungkung Tourism Office (Dinas Pariwisata Klungkung) and the Klungkung Tourism Village Communication Forum (Forkomdewi Klungkung)."*

---

## 8. What NOT to Include (Explicit Guardrails)

- No invented visitor counts, star ratings, review scores, or testimonial quotes — none are confirmed real anywhere in this documentation set.
- No reference to "Bangli Regency" or mountain imagery/language — corrected to Klungkung Regency and river valley/rice terrace imagery.
- No homepage promotion, teaser, or CTA implying Tari Baris Tentara or Sang Hyang Jaran Mesiram can be watched or booked.
- No specific Rupiah price figures in Hero, Highlight, or CTA copy — all package pricing remains placeholder (`official-tour-packages.md`).
- No claim of an official "Desa Wisata" designation unless and until confirmed.

---

## Data Confirmation Summary

- [ ] Hero background image, once photography exists (`official-gallery.md`)
- [ ] WhatsApp CTA number/link for the homepage closing banner (`official-faq.md`)
- [ ] Pokdarwis Nyalian review and confirmation of the featured destination and package selections in Sections 4–5
- [ ] Confirm whether the credibility line (Section 7) should name additional supporting institutions

---

*End of official-homepage-content.md — Draft v1.0*

---

## Documentation Set Complete

This completes all 9 files planned in `docs/content/`: `official-tourism-content.md`, `official-destinations.md`, `official-tour-packages.md`, `official-cultural-heritage.md`, `official-umkm.md`, `official-faq.md`, `official-seo-content.md`, `official-gallery.md`, and `official-homepage-content.md`. Together they form the single source of truth this project set out to build — ready to generate the site's real JSON data, replacing the placeholder sample content used earlier in the technical build stages.