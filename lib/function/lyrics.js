const { requestLyricsFor, requestAuthorFor, requestTitleFor } = require("solenolyrics");

module.exports = async(title) => {
   return new Promise(async (resolve, rejecet) => {
     try {
       const author = (await requestAuthorFor(title)) || "Not known";
       const fetchTitle = (await requestTitleFor(title)) || "Not known";
       const lyrics = (await requestLyricsFor(title)) || undefined;
       if (!lyrics) return resolve(false);
       const text = `
_🧑‍🎤 *Popularized By :* ${author}_
_🎵 *Song Title :* ${fetchTitle}_

${lyrics}
       `;
       return resolve(text);
     } catch (exception) {
       return rejecet("Not found/Error Lyrics!");
     }
   });
};