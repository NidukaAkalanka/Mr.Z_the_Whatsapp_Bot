const brain = require('brainly-scraper');

const brainly = async (question) => {
   const fetch = await brain(question);
   if (!fetch) return `_Server Error!_`;
   const data = fetch.data[0];
   const pertanyaan = data.pertanyaan;
   const jawaban = data.jawaban;
   const mergeJawaban = jawaban.map((value, index) => `${index + 1}. ${value.text}`);
   return `_📔 *Question :*_ ${pertanyaan}\n\n📖 There are ${jawaban.length} answers found!\n\n${mergeJawaban.join('\n\n')}`;
};

module.exports = brainly;