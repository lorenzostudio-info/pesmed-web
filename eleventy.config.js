import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { I18nPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default async function (eleventyConfig) {
  // Image Transform works independently, takes <img> on html and transforms automatically
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "jpeg", "jpg"],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
    // Skip remote images for now (we use URL references)
    urlPath: "/assets/img/",
    outputDir: "./_site/assets/img/",
  });

  // When site is multi-lingual
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: "it",
    errorMode: "allow-fallback",
  });

  // RSS: one feed per language
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/en/news/feed.xml",
    collection: { name: "news_en", limit: 0 },
    metadata: {
      language: "en",
      title: "PesMed News (EN)",
      subtitle: "Latest news and events from PesMed.",
      base: "https://pesmed.it/",
      author: { name: "PesMed" },
    },
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/it/news/feed.xml",
    collection: { name: "news_it", limit: 0 },
    metadata: {
      language: "it",
      title: "PesMed News (IT)",
      subtitle: "Ultime notizie ed eventi da PesMed.",
      base: "https://pesmed.it/",
      author: { name: "PesMed" },
    },
  });

  // Nunjucks filter: head (take first N items from array)
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return [];
    return array.slice(0, n);
  });

  // Nunjucks filter: find product by slug
  eleventyConfig.addFilter("findBySlug", (arr, slug) => {
    if (!Array.isArray(arr) || !slug) return {};
    return arr.find((item) => item.slug === slug) || {};
  });

  // Nunjucks filter: filter products by category
  eleventyConfig.addFilter("filterByCategory", (arr, category) => {
    if (!Array.isArray(arr) || !category) return [];
    return arr.filter((item) => item.category === category);
  });

  // Nunjucks filter: get unique categories from products
  eleventyConfig.addFilter("getCategories", (arr) => {
    if (!Array.isArray(arr)) return [];
    const cats = [...new Set(arr.map((item) => item.category).filter(Boolean))];
    return cats;
  });

  // Passtrough
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Vendor assets (served locally from node_modules via passthrough)
  // AlpineJS bundle (copied to /assets/vendor/alpine/)
  eleventyConfig.addPassthroughCopy({
    "node_modules/alpinejs/dist": "assets/vendor/alpine",
  });

  eleventyConfig.addPassthroughCopy({
    _redirects: "_redirects",
  });

  // League Spartan font files (served from /assets/vendor/fonts/league-spartan/)
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/league-spartan/files":
      "assets/vendor/fonts/league-spartan",
  });

  eleventyConfig.addPassthroughCopy("_redirects");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
  };
}
