const wiki = require("wikipedia");

module.exports = async(query) => {
   try {
     const page = await wiki.page(query);
     const summary = await page.summary();
     const picUrl = summary.originalimage.source || summary.thumbnail.source;
     const caption = `_*Title* : ${summary.title}_\n_*Description* : ${summary.description}_\n_*Link* : ${summary.content_urls.desktop.page}_\n_*Summary * : ${summary.extract}_`;
     return { picUrl, caption };
   } catch(ex) {
     return console.log("Wikipedia error: ", ex);
   }
};