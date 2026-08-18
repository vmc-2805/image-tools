/**
 * Structured SEO Data Configuration
 * Can be dynamically loaded from a database/API in the future.
 */

export const DEFAULT_SEO = {
  title: "AeroTools - Premium Free Online Image & PDF Utilities",
  description: "AeroTools runs 100% locally in your browser. Compress, resize, crop, watermark, convert image and PDF files instantly and securely without server uploads.",
  robots: "index, follow",
  ogType: "website",
  ogImage: "/favicon.svg",
  canonicalBase: "https://aerotools.online"
};

// Handcrafted, SEO-optimized overrides for key pages.
// Titles must be max 65 characters.
// Descriptions must be max 165 characters.
export const SEO_OVERRIDES = {
  "home": {
    title: "AeroTools - Free In-Browser Image & PDF Utilities",
    description: "Free, secure client-side tools running 100% locally in your browser. Crop, compress, convert, and resize images and PDFs without server uploads.",
    robots: "index, follow",
    breadcrumbs: [
      { name: "Home", path: "/" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AeroTools",
      "url": "https://aerotools.online/",
      "description": "Free, secure client-side tools running 100% locally in your browser."
    }
  },
  "passport-maker": {
    title: "Passport Photo Maker Online Free - AeroTools",
    description: "Create standard passport-sized photos with custom background colors and alignment rules instantly. Perfect for online applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Passport Photo Maker", path: "/passport-maker" }
    ]
  },
  "reduce-kb": {
    title: "Reduce Image Size in KB Online - Compress - AeroTools",
    description: "Reduce image file size to a target KB limit (50KB, 100KB, etc.) without losing quality. Completely client-side and secure.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Reduce Image Size in KB", path: "/reduce-kb" }
    ]
  },
  "resize-pixel": {
    title: "Resize Image Pixel Online - AeroTools",
    description: "Resize image dimensions by width and height pixels with target size controls. Safe, private, and runs 100% in your browser.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Resize Image Pixel Online", path: "/resize-pixel" }
    ]
  },
  "convert-dpi": {
    title: "DPI Converter - Change Image DPI Online - AeroTools",
    description: "Change image DPI to 200, 300, 600 or custom DPI instantly. Perfect for preparing documents and photos for printing and submissions.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "DPI & Quality", path: "/#category-DPI-&-Quality" },
      { name: "DPI Converter", path: "/convert-dpi" }
    ]
  },
  "image-to-pdf": {
    title: "Convert Image to PDF Online - AeroTools",
    description: "Convert JPG, PNG, WEBP, and other images to a single PDF document. Adjust layout, margins, and compression in your browser securely.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Image to PDF", path: "/#category-Image-to-PDF" },
      { name: "Image to PDF Converter", path: "/image-to-pdf" }
    ]
  }
};

/**
 * Resolves the SEO config for the given tool or home page.
 * If no custom override exists for a tool, it dynamically generates 
 * optimized values that strictly conform to length requirements.
 */
export function getSeoData(tool) {
  const baseCanonical = window.location.origin;

  if (!tool) {
    // Return home SEO
    const homeOverride = SEO_OVERRIDES["home"];
    return {
      title: homeOverride.title,
      description: homeOverride.description,
      robots: homeOverride.robots || DEFAULT_SEO.robots,
      canonical: baseCanonical + "/",
      ogType: DEFAULT_SEO.ogType,
      ogImage: baseCanonical + DEFAULT_SEO.ogImage,
      breadcrumbs: homeOverride.breadcrumbs,
      schema: homeOverride.schema
    };
  }

  // Check if there is a custom override for the tool
  const override = SEO_OVERRIDES[tool.id];

  // 1. Resolve Title (Max 65 characters)
  let title = override?.title;
  if (!title) {
    const rawTitle = `${tool.name} Online Free - AeroTools`;
    title = rawTitle.length <= 65 ? rawTitle : `${tool.name} - AeroTools`;
    if (title.length > 65) {
      title = title.substring(0, 62) + "...";
    }
  }

  // 2. Resolve Description (Max 165 characters)
  let description = override?.description;
  if (!description) {
    const prefix = `Free online ${tool.name}. `;
    const suffix = ` 100% secure, runs locally.`;
    const descMiddleMaxLen = 165 - prefix.length - suffix.length;
    let descMiddle = tool.desc || "";
    if (descMiddle.length > descMiddleMaxLen) {
      descMiddle = descMiddle.substring(0, descMiddleMaxLen - 3) + "...";
    }
    description = `${prefix}${descMiddle}${suffix}`;
    if (description.length > 165) {
      description = description.substring(0, 162) + "...";
    }
  }

  // 3. Resolve Breadcrumbs
  let breadcrumbs = override?.breadcrumbs;
  if (!breadcrumbs) {
    const categorySlug = `category-${tool.category.replace(/[^a-zA-Z0-9]/g, "-")}`;
    breadcrumbs = [
      { name: "Home", path: "/" },
      { name: tool.category, path: `/#${categorySlug}` },
      { name: tool.name, path: `/${tool.id}` }
    ];
  }

  // 4. Resolve Canonical
  const canonical = `${baseCanonical}/${tool.id}`;

  // 5. Resolve Schema
  const schema = override?.schema || {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "url": canonical,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5. Requires JavaScript.",
    "description": description
  };

  return {
    title,
    description,
    robots: DEFAULT_SEO.robots,
    canonical,
    ogType: "article",
    ogImage: baseCanonical + DEFAULT_SEO.ogImage,
    breadcrumbs,
    schema
  };
}

/**
 * Dynamically updates the DOM head elements for SEO metadata
 */
export function updateMetaTags(seo) {
  try {
    // 1. Title
    document.title = seo.title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // 3. Robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', seo.robots);

    // 4. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', seo.canonical);

    // 5. Open Graph Tags
    const ogTags = {
      'og:title': seo.title,
      'og:description': seo.description,
      'og:url': seo.canonical,
      'og:type': seo.ogType,
      'og:image': seo.ogImage
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    });

    // 6. JSON-LD Schema
    let schemaScript = document.getElementById('seo-jsonld-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    if (seo.schema) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-jsonld-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.text = JSON.stringify(seo.schema);
      document.head.appendChild(schemaScript);
    }
  } catch (error) {
    console.error("Failed to update SEO tags:", error);
  }
}
