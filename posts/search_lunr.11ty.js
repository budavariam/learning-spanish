class LunrIndex {
  data() {
    return {
      permalink: "/search/lunr.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const documents = data.collections.posts.map(function (page) {
      return {
        url: page.url,
        title: page.data.title,
        date: page.date,
        content: page.templateContent,
        body: page.templateContent,
      };
    });
    const lunr = this.useLunr //defined in .eleventy.js
    const splitHTMLIntoSections = this.splitHTMLIntoSections //defined in .eleventy.js
    console.log(splitHTMLIntoSections(`<h1 id="section-1">Section 1</h1><p>Lorem ipsum dolor sit amet.</p><h2 id="subsection-1-1">Subsection 1.1</h2><p>Consectetur adipiscing elit.</p><h2 id="subsection-1-2">Subsection 1.2</h2><p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><h1 id="section-2">Section 2</h1><p>Ut enim ad minim veniam.</p>';`))

    const idx = lunr(function () {
      this.ref('id')
      this.field('title')
      this.field('body')

      documents.forEach(function (doc) {
        this.add(doc)
      }, this)
    })

    return JSON.stringify(idx);
  }
}

module.exports = new LunrIndex();