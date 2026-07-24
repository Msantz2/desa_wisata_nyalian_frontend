# Official SEO Content — Nyalian Tourism Village

**Document type:** Content Documentation
**Status:** Draft v1.0 — titles, descriptions, and keywords are production-ready copy derived directly from confirmed content in prior files; images, structured-data numeric fields, and page slugs are flagged as pending/proposed where the underlying fact is not yet confirmed
**Location in repo:** `docs/content/official-seo-content.md`
**Depends on:** `official-tourism-content.md`, `official-destinations.md`, `official-tour-packages.md`, `official-cultural-heritage.md`, `official-umkm.md`, `official-faq.md`
**Feeds into:** site `<head>` metadata, Open Graph tags, Twitter Card tags, JSON-LD structured data, `sitemap.xml`

> **SEO philosophy note (read first):** This project's SEO content must obey the same honesty standard as every other file in this set. Two rules apply specifically to search-facing copy:
> 1. **Never publish a price, hour, or fee in a title or meta description that is still a placeholder.** Search engines cache and display this text publicly; an unconfirmed number shown in a Google result is worse than no number at all. Where a package price is referenced below, it is described qualitatively ("half-day," "guided") rather than by exact Rupiah figure.
> 2. **Never write booking-oriented or scheduling language for sacred content.** Tari Baris Tentara and Sang Hyang Jaran Mesiram must never appear in a title, description, or structured-data field phrased as something a visitor can reserve, watch on demand, or expect to see — consistent with `official-tourism-content.md` (Section 5.1) and `official-cultural-heritage.md`. See Section 9 below for the specific rule this creates.

Articles and videos are intentionally excluded from this document — no official article or video content has been created yet in this documentation set. SEO templates for those content types should be added once `official-gallery.md` (for video/image assets) and a future article-content file exist, so this file doesn't invent placeholder copy for content that doesn't exist yet.

---

## 1. Site-Wide SEO Defaults

| Field | Value |
|---|---|
| Site name | Nyalian Tourism Village |
| Title template | `{Page Title} \| Nyalian Tourism Village` |
| Default `og:type` | `website` (reserve `article` for future blog content only) |
| Default Twitter Card | `summary_large_image` |
| Default OG image | **[Pending — `official-gallery.md`]**, a wide hero shot representing the village (candidate: Puri Agung Nyalian courtyard or Tukad Melangit valley) |
| Favicon / touch icon / manifest | **[Pending — to be sourced once a village/site logo is finalized]** |

### Core Site-Wide Keywords
Primary: `Nyalian Tourism Village`, `desa wisata Nyalian`, `desa wisata Klungkung`, `Bali cultural tourism`
Secondary (by Visitor Experience Pillar, per `official-tourism-content.md` Section 6): `Puri Agung Nyalian`, `melukat Klungkung`, `Tukad Melangit`, `Bali royal heritage village`, `Arja Bali origin`, `Balinese sacred ritual village`

### Local SEO
| Field | Value |
|---|---|
| Region | Banjarangkan District, Klungkung Regency, Bali |
| Nearby landmark | Klungkung Palace / Kertha Gosa, Semarapura |
| Address (only confirmed site-level address) | Nyalian, Kecamatan Banjarangkan, Kabupaten Klungkung, Bali 80752 (Puri Agung Nyalian, per `official-destinations.md`) |
| Phone / WhatsApp / Email | **[Pending — Pokdarwis Nyalian official contact channel, see `official-faq.md` Data Confirmation Summary]** |
| Opening hours (village-wide) | Not applicable — Nyalian is a village, not a single-hours venue; individual destination hours are **[Pending]** per `official-destinations.md` |

---

## 2. Site Pages

