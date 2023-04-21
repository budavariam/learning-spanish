class LunrIndex {
  data() {
    return {
      permalink: "/search/lunr.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const useLunr = this.useLunr //defined in .eleventy.js
    const idx = useLunr(data)
    return JSON.stringify(idx);
  }
}

module.exports = new LunrIndex();