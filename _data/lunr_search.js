// // module.exports = function (
// //     data
// // ) {
    
// //     console.log("cica", data, data.eleventy.templates.posts)
// //     return JSON.stringify({ a: 1, d: Object.keys(data) })
// // }

// class LunrIndex {
//     data() {
//       return {
//         // permalink: "/search/lunr.json",
//         eleventyExcludeFromCollections: true
//       };
//     }
  
//     render(data) {
//       var pages = data.collections.writing.map(function(page) {
//         return {
//           url: page.url,
//           title: page.data.title,
//           date: page.date,
//           content: page.templateContent
//         };
//       });
//       return JSON.stringify(pages);
//     }
//   }
  
//   module.exports = () => new LunrIndex();