| Page | Title (≤60 chars) | Meta Description (≤160 chars) | Primary Keywords | Canonical |
|---|---|---|---|---|
| Home | Nyalian Tourism Village \| Heritage & Nature, Bali | Discover Nyalian, a royal heritage and agrarian village in Klungkung, Bali — home to sacred ritual, melukat, and living Balinese tradition. | Nyalian Tourism Village, desa wisata Klungkung, Bali cultural tourism | `/` |
| About / Village Profile | About Nyalian Village \| History, Culture & Philosophy | Learn the history, royal heritage, and tourism philosophy of Nyalian Village, Banjarangkan, Klungkung — where living tradition continues today. | Nyalian Village history, Puri Agung Nyalian, Klungkung heritage village | `/about` |
| Destinations (listing) | Destinations \| Nyalian Tourism Village | Explore Nyalian's five heritage, spiritual, and nature destinations — from a living royal palace to a sacred cliffside spring in Klungkung. | Nyalian destinations, things to do Klungkung, Bali spiritual sites | `/destinations` |
| Tour Packages (listing) | Tour Packages \| Nyalian Tourism Village | Book a guided cultural, spiritual, or nature experience in Nyalian Village — from a half-day heritage morning to a full immersive homestay. | Nyalian tour packages, Bali village tour, Klungkung guided tour | `/packages` |
| FAQ | FAQ \| Nyalian Tourism Village | Answers to common questions about visiting Nyalian Village — destinations, tour packages, sacred-site etiquette, and practical travel tips. | Nyalian FAQ, visiting Klungkung Bali, melukat etiquette | `/faq` |
| Plan Your Visit / Contact | Plan Your Visit \| Nyalian Tourism Village | Everything you need to visit Nyalian Village, Klungkung — directions, best time to visit, what to bring, and how to get in touch. | visit Nyalian Village, Klungkung Bali directions, contact Nyalian tourism | `/plan-your-visit` |

*Note on the last row: the project's technical implementation consolidated the routing spec's separate `/contact` concept into a single `/plan-your-visit` page (richer in content, covering the same Local SEO needs). This table follows that resolution; if a standalone `/contact` route is ever reintroduced, reuse this row's Local SEO content rather than writing new copy.*

---

## 3. Destination Detail Pages

Each destination page should generate a `TouristAttraction` schema (see Section 8) and a `BreadcrumbList` schema (`Home > Destinations > {Name}`). Proposed slugs below are new — no slug has been officially assigned elsewhere yet — and should be treated as the recommended value when the site's destination JSON is populated from this documentation.

| Destination | Proposed Slug | Title (≤60 chars) | Meta Description (≤160 chars) | Primary Keywords |
|---|---|---|---|---|
| Puri Agung Nyalian | `puri-agung-nyalian` | Puri Agung Nyalian \| Royal Heritage & Birthplace of Arja | Visit the living royal residence of Nyalian's princely house — birthplace of Arja Gede Garong and centuries of Balinese royal tradition. | Puri Agung Nyalian, Arja Bali origin, Klungkung royal palace |
| Pura Tirta Tadah Uwug | `pura-tirta-tadah-uwug` | Pura Tirta Tadah Uwug \| Sacred Melukat Spring, Klungkung | Experience melukat, traditional Balinese purification bathing, at a sacred cliffside spring set in bamboo forest along the Tukad Melangit river. | melukat Klungkung, Pura Tirta Tadah Uwug, Bali sacred spring |
| Pura Kahyangan Desa Nyalian | `pura-kahyangan-desa-nyalian` | Pura Kahyangan Desa Nyalian \| Sacred Village Temple | Learn about Sang Hyang Jaran Mesiram, a rare sacred trance ritual held during temple ceremonies at Nyalian's Kahyangan temple, respectfully explained. | Pura Kahyangan Nyalian, Sang Hyang Jaran Mesiram, Balinese sacred ritual |
| Pura Tirta Harum | `pura-tirta-harum` | Pura Tirta Harum \| Hidden Forest Temple Trek, Nyalian | Trek through the Tukad Melangit ravine to Pura Tirta Harum, a clan-origin forest temple reachable only on foot — Nyalian's quietest destination. | Pura Tirta Harum, Bali forest temple trek, Tukad Melangit trekking |
| Tukad Melangit Valley & Rice Field Landscape | `tukad-melangit-valley` | Tukad Melangit Valley \| Rice Fields & River Scenery | Walk through Nyalian's working rice terraces and river valley — the agrarian landscape connecting the village's cultural and spiritual sites. | Tukad Melangit, Bali rice terrace walk, Klungkung nature |

