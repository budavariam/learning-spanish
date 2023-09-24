const fs = require("fs");
const csvParse = require("csv-parse/sync");

const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { minify } = require("terser");
const { cache } = require('eleventy-plugin-workbox');
const { execSync } = require('child_process')

/** List of extensions that must be cached by service worker. */
const IMAGE_FORMATS = ['jpg', 'png', 'gif', 'ico', 'svg', 'jpeg', 'avif', 'webp'];
const FONT_FORMATS = ['eot', 'ttf', 'otf', 'ttc', 'woff', 'woff2'];
const DYNAMIC_FORMATS = ['js', 'css', 'mjs', 'html', 'json'];
const PAGEFIND_FORMATS = ['pf_meta', 'pf_index', 'pf_fragment', 'pagefind']
const EXTENSIONS = [...DYNAMIC_FORMATS, ...IMAGE_FORMATS, ...FONT_FORMATS, ...PAGEFIND_FORMATS];

module.exports = function (eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/webcomponent-crossword/build/webcomponent-crossword.js": "/assets/js/webcomponent-crossword.js",
    "./node_modules/webcomponent-wordlist/webcomponent-wordlist.bundled.js": "/assets/js/webcomponent-wordlist.js",
    "./node_modules/webcomponent-word-matcher/webcomponent-word-matcher.bundled.js": "/assets/js/webcomponent-word-matcher.js",
    "./node_modules/webcomponent-flashcard/dist/webcomponent-flashcard.umd.js": "/assets/js/webcomponent-flashcard.js",
  });

  // Add plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(cache, {
    /**
     * Options that will be passed to
     * [`generateSW` function](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
     * https://developer.chrome.com/docs/workbox/reference/workbox-build/#type-WebpackGenerateSWOptions
     * creates: service-worker.js
     */
    generateSWOptions: {
      modifyURLPrefix: {
        '': '/learning-spanish/',
      },
      globPatterns: [`*.{${EXTENSIONS}}`, `**/*.{${EXTENSIONS}}`],
    },
    /**
     * Directory inside _output_ folder to be used as place for
     * service worker.
     */
    // publicDirectory?: string;
    /**
     * Scope for service worker.
     * Default `/`.
     */
    scope: "./"
    /**
     * Tells if plugin should generate service worker.
     * Useful for situations when there is a need to test service worker,
     * especially in development process.
     *
     * By default, it is enabled if `NODE_ENV === 'production'`.
     */
    // enabled?: boolean;
  });


  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
  }

  eleventyConfig.addFilter("filterTagList", filterTagList)

  // Create an array of all tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      // Fail gracefully.
      callback(null, code);
    }
  });


  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = csvParse.parse(contents, {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  });

  // Customize Markdown library and settings:
  let markdownLibrary = markdownIt({
    html: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#"
    }),
    level: [1, 2, 3, 4],
    slugify: eleventyConfig.getFilter("slugify")
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return markdownLibrary.render(content);
  });

  // Override Browsersync defaults (used only with --serve)
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  eleventyConfig.on('eleventy.after', () => {
    console.log("Start pageIndex generation...")
    execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
  })

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    // -----------------------------------------------------------------
    // If your site deploys to a subdirectory, change `pathPrefix`.
    // Don't worry about leading and trailing slashes, we normalize these.

    // If you don't have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`

    // Optional (default is shown)
    pathPrefix: "/",
    // -----------------------------------------------------------------

    // These are all optional (defaults are shown):
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
