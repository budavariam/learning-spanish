async function initSearch() {
    console.log(1)
    try {
        console.log(2)
        fetch('/index.json').then(result => {
            console.log(3)
            const docs = result.json();
            console.log(4)
            
            // assign an ID so it's easier to look up later, it will be the same as index
            this.idx = lunr(function () {
                this.ref('id');
                this.field('title');
                this.field('content');
                
                window.docs.forEach(function (doc, idx) {
                    doc.id = idx;
                    this.add(doc);
                }, this);
            });
            console.log(4)
            window.docs;
            console.log(window.docs)
        }).catch((e) => {
            console.error(e)
        });
    } catch (e) {
        console.error(e)
    }
// }

document.addEventListener('DOMContentLoaded', init, false);
async function init() {
    debugger
    console.log("DOM fully loaded and parsed");
    initSearch()
};