**Special handling — Pura Kahyangan Desa Nyalian:** this description was deliberately written as "learn about" rather than "see" or "watch," and includes no schedule or booking language, per the sensitive-content rule in Section 9.

---

## 4. Tour Package Detail Pages

Each package page should generate a `BreadcrumbList` schema (`Home > Packages > {Name}`). Do not add `Product`/price-related schema until real pricing is confirmed (see `official-tour-packages.md`).

| Package | Proposed Slug | Title (≤60 chars) | Meta Description (≤160 chars) | Primary Keywords |
|---|---|---|---|---|
| 1. Nyalian Heritage Morning | `nyalian-heritage-morning` | Nyalian Heritage Morning Tour \| Royal Palace & Arja | A half-day guided visit to Puri Agung Nyalian with storytelling and an Arja Gede Garong performance excerpt — Bali's living royal heritage. | Nyalian heritage tour, Arja performance Bali, Puri Agung Nyalian tour |
| 2. Sacred Waters Melukat Experience | `sacred-waters-melukat-experience` | Melukat Experience Package \| Nyalian Tourism Village | A guided half-day melukat purification ritual at Pura Tirta Tadah Uwug's sacred spring, followed by rest at a riverside café. | melukat package Bali, Klungkung purification tour |
| 3. Nyalian Full-Day Discovery | `nyalian-full-day-discovery` | Nyalian Full-Day Discovery Tour \| Culture, Spirit & Nature | A complete full-day tour of Nyalian — royal heritage, rice-terrace walking, melukat purification, and a home-cooked Balinese lunch. | Nyalian full day tour, Klungkung day trip, Bali cultural tour |
| 4. Tukad Melangit Trekking & Tirta Harum | `tukad-melangit-trekking-tirta-harum` | Tukad Melangit Trekking Tour \| Forest Temple Trek | A guided trek through the Tukad Melangit ravine to the hidden forest temple of Pura Tirta Harum — Nyalian's most immersive nature experience. | Tukad Melangit trekking, Bali forest trek tour |
| 5. Village Life & Craft Immersion | `village-life-craft-immersion` | Village Life & Craft Tour \| Capil Weaving, Nyalian | Walk through Nyalian's farmland and join a hands-on capil hat-weaving workshop with a local artisan family — includes a take-home souvenir. | Bali craft workshop, capil weaving Bali, Nyalian village tour |
| 6. Sacred Ceremony Witness | `sacred-ceremony-witness` | Sacred Ceremony Witness \| By-Request Cultural Access | A rare, respectful opportunity to witness Nyalian's sacred ceremonies when timing and community permission allow — by request only. | Bali sacred ceremony access, Balinese ritual tourism |
| 7. Nyalian Immersive Stay — 2D1N | `nyalian-immersive-stay-2d1n` | Nyalian Immersive Stay \| 2D1N Homestay Experience | Stay overnight with a Nyalian host family and experience heritage, spirituality, nature, and local craft in one immersive itinerary. | Bali homestay experience, Nyalian 2 days 1 night |

**Special handling — Sacred Ceremony Witness (Package 6):** note the deliberate absence of "book," "reserve," or a fixed price in this row's title/description, and the phrase "by request only" — this protects both accuracy and the community's trust, per Section 9.

---

## 5. Open Graph & Twitter Card Guidance

- `og:title` / `og:description` should reuse the Title/Description columns above verbatim — do not write separate OG copy that could drift out of sync.
- `og:url` = the page's canonical URL (Section 2–4 tables).
- `og:type` = `website` for every page in this document (no `article` type content exists yet).
- `og:image`: **[Pending — `official-gallery.md`]** for every page. Until real photography exists, do not deploy a generic stock image under the village's name — leave the OG image field empty/using a neutral site-wide placeholder rather than implying a specific, uncredited photo represents a real destination.
- Twitter Card: `summary_large_image`, reusing the same title/description/image as Open Graph.

---

## 6. Structured Data (JSON-LD) Guidance

