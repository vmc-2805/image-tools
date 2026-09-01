/**
 * Structured SEO Data Configuration
 * Can be dynamically loaded from a database/API in the future.
 */

export const DEFAULT_SEO = {
  title: "Imgediit - Premium Free Online Image & PDF Utilities",
  description: "Imgediit runs 100% locally in your browser. Compress, resize, crop, watermark, convert image and PDF files instantly and securely without server uploads.",
  robots: "index, follow",
  ogType: "website",
  ogImage: "/favicon.svg",
  canonicalBase: "https://imgediit.com"
};

// Handcrafted, SEO-optimized overrides for key pages.
// Titles must be max 65 characters.
// Descriptions must be max 165 characters.
export const SEO_OVERRIDES = {
  "home": {
    title: "Imgediit - Free In-Browser Image & PDF Utilities",
    description: "Free, secure client-side tools running 100% locally in your browser. Crop, compress, convert, and resize images and PDFs without server uploads.",
    robots: "index, follow",
    breadcrumbs: [
      { name: "Home", path: "/" }
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Imgediit",
      "url": "https://imgediit.com/",
      "description": "Free, secure client-side tools running 100% locally in your browser."
    }
  },
  "passport-maker": {
    title: "Passport Photo Maker Online Free - Imgediit",
    description: "Create standard passport-sized photos with custom background colors and alignment rules instantly. Perfect for online applications.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Passport Photo Maker", path: "/passport-maker" }
    ]
  },
  "reduce-kb": {
    title: "Reduce Image Size in KB Online - Compress - Imgediit",
    description: "Reduce image file size to a target KB limit (50KB, 100KB, etc.) without losing quality. Completely client-side and secure.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Reduce Image Size in KB", path: "/reduce-kb" }
    ]
  },
  "resize-pixel": {
    title: "Resize Image Pixel Online - Imgediit",
    description: "Resize image dimensions by width and height pixels with target size controls. Safe, private, and runs 100% in your browser.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Most Used Tools", path: "/#category-Most-Used-Tools" },
      { name: "Resize Image Pixel Online", path: "/resize-pixel" }
    ]
  },
  "convert-dpi": {
    title: "DPI Converter - Change Image DPI Online - Imgediit",
    description: "Change image DPI to 200, 300, 600 or custom DPI instantly. Perfect for preparing documents and photos for printing and submissions.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "DPI & Quality", path: "/#category-DPI-&-Quality" },
      { name: "DPI Converter", path: "/convert-dpi" }
    ]
  },
  "image-to-pdf": {
    title: "Convert Image to PDF Online - Imgediit",
    description: "Convert JPG, PNG, WEBP, and other images to a single PDF document. Adjust layout, margins, and compression in your browser securely.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Image to PDF", path: "/#category-Image-to-PDF" },
      { name: "Image to PDF Converter", path: "/image-to-pdf" }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy - 100% Client-Side Protection - Imgediit",
    description: "Imgediit privacy safeguards. All operations run entirely in your local browser sandbox. We do not collect, store, or transmit your files.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" }
    ]
  },
  "terms-of-service": {
    title: "Terms of Service - Local Usage Guidelines - Imgediit",
    description: "Read the usage license, commercial disclaimer, and terms of service for using the Imgediit browser-local utilities portal.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Terms of Service", path: "/terms-of-service" }
    ]
  },
  "ai-enhancement-guide": {
    title: "AI Photo Enhancer & Skin Retouching Guide - Imgediit",
    description: "Learn how to upscale blurry photos to 4K, remove blemishes, and smooth portraits with in-browser AI tools 100% privately.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "AI Enhancement Guide", path: "/ai-enhancement-guide" }
    ]
  },
  "passport-photo-guide": {
    title: "Official Passport & Visa Photo Guidelines - Imgediit",
    description: "Standard passport photo dimensions (3.5x4.5cm, 2x2 in), background colors, and online application specs for Indian, US, UK, and Schengen visas.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Passport Photo Guide", path: "/passport-photo-guide" }
    ]
  },
  "pdf-compressor-guide": {
    title: "Smart PDF Merge & Target KB Compressor Guide - Imgediit",
    description: "Step-by-step guide to converting images to PDF, PDF to JPG, and compressing files under 20KB, 50KB, 100KB limits with 100% privacy.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "PDF Compressor Guide", path: "/pdf-compressor-guide" }
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
    const rawTitle = `${tool.name} Online Free - Imgediit`;
    title = rawTitle.length <= 65 ? rawTitle : `${tool.name} - Imgediit`;
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

/**
 * Parses and applies the SEO tags returned by the API to the DOM head.
 */
function applySeoFromApi(data) {
  try {
    // 1. Remove any previously injected dynamic tags to avoid pile up
    const oldTags = document.querySelectorAll('[data-dynamic-seo]');
    oldTags.forEach(tag => tag.remove());

    // 2. Inject meta_tags_html
    if (data.meta_tags_html && Array.isArray(data.meta_tags_html)) {
      data.meta_tags_html.forEach(tagHtml => {
        // Parse the HTML string to a DOM element
        const parser = new DOMParser();
        const doc = parser.parseFromString(tagHtml, 'text/html');
        // The element will be in the head or body of the parsed document
        const element = doc.head.firstElementChild || doc.body.firstElementChild;
        
        if (element) {
          element.setAttribute('data-dynamic-seo', 'true');
          
          const tagName = element.tagName.toLowerCase();
          
          if (tagName === 'title') {
            document.title = element.textContent;
          } else {
            // To prevent duplicates with existing static tags in index.html,
            // remove any existing tags with the same name, property or rel
            const name = element.getAttribute('name');
            const property = element.getAttribute('property');
            const rel = element.getAttribute('rel');
            
            let selector = '';
            if (name) selector = `meta[name="${name}"]`;
            else if (property) selector = `meta[property="${property}"]`;
            else if (rel) selector = `link[rel="${rel}"]`;
            
            if (selector) {
              const existing = document.querySelector(selector);
              if (existing && !existing.hasAttribute('data-dynamic-seo')) {
                existing.remove();
              }
            }
            
            document.head.appendChild(element);
          }
        }
      });
    }

    // 3. Inject schema_json_ld
    if (data.schema_json_ld) {
      const schemaScript = document.createElement('script');
      schemaScript.id = 'seo-jsonld-schema';
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-dynamic-seo', 'true');
      schemaScript.text = JSON.stringify(data.schema_json_ld);
      document.head.appendChild(schemaScript);
    }
  } catch (error) {
    console.error("Error applying SEO from API:", error);
  }
}

let lastFetchedUrl = '';
let lastFetchedData = null;

/**
 * Fetches SEO metadata from the API based on current path and domain,
 * then updates head elements. Falls back to static configurations on error.
 */
export async function fetchAndApplySeo(activeTool) {
  const apiBaseUrl = import.meta.env.VITE_SEO_API_BASE_URL || 'http://192.168.1.7:8004';
  const domainName = window.location.origin;
  const path = window.location.pathname;
  const url = `${apiBaseUrl}/api/v1/public/seo?domain_name=${encodeURIComponent(domainName)}&path=${encodeURIComponent(path)}`;

  // Deduplicate identical requests within a short timeframe
  if (url === lastFetchedUrl && lastFetchedData) {
    applySeoFromApi(lastFetchedData);
    return;
  }

  try {
    lastFetchedUrl = url;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const result = await response.json();
    if (result.success && result.data) {
      lastFetchedData = result.data;
      applySeoFromApi(result.data);
      return;
    }
    throw new Error(result.message || 'API response success is false');
  } catch (error) {
    console.warn("Failed to fetch dynamic SEO from API, using fallback local SEO config:", error);
    // Fallback to local SEO config
    const fallbackSeo = getSeoData(activeTool);
    updateMetaTags(fallbackSeo);
  }
}

