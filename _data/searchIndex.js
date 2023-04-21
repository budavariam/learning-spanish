const fs = require("fs");
const lunr = require("lunr");
const path = require("path");
const cheerio = require("cheerio");

function splitHTMLIntoSections(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const sections = [];
    $('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const tagName = el.tagName.toLowerCase();
      const $el = $(el);
      const title = $el.text();
      const content = [];
      // Add all following sibling elements until the next header tag
      let $next = $el.next();
      while ($next.length && !$next.is(`h1, h2, h3, h4, h5, h6`)) {
        content.push($next.html());
        $next = $next.next();
      }
  
      sections.push({
        tag: tagName,
        id: $el.attr('id'),
        title,
        content: content.join(" "),
      });
    });
    return sections
  }

function useLunr(data) {
    // const lunrRegisterPipelineFn = lunr.Pipeline.registerFunction(cb, lbl)
    // const cheerioLoad = cheerio.load(htmlContent)

    // const removeHtmlTags = lunrRegisterPipelineFn({
    //   cb: (token) => {
    //     const $ = cheerioLoad(token);
    //     return $.text();
    //   }, lbl: "plaintextData"
    // });
    const documents = data.collections.posts.map(function (page) {
        return {
            url: page.url,
            title: page.data.title,
            date: page.date,
            body: page.templateContent,
            sections: splitHTMLIntoSections(page.templateContent)
        };
    });
    fs.writeFileSync(path.resolve(__dirname, "..",  "debug-lunr-docs.json"), JSON.stringify(documents, null, 2))

    const idx = lunr(function () {
        this.ref('id')
        this.field('title')
        this.field('body')

        // Add the HTML tag removal function to the pipeline
        // this.pipeline.add(removeHtmlTags);

        documents.forEach(function (doc) {
            this.add(doc)
        }, this)
    })

    fs.writeFileSync(path.resolve(__dirname, "..", "debug-lunr-index.json"), JSON.stringify(idx, null, 2))
    return idx
}

module.exports = {
    useLunr: useLunr,
}