| Schema | Applies to | Status |
|---|---|---|
| `Organization` | Site-wide (root layout) | Partially ready — name and address available; logo, `sameAs` (social handles), and contact `telephone`/`email` are **[Pending]** |
| `TouristAttraction` | Each destination detail page | Ready for `name`, `description`; `image`, `address` (full), and `geo` coordinates are **[Pending]** per `official-destinations.md` |
| `BreadcrumbList` | Every destination and package detail page | Ready — breadcrumb labels are already established in Sections 3–4 |
| `FAQPage` | `/faq` | Ready — map directly from `official-faq.md`; use the exact question/answer text already written there rather than rephrasing |
| `AggregateRating` | Destination pages (optional) | **Do not implement yet.** No authentic visitor review data exists in this documentation set. Per the technical SEO spec, only authentic review data may be used — adding this schema before real reviews exist would be fabricated data |
| `VideoObject` | N/A | **Do not implement yet.** No official video content exists in this documentation set |
| `Article` | N/A | **Do not implement yet.** No official article content exists in this documentation set |

---

## 7. Image SEO Guidance

Until `official-gallery.md` is created, use these conventions for any image asset referenced by this project:

- **Filenames:** descriptive, hyphenated, keyword-relevant — e.g. `puri-agung-nyalian-courtyard.jpg`, `tirta-tadah-uwug-melukat-spring.jpg`. Never use generic names like `IMG001.jpg`.
- **Alt text:** describe what is actually shown, using the destination/package name naturally — e.g. `"Stone stairway leading to the melukat pools at Pura Tirta Tadah Uwug"` rather than a bare keyword stuffing like `"melukat bali spiritual water temple"`.
- **Sacred-content images:** per `official-cultural-heritage.md`, any image of Tari Baris Tentara or Sang Hyang Jaran Mesiram must be sourced and used only with explicit community/adat permission — this applies to alt text and filenames too (don't publish descriptive filenames for imagery that hasn't been cleared for use).

---

## 8. Heading & URL Structure Guidance

- Every page must have exactly one `<h1>`, matching (or closely matching) the Title column above, followed by hierarchical `<h2>`/`<h3>` — never skip a level.
- URLs should stay short, readable, and keyword-focused, consistent with the proposed slugs in Sections 3–4 (e.g. `/destinations/pura-tirta-tadah-uwug`, not `/destinations/site-2`).
- Internal linking: every destination and package page should link to its related destinations/packages (per the site's `RelatedDestinations`/`RelatedPackages` components), which directly supports the "Internal Linking" requirement in the technical SEO spec.

---

## 9. Sensitive-Content SEO Rule (Binding)

This rule overrides normal SEO best practice (which favors action-oriented, click-friendly copy) wherever it would apply to sacred content:

- **Never** use booking/scheduling verbs (book, reserve, schedule, guarantee, watch, see live) in any title, description, OG tag, or structured-data field describing Tari Baris Tentara, Sang Hyang Jaran Mesiram, or Package 6 (Sacred Ceremony Witness).
- **Always** use availability-conditional language instead: "by request," "when timing allows," "respectfully witness if a ceremony coincides with your visit."
- **Never** include a specific upcoming ceremony date in public metadata or structured data, even if one becomes known internally — this is a sacred-protocol protection, not just an SEO style choice.

---

## Data Confirmation Summary

- [ ] Default and per-page Open Graph images (pending `official-gallery.md`)
- [ ] Site logo, favicon, and social handles for `Organization` schema `sameAs`
- [ ] Official phone/WhatsApp/email for Local SEO and `Organization` schema
- [ ] Precise coordinates for `TouristAttraction` `geo` fields (pending `official-destinations.md`)
- [ ] Opening hours and entrance fees, once confirmed, to be added to `TouristAttraction` schema (never to title/description text directly — keep those qualitative)
- [ ] Final confirmed pricing for tour packages, before any price figure is added to public-facing meta descriptions
- [ ] Proposed slugs in Sections 3–4 confirmed/finalized once the site's destination and package JSON data is generated from this documentation set

---

*End of official-seo-content.md — Draft v1.0*