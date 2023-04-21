class LunrIndex {
  data() {
    return {
      permalink: "/search/lunr.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    var pages = data.collections.posts.map(function(page) {
      return {
        url: page.url,
        title: page.data.title,
        date: page.date,
        content: page.templateContent
      };
    });
    return JSON.stringify(pages);
  }
}

module.exports = new LunrIndex();