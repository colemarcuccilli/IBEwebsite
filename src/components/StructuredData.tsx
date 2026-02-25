export default function StructuredData() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.ibefw.com/#business",
    name: "Industrial Bakery Equipment",
    alternateName: "IBE",
    url: "https://www.ibefw.com",
    telephone: "260-710-0063",
    email: ["sales@industrialbakeryequipment.com", "ibepurchasing@yahoo.com"],
    description:
      "Steel and stainless steel fabrication for food service equipment, bakery racks, blast freeze racks, wire carts, dough troughs, and custom wire and sheet metal products. Serving over a dozen industries since 2008.",
    foundingDate: "2008",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fort Wayne",
      addressRegion: "IN",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0793,
      longitude: -85.1394,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Bakery Equipment",
      "Bread Cooling Racks",
      "Blast Freeze Racks",
      "Dough Troughs",
      "Wire Carts",
      "Fry Screens",
      "Pan Tree Racks",
      "Pie Racks",
      "Glazing Racks",
      "Stainless Steel Fabrication",
      "Sheet Metal Products",
      "Food Service Equipment",
      "Seafood Processing Equipment",
      "Chicken Processing Equipment",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Bread & Bun Cooling Racks",
          description:
            "All steel construction cooling racks available in 18x54, 24x66, and 28x66 frame sizes with standard shelf counts of 8, 9, 10, 15, and 17.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Blast Freeze / Drying Racks",
          description:
            "Heavy-duty blast freeze and drying racks with galvanized, glass-bead blasted, or electro-polished stainless steel finishes.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Dough Troughs",
          description:
            "11 gauge stainless or standard steel dough troughs with sealed rim and caster shoes. Multiple body styles available.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Pan Tree Mobile Racks",
          description:
            "All-steel mobile pan tree racks available in 24, 36, and 40 shelf configurations with multiple finish options.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Wire Carts",
          description:
            "Mail carts, carryout carts, and receiving carts in steel construction with durable finishes.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Fry Screens",
          description:
            "Stamped metal mesh and wire welded mesh fry screens in sizes 25x17, 23x23, and 33x23.",
        },
      },
    ],
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Industrial Bakery Equipment",
    alternateName: "IBE",
    url: "https://www.ibefw.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
