import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { I18nPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default async function(eleventyConfig) {
	
	// Image Transform works independently, takes <img> on html and transforms automatically
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		extensions: "html",
		formats: ["webp", "jpeg"],
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
		outputPath: "/en/articles/feed.xml",
		collection: { name: "articles_en", limit: 0 },
		metadata: {
		language: "en",
		title: "PesMed News (EN)",
		subtitle: "Latest news and events from PesMed.",
		base: "https://pesmed.lorenzostudio.info/",
		author: { name: "PesMed" }
		}
	});

	eleventyConfig.addPlugin(feedPlugin, {
		type: "rss",
		outputPath: "/it/articles/feed.xml",
		collection: { name: "articles_it", limit: 0 },
		metadata: {
		language: "it",
		title: "PesMed News (IT)",
		subtitle: "Ultime notizie ed eventi da PesMed.",
		base: "https://pesmed.lorenzostudio.info/",
		author: { name: "PesMed" }
		}
	});

	eleventyConfig.addCollection("articles_en", (collectionApi) => {
		return collectionApi.getFilteredByGlob("src/en/articles/*.md").sort((a, b) => b.date - a.date);
	});

	eleventyConfig.addCollection("articles_it", (collectionApi) => {
		return collectionApi.getFilteredByGlob("src/it/articles/*.md").sort((a, b) => b.date - a.date);
	});

	// Nunjucks filter: head (take first N items from array)
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array)) return [];
		return array.slice(0, n);
	});

	// Nunjucks filter: find product by slug
	eleventyConfig.addFilter("findBySlug", (arr, slug) => {
		if (!Array.isArray(arr) || !slug) return {};
		return arr.find(item => item.slug === slug) || {};
	});

	// Passtrough
	eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

	return {
		dir: {
		input: "src",
		output: "_site",
		includes: "_includes",
		data: "_data"
		},
		templateFormats: ["njk", "md"]
	};
